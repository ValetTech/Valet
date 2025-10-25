import React, { useState } from 'react';
import { Listing, EventInquiry } from '../types';
import EventInquiryModal from './EventInquiryModal';
import { CalendarIcon } from './Icons';

interface EventsDashboardProps {
  listings: Listing[];
  onInquiry: (inquiry: Omit<EventInquiry, 'id' | 'status'>) => void;
}

const EventListingCard: React.FC<{ 
    listing: Listing; 
    onSelect: () => void;
}> = ({ listing, onSelect }) => (
    <div 
        className="bg-slate-800 rounded-lg shadow-lg p-5 border border-slate-700 hover:border-purple-500 transition-all duration-200 flex flex-col"
    >
        <p className="font-semibold text-lg text-white">{listing.address}</p>
        <p className="text-sm text-slate-400 mt-1 flex-grow h-10 overflow-hidden">{listing.description}</p>
        <div className="mt-4 flex justify-between items-center">
            <span className="text-xl font-bold text-purple-400">Contact for pricing</span>
            <button onClick={onSelect} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-md shadow-sm hover:opacity-90 transition-opacity">
                <CalendarIcon className="h-4 w-4" />
                Inquire
            </button>
        </div>
    </div>
);


const EventsDashboard: React.FC<EventsDashboardProps> = ({ listings, onInquiry }) => {
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
    const eventListings = listings.filter(l => l.suitableForEvents);

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-2">
                    Book Unique Event Spaces
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">Discover and book unconventional spaces like private driveways and spacious lots for your next event.</p>
            </div>

            {eventListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {eventListings.map(listing => (
                    <EventListingCard 
                        key={listing.id} 
                        listing={listing} 
                        onSelect={() => setSelectedListing(listing)} 
                    />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-800 rounded-lg">
                    <CalendarIcon className="h-12 w-12 mx-auto text-slate-500" />
                    <h3 className="mt-2 text-lg font-medium text-white">No Event Spaces Available</h3>
                    <p className="mt-1 text-sm text-slate-400">Check back later for new and unique event locations.</p>
                </div>
            )}

            {selectedListing && (
                <EventInquiryModal 
                    listing={selectedListing}
                    onClose={() => setSelectedListing(null)}
                    onSubmit={(inquiry) => {
                        onInquiry({ ...inquiry, listingId: selectedListing.id, hostId: selectedListing.hostId });
                        setSelectedListing(null);
                    }}
                />
            )}
        </div>
    );
};

export default EventsDashboard;
