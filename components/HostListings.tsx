import React, { useState } from 'react';
import { Listing } from '../types';
import ListingForm from './ListingForm';
import { PlusCircleIcon } from './Icons';

interface HostListingsProps {
  listings: Listing[];
  onAddListing: (listing: Omit<Listing, 'id' | 'hostId' | 'location'>) => void;
  onDeleteListing: (listingId: string) => void;
}

const HostListings: React.FC<HostListingsProps> = ({ listings, onAddListing, onDeleteListing }) => {
  const [showForm, setShowForm] = useState(false);

  const handleAddListingSubmit = (listing: Omit<Listing, 'id' | 'hostId' | 'location'>) => {
    onAddListing(listing);
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-white">My Listings</h1>
            <p className="text-slate-400 mt-1">Manage your available parking spaces.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-md shadow-sm hover:opacity-90 transition-opacity"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Add New Listing
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Address</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Rate</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Approval</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {listings.map(listing => (
                <tr key={listing.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{listing.address}</div>
                    <div className="text-xs text-slate-400 max-w-xs truncate">{listing.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">${listing.rate} / {listing.rateType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${listing.approvalMode === 'AUTOMATIC' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                        {listing.approvalMode}
                     </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                        <button className="text-purple-400 hover:text-purple-300">Edit</button>
                        <button className="text-slate-400 hover:text-slate-300">Pause</button>
                        <button onClick={() => onDeleteListing(listing.id)} className="text-red-500 hover:text-red-400">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
               {listings.length === 0 && (
                <tr>
                    <td colSpan={4} className="text-center text-slate-400 py-8">You have no active listings.</td>
                </tr>
               )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-30">
          <div className="w-full max-w-lg m-4">
              <ListingForm 
                onAddListing={handleAddListingSubmit}
                onCancel={() => setShowForm(false)}
              />
          </div>
        </div>
      )}
    </div>
  );
};

export default HostListings;
