
import React from 'react';
import { CheckCircleIcon } from './Icons';

interface PostReservationWaitlistModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const PostReservationWaitlistModal: React.FC<PostReservationWaitlistModalProps> = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-20">
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6 w-full max-w-sm m-4 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            <CheckCircleIcon className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Reservation Complete!</h2>
        <p className="text-slate-400 mb-6">Want to be the first to know about new features and exclusive parking spots? Join our waitlist!</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 border border-transparent rounded-md shadow-sm hover:opacity-90 w-full sm:w-auto"
          >
            Join Waitlist
          </button>
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-slate-200 bg-slate-600 border border-transparent rounded-md shadow-sm hover:bg-slate-500 w-full sm:w-auto"
          >
            No, Thanks
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostReservationWaitlistModal;
