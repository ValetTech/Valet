
import React, { useState } from 'react';
import { UserRole } from '../types';

interface WaitlistFormProps {
  userRole: UserRole;
  onJoin: (email: string, answers: Record<string, string>) => void;
  onCancel: () => void;
}

const driverQuestions = [
  { id: 'area', label: 'What area are you usually looking for parking in?' },
  { id: 'challenge', label: "What's your biggest parking challenge?" },
];

const hostQuestions = [
  { id: 'spots', label: 'How many parking spots do you have?' },
  { id: 'motivation', label: 'What would make you list your spot?' },
];

const WaitlistForm: React.FC<WaitlistFormProps> = ({ userRole, onJoin, onCancel }) => {
  const [email, setEmail] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = userRole === UserRole.DRIVER ? driverQuestions : hostQuestions;

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onJoin(email, answers);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
      <h2 className="text-2xl font-bold text-white mb-4">Join Our Waitlist</h2>
      <p className="text-slate-400 mb-6">
        {userRole === UserRole.DRIVER
          ? "We're expanding! Get notified when new spots are available in your area."
          : "Be the first to know when you can start earning with your parking space."}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            placeholder="you@example.com"
          />
        </div>

        {questions.map(q => (
          <div key={q.id}>
            <label htmlFor={q.id} className="block text-sm font-medium text-slate-300">{q.label}</label>
            <input
              type="text"
              id={q.id}
              value={answers[q.id] || ''}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        ))}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-200 bg-slate-600 border border-transparent rounded-md shadow-sm hover:bg-slate-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 border border-transparent rounded-md shadow-sm hover:opacity-90"
          >
            Join Waitlist
          </button>
        </div>
      </form>
    </div>
  );
};

export default WaitlistForm;
