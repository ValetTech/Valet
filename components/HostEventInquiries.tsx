import React from 'react';
import { EventInquiry, EventInquiryStatus, Listing } from '../types';

interface HostEventInquiriesProps {
  inquiries: (EventInquiry & { listing?: Listing })[];
  onUpdateStatus: (inquiryId: string, status: EventInquiryStatus) => void;
}

const getStatusPill = (status: EventInquiryStatus) => {
    switch(status) {
        case EventInquiryStatus.PENDING:
            return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900 text-yellow-300">Pending</span>
        case EventInquiryStatus.CONTACTED:
            return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900 text-blue-300">Contacted</span>
        case EventInquiryStatus.REJECTED:
            return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900 text-red-300">Rejected</span>
    }
}

const HostEventInquiries: React.FC<HostEventInquiriesProps> = ({ inquiries, onUpdateStatus }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Event Inquiries</h1>
        <p className="text-slate-400 mt-1">Manage event requests for your spaces.</p>
      </div>

      <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Contact & Event</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date & Attendees</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {inquiries.map(inquiry => (
                <tr key={inquiry.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{inquiry.userName} ({inquiry.userEmail})</div>
                    <div className="text-xs text-slate-400">{inquiry.eventType} at {inquiry.listing?.address || 'Unknown'}</div>
                     <div className="text-xs text-slate-500 mt-1 italic max-w-xs truncate">"{inquiry.message}"</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    <div>{inquiry.eventDate.toLocaleDateString()}</div>
                    <div className="text-xs text-slate-400">{inquiry.numberOfAttendees} people</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusPill(inquiry.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {inquiry.status === EventInquiryStatus.PENDING && (
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => onUpdateStatus(inquiry.id, EventInquiryStatus.CONTACTED)}
                          className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Mark as Contacted</button>
                        <button 
                          onClick={() => onUpdateStatus(inquiry.id, EventInquiryStatus.REJECTED)}
                          className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr>
                    <td colSpan={4} className="text-center text-slate-400 py-8">You have no event inquiries.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HostEventInquiries;
