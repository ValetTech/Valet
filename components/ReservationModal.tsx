
import React, { useState } from 'react';
import { Listing, Reservation, ReservationStatus, ApprovalMode } from '../types';

interface ReservationModalProps {
  listing: Listing;
  onClose: () => void;
  onReserve: (reservation: Omit<Reservation, 'id' | 'driverId'>) => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ listing, onClose, onReserve }) => {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(new Date().getTime() + 60 * 60 * 1000)); // Default 1 hour

  const handleReserve = () => {
    const status = listing.approvalMode === ApprovalMode.AUTOMATIC ? ReservationStatus.APPROVED : ReservationStatus.PENDING;
    onReserve({
      listingId: listing.id,
      startTime,
      endTime,
      status,
    });
  };
  
  const formatDateForInput = (date: Date) => {
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-20">
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6 w-full max-w-md m-4">
        <h2 className="text-2xl font-bold text-white mb-2">Reserve Spot</h2>
        <p className="text-purple-300 font-semibold mb-4">{listing.address}</p>
        <p className="text-slate-400 mb-4">{listing.description}</p>
        <div className="mb-4">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">${listing.rate}<span className="text-lg font-normal text-slate-400">/{listing.rateType}</span></span>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Start Time</label>
            <input 
              type="datetime-local" 
              value={formatDateForInput(startTime)}
              onChange={e => setStartTime(new Date(e.target.value))}
              className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">End Time</label>
            <input 
              type="datetime-local" 
              value={formatDateForInput(endTime)}
              onChange={e => setEndTime(new Date(e.target.value))}
              className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-200 bg-slate-600 border border-transparent rounded-md shadow-sm hover:bg-slate-500">Cancel</button>
          <button onClick={handleReserve} className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 border border-transparent rounded-md shadow-sm hover:opacity-90">Confirm Reservation</button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
