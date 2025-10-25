import React, { useState } from 'react';
import { Listing, ApprovalMode } from '../types';

interface ListingFormProps {
  onAddListing: (listing: Omit<Listing, 'id' | 'hostId' | 'location'>) => void;
  onCancel: () => void;
}

const ListingForm: React.FC<ListingFormProps> = ({ onAddListing, onCancel }) => {
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [rate, setRate] = useState<number | ''>('');
  const [rateType, setRateType] = useState<'hourly' | 'flat'>('hourly');
  const [approvalMode, setApprovalMode] = useState<ApprovalMode>(ApprovalMode.AUTOMATIC);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !description || rate === '') return;
    onAddListing({
      address,
      description,
      rate: Number(rate),
      rateType,
      availability: { start: startTime, end: endTime },
      approvalMode,
    });
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
      <h2 className="text-2xl font-bold text-white mb-4">Add New Parking Space</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-slate-300">Address</label>
          <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"/>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"/>
        </div>
        <div className="flex gap-4">
          <div className="flex-grow">
            <label htmlFor="rate" className="block text-sm font-medium text-slate-300">Rate ($)</label>
            <input type="number" id="rate" value={rate} onChange={(e) => setRate(e.target.value === '' ? '' : parseFloat(e.target.value))} required min="0" step="0.5" className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"/>
          </div>
          <div>
            <label htmlFor="rateType" className="block text-sm font-medium text-slate-300">Rate Type</label>
            <select id="rateType" value={rateType} onChange={(e) => setRateType(e.target.value as 'hourly' | 'flat')} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-600 bg-slate-700 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md">
              <option value="hourly">Hourly</option>
              <option value="flat">Flat</option>
            </select>
          </div>
        </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-slate-300">Available From</label>
                <input type="time" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"/>
            </div>
            <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-slate-300">Available Until</label>
                <input type="time" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"/>
            </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300">Approval Mode</label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input id="auto" name="approval-mode" type="radio" value={ApprovalMode.AUTOMATIC} checked={approvalMode === ApprovalMode.AUTOMATIC} onChange={(e) => setApprovalMode(e.target.value as ApprovalMode)} className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300"/>
              <label htmlFor="auto" className="ml-3 block text-sm font-medium text-slate-300">Automatic Approval</label>
            </div>
            <div className="flex items-center">
              <input id="manual" name="approval-mode" type="radio" value={ApprovalMode.MANUAL} checked={approvalMode === ApprovalMode.MANUAL} onChange={(e) => setApprovalMode(e.target.value as ApprovalMode)} className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300"/>
              <label htmlFor="manual" className="ml-3 block text-sm font-medium text-slate-300">Manual Approval</label>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-200 bg-slate-600 border border-transparent rounded-md shadow-sm hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 border border-transparent rounded-md shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            Add Listing
          </button>
        </div>
      </form>
    </div>
  );
};

export default ListingForm;
