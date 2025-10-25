import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HostDashboard from './components/HostDashboard';
import DriverDashboard from './components/DriverDashboard';
import EventsDashboard from './components/EventsDashboard';
import Notification from './components/Notification';
import WaitlistForm from './components/WaitlistForm';
import PostReservationWaitlistModal from './components/PostReservationWaitlistModal';
import LoadingSpinner from './components/LoadingSpinner';
import { UserRole, Listing, Reservation, ReservationStatus, EventInquiry, EventInquiryStatus } from './types';
import { api } from './services/api';

const CURRENT_HOST_ID = 'h1';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.DRIVER);
  const [listings, setListings] = useState<Listing[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [eventInquiries, setEventInquiries] = useState<EventInquiry[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [notification, setNotification] = useState<string | null>(null);
  const [showPostReservationWaitlist, setShowPostReservationWaitlist] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState<UserRole | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.getInitialData();
        setListings(data.listings);
        setReservations(data.reservations);
        setEventInquiries(data.eventInquiries);
      } catch (err) {
        setError('Failed to load app data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddListing = async (newListingData: Omit<Listing, 'id' | 'hostId' | 'location'>) => {
    try {
      const newListing = await api.addListing(newListingData);
      setListings(prev => [newListing, ...prev]);
      setNotification('New listing added successfully!');
    } catch (err) {
      setNotification('Error: Could not add listing.');
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    try {
      await api.deleteListing(listingId);
      setListings(prev => prev.filter(l => l.id !== listingId));
      setReservations(prev => prev.filter(r => r.listingId !== listingId));
      setEventInquiries(prev => prev.filter(i => i.listingId !== listingId));
      setNotification('Listing has been deleted.');
    } catch (err) {
      setNotification('Error: Could not delete listing.');
    }
  };

  const handleAddReservation = async (newReservationData: Omit<Reservation, 'id'|'driverId'>) => {
    try {
      const newReservation = await api.addReservation(newReservationData);
      setReservations(prev => [...prev, newReservation]);
      const message = newReservation.status === ReservationStatus.APPROVED 
        ? 'Your reservation is confirmed!' 
        : 'Your reservation request has been sent.';
      setNotification(message);
      setShowPostReservationWaitlist(true);
    } catch (err) {
       setNotification('Error: Could not make reservation.');
    }
  }

  const handleUpdateReservationStatus = async (reservationId: string, status: ReservationStatus) => {
      try {
        await api.updateReservationStatus(reservationId, status);
        setReservations(prev => prev.map(res => 
            res.id === reservationId ? { ...res, status } : res
        ));
        setNotification(`Reservation ${status.toLowerCase()}.`);
      } catch (err) {
        setNotification('Error: Could not update reservation.');
      }
  }

  const handleEventInquirySubmit = async (newInquiryData: Omit<EventInquiry, 'id' | 'status'>) => {
    try {
      const newInquiry = await api.addEventInquiry(newInquiryData);
      setEventInquiries(prev => [newInquiry, ...prev]);
      setNotification('Your event inquiry has been sent to the host!');
    } catch (err) {
      setNotification('Error: Could not send inquiry.');
    }
  };

  const handleUpdateEventInquiryStatus = async (inquiryId: string, status: EventInquiryStatus) => {
    try {
      await api.updateEventInquiryStatus(inquiryId, status);
      setEventInquiries(prev => prev.map(inquiry =>
        inquiry.id === inquiryId ? { ...inquiry, status } : inquiry
      ));
      setNotification(`Inquiry status updated to ${status.toLowerCase()}.`);
    } catch (err) {
      setNotification('Error: Could not update inquiry status.');
    }
  };

  const handleJoinWaitlist = async (role: UserRole, email: string, answers: Record<string, string>) => {
    try {
      await api.joinWaitlist(role, email, answers);
      setShowWaitlistModal(null);
      setNotification(`You've been added to the ${role.toLowerCase()} waitlist! We'll be in touch.`);
    } catch (err) {
      setNotification('Error: Could not join waitlist.');
    }
  };

  const hostListings = listings.filter(l => l.hostId === CURRENT_HOST_ID);
  const hostListingIds = hostListings.map(l => l.id);
  const hostReservations = reservations.filter(r => hostListingIds.includes(r.listingId));
  const hostEventInquiries = eventInquiries.filter(i => i.hostId === CURRENT_HOST_ID);

  const renderDashboard = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      );
    }

    if(error) {
       return <div className="text-center text-red-400">{error}</div>
    }

    switch (userRole) {
      case UserRole.HOST:
        return (
          <HostDashboard 
            listings={hostListings}
            reservations={hostReservations}
            eventInquiries={hostEventInquiries}
            onAddListing={handleAddListing}
            onDeleteListing={handleDeleteListing}
            onUpdateReservationStatus={handleUpdateReservationStatus}
            onUpdateEventInquiryStatus={handleUpdateEventInquiryStatus}
          />
        );
      case UserRole.EVENT_PLANNER:
        return (
          <EventsDashboard
            listings={listings}
            onInquiry={handleEventInquirySubmit}
          />
        );
      case UserRole.DRIVER:
      default:
        return (
          <DriverDashboard 
            listings={listings} 
            onReserve={handleAddReservation} 
            onJoinWaitlist={() => setShowWaitlistModal(UserRole.DRIVER)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header userRole={userRole} setUserRole={setUserRole} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderDashboard()}
      </main>
      {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
      
      {showPostReservationWaitlist && (
        <PostReservationWaitlistModal 
          onClose={() => setShowPostReservationWaitlist(false)}
          onConfirm={() => {
            setShowPostReservationWaitlist(false);
            setShowWaitlistModal(UserRole.DRIVER);
          }}
        />
      )}

      {showWaitlistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-30">
            <div className="w-full max-w-lg m-4">
                <WaitlistForm 
                    userRole={showWaitlistModal}
                    onJoin={(email, answers) => {
                        handleJoinWaitlist(showWaitlistModal, email, answers);
                    }}
                    onCancel={() => setShowWaitlistModal(null)}
                />
            </div>
        </div>
      )}
    </div>
  );
};

export default App;
