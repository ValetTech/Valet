import React, { useState } from 'react';
import { Listing, Reservation, ReservationStatus, EventInquiry, EventInquiryStatus } from '../types';
import EarningsSimulator from './EarningsSimulator';
import HostOverview from './HostOverview';
import HostListings from './HostListings';
import HostReservations from './HostReservations';
import HostEventInquiries from './HostEventInquiries';
import { ChartPieIcon, CurrencyDollarIcon, ListIcon, ClockIcon, CalendarIcon } from './Icons';

interface HostDashboardProps {
  listings: Listing[];
  reservations: Reservation[];
  eventInquiries: EventInquiry[];
  onAddListing: (listing: Omit<Listing, 'id' | 'hostId' | 'location'>) => void;
  onDeleteListing: (listingId: string) => void;
  onUpdateReservationStatus: (reservationId: string, status: ReservationStatus) => void;
  onUpdateEventInquiryStatus: (inquiryId: string, status: EventInquiryStatus) => void;
}

type Tab = 'overview' | 'listings' | 'reservations' | 'events' | 'earnings';

const HostDashboard: React.FC<HostDashboardProps> = (props) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs: { id: Tab; name: string; icon: React.ReactNode }[] = [
    { id: 'overview', name: 'Overview', icon: <ChartPieIcon className="h-5 w-5 mr-2" /> },
    { id: 'listings', name: 'My Listings', icon: <ListIcon className="h-5 w-5 mr-2" /> },
    { id: 'reservations', name: 'Reservations', icon: <ClockIcon className="h-5 w-5 mr-2" /> },
    { id: 'events', name: 'Event Inquiries', icon: <CalendarIcon className="h-5 w-5 mr-2" /> },
    { id: 'earnings', name: 'Earnings', icon: <CurrencyDollarIcon className="h-5 w-5 mr-2" /> },
  ];

  const inquiriesWithListingData = props.eventInquiries.map(inquiry => ({
    ...inquiry,
    listing: props.listings.find(l => l.id === inquiry.listingId)
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="border-b border-slate-700">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                ${activeTab === tab.id
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-500'
                }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === 'overview' && <HostOverview listings={props.listings} reservations={props.reservations} />}
        {activeTab === 'listings' && <HostListings listings={props.listings} onAddListing={props.onAddListing} onDeleteListing={props.onDeleteListing} />}
        {activeTab === 'reservations' && <HostReservations listings={props.listings} reservations={props.reservations} onUpdateReservationStatus={props.onUpdateReservationStatus} />}
        {activeTab === 'events' && <HostEventInquiries inquiries={inquiriesWithListingData} onUpdateStatus={props.onUpdateEventInquiryStatus} />}
        {activeTab === 'earnings' && (
           <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-2">
                  Your Earning Potential
                </h1>
                <p className="text-lg text-slate-400">See how much you can make by renting out your parking space.</p>
              </div>
              <EarningsSimulator />
            </div>
        )}
      </div>
    </div>
  );
};

export default HostDashboard;