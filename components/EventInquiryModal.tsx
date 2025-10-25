import React, { useState } from 'react';
import { Listing, EventInquiry } from '../types';

interface EventInquiryModalProps {
  listing: Listing;
  onClose: () => void;
  onSubmit: (inquiry: Omit<EventInquiry, 'id' | 'listingId' | 'hostId' | 'status'>) => void;
}

const EventInquiryModal: React.FC<EventInquiryModalProps> = ({ listing, onClose, onSubmit }) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [numberOfAttendees, setNumberOfAttendees] = useState<number | ''>('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail || !eventType || !eventDate || numberOfAttendees === '') return;
    
    onSubmit({
        userName,
        userEmail,
        eventType,
        eventDate,
        numberOfAttendees: Number(numberOfAttendees),
        message,
    });
  };
  
  const formatDateForInput = (date: Date) => {
    const adjustedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    return adjustedDate.toISOString().slice(0, 10);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-20">
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6 w-full max-w-lg m-4">
        <h2 className="text-2xl font-bold text-white mb-2">Inquire About Event Space</h2>
        <p className="text-purple-300 font-semibold mb-4">{listing.address}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
           <div>
            <label className="block text-sm font-medium text-slate-300">Your Name</label>
            <input 
              type="text" 
              value={userName}
              onChange={e => setUserName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Your Email</label>
            <input 
              type="email" 
              value={userEmail}
              onChange={e => setUserEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-300">Event Type</label>
                <input 
                type="text" 
                placeholder="e.g., Birthday Party, Pop-up"
                value={eventType}
                onChange={e => setEventType(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300">Number of Attendees</label>
                <input 
                type="number" 
                value={numberOfAttendees}
                onChange={e => setNumberOfAttendees(e.target.value === '' ? '' : parseInt(e.target.value))}
                required
                min="1"
                className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
            </div>
          </div>
           <div>
            <label className="block text-sm font-medium text-slate-300">Requested Date</label>
            <input 
              type="date" 
              value={formatDateForInput(eventDate)}
              min={formatDateForInput(new Date())}
              onChange={e => setEventDate(new Date(e.target.value))}
              className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Message (Optional)</label>
            <textarea
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Tell the host a bit about your event..."
              className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        
            <div className="mt-6 flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-200 bg-slate-600 border border-transparent rounded-md shadow-sm hover:bg-slate-500">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 border border-transparent rounded-md shadow-sm hover:opacity-90">Send Inquiry</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EventInquiryModal;
