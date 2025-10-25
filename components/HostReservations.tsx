import React from 'react';
import { Reservation, Listing, ReservationStatus, ApprovalMode } from '../types';

interface HostReservationsProps {
  reservations: Reservation[];
  listings: Listing[];
  onUpdateReservationStatus: (reservationId: string, status: ReservationStatus) => void;
}

const getStatusPill = (status: ReservationStatus) => {
    switch(status) {
        case ReservationStatus.APPROVED:
            return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-300">Approved</span>
        case ReservationStatus.PENDING:
            return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900 text-yellow-300">Pending</span>
        case ReservationStatus.REJECTED:
            return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900 text-red-300">Rejected</span>
        case ReservationStatus.COMPLETED:
            return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-700 text-slate-300">Completed</span>
    }
}

const HostReservations: React.FC<HostReservationsProps> = ({ reservations, listings, onUpdateReservationStatus }) => {
  const reservationsWithListing = reservations.map(res => {
    const listing = listings.find(l => l.id === res.listingId);
    return { ...res, listing };
  }).sort((a, b) => b.startTime.getTime() - a.startTime.getTime()); // Sort by most recent

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Reservation Management</h1>
        <p className="text-slate-400 mt-1">Review and manage all bookings for your spots.</p>
      </div>

      <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Driver & Spot</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date & Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {reservationsWithListing.map(({ listing, ...res }) => (
                <tr key={res.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">Driver ID: {res.driverId}</div>
                    <div className="text-xs text-slate-400">{listing?.address || 'Unknown Listing'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    <div>{res.startTime.toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="text-xs text-slate-400">to {res.endTime.toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusPill(res.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {res.status === ReservationStatus.PENDING && listing?.approvalMode === ApprovalMode.MANUAL && (
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => onUpdateReservationStatus(res.id, ReservationStatus.APPROVED)}
                          className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700">Approve</button>
                        <button 
                          onClick={() => onUpdateReservationStatus(res.id, ReservationStatus.REJECTED)}
                          className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {reservations.length === 0 && (
                <tr>
                    <td colSpan={4} className="text-center text-slate-400 py-8">You have no reservations yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HostReservations;
