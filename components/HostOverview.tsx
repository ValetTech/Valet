import React from 'react';
import { Listing, Reservation, ReservationStatus } from '../types';
import { ClockIcon, ListIcon, CheckCircleIcon } from './Icons';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 flex items-center space-x-4">
    <div className="bg-slate-700 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-sm text-slate-400">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

interface HostOverviewProps {
  listings: Listing[];
  reservations: Reservation[];
}

const HostOverview: React.FC<HostOverviewProps> = ({ listings, reservations }) => {
  const activeListings = listings.length;
  const pendingRequests = reservations.filter(r => r.status === ReservationStatus.PENDING).length;
  const upcomingReservations = reservations.filter(
    r => r.status === ReservationStatus.APPROVED && r.startTime > new Date()
  ).length;

  return (
    <div className="space-y-8">
       <div className="text-left">
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-slate-400 mt-1">Here's a snapshot of your hosting activity.</p>
       </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Active Listings" value={activeListings} icon={<ListIcon className="h-6 w-6 text-purple-400" />} />
        <StatCard title="Pending Requests" value={pendingRequests} icon={<ClockIcon className="h-6 w-6 text-yellow-400" />} />
        <StatCard title="Upcoming Reservations" value={upcomingReservations} icon={<CheckCircleIcon className="h-6 w-6 text-green-400" />} />
      </div>
       <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Quick Links</h2>
            <div className="flex flex-wrap gap-4">
                <p className="text-slate-400 text-sm">Use the tabs above to manage your listings and reservations.</p>
            </div>
        </div>
    </div>
  );
};

export default HostOverview;
