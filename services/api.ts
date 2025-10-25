import { 
  Listing, 
  Reservation, 
  EventInquiry, 
  UserRole,
  ReservationStatus,
  EventInquiryStatus
} from '../types';
import { initialListings, initialReservations, initialEventInquiries } from './mockData';

// --- In-memory database ---
let listings: Listing[] = [...initialListings];
let reservations: Reservation[] = [...initialReservations];
let eventInquiries: EventInquiry[] = [...initialEventInquiries];
let waitlist: { email: string, role: UserRole, answers: Record<string, string> }[] = [];

const CURRENT_HOST_ID = 'h1';
const CURRENT_DRIVER_ID = 'd-current';

// --- API Simulation ---

const simulateNetworkDelay = (delay = 500) => new Promise(resolve => setTimeout(resolve, delay));

// A helper to generate unique IDs
const generateId = (prefix: string) => `${prefix}${Date.now()}${Math.random().toString(36).substring(2, 7)}`;


export const api = {
  // --- FETCH ALL INITIAL DATA ---
  getInitialData: async () => {
    await simulateNetworkDelay(800);
    console.log("API: Fetching all initial data...");
    return {
      listings,
      reservations,
      eventInquiries
    };
  },

  // --- LISTINGS API ---
  addListing: async (newListingData: Omit<Listing, 'id' | 'hostId' | 'location'>): Promise<Listing> => {
    await simulateNetworkDelay();
    const newListing: Listing = {
      ...newListingData,
      id: generateId('l'),
      hostId: CURRENT_HOST_ID,
      location: { latitude: 37.7749 + (Math.random() - 0.5) * 0.05, longitude: -122.4194 + (Math.random() - 0.5) * 0.05 }, // Randomize location slightly
    };
    listings = [newListing, ...listings];
    console.log("API: Added new listing", newListing);
    return newListing;
  },

  deleteListing: async (listingId: string): Promise<string> => {
    await simulateNetworkDelay();
    listings = listings.filter(l => l.id !== listingId);
    // Also remove associated reservations and inquiries
    reservations = reservations.filter(r => r.listingId !== listingId);
    eventInquiries = eventInquiries.filter(i => i.listingId !== listingId);
    console.log("API: Deleted listing", listingId);
    return listingId;
  },

  // --- RESERVATIONS API ---
  addReservation: async (newReservationData: Omit<Reservation, 'id' | 'driverId'>): Promise<Reservation> => {
    await simulateNetworkDelay();
    // In a real backend, you would check for overlapping reservations here.
    const reservationToAdd: Reservation = {
      ...newReservationData,
      id: generateId('r'),
      driverId: CURRENT_DRIVER_ID,
    };
    reservations = [...reservations, reservationToAdd];
    console.log("API: Added new reservation", reservationToAdd);
    return reservationToAdd;
  },

  updateReservationStatus: async (reservationId: string, status: ReservationStatus): Promise<Reservation> => {
    await simulateNetworkDelay();
    let updatedReservation: Reservation | undefined;
    reservations = reservations.map(res => {
      if (res.id === reservationId) {
        updatedReservation = { ...res, status };
        return updatedReservation;
      }
      return res;
    });
    if (!updatedReservation) throw new Error("Reservation not found");
    console.log("API: Updated reservation status", { reservationId, status });
    return updatedReservation;
  },

  // --- EVENT INQUIRIES API ---
  addEventInquiry: async (newInquiryData: Omit<EventInquiry, 'id' | 'status'>): Promise<EventInquiry> => {
    await simulateNetworkDelay();
    const inquiryToAdd: EventInquiry = {
      ...newInquiryData,
      id: generateId('ei'),
      status: EventInquiryStatus.PENDING,
    };
    eventInquiries = [inquiryToAdd, ...eventInquiries];
    console.log("API: Added new event inquiry", inquiryToAdd);
    return inquiryToAdd;
  },

  updateEventInquiryStatus: async (inquiryId: string, status: EventInquiryStatus): Promise<EventInquiry> => {
    await simulateNetworkDelay();
    let updatedInquiry: EventInquiry | undefined;
    eventInquiries = eventInquiries.map(inquiry => {
      if (inquiry.id === inquiryId) {
        updatedInquiry = { ...inquiry, status };
        return updatedInquiry;
      }
      return inquiry;
    });
    if (!updatedInquiry) throw new Error("Inquiry not found");
    console.log("API: Updated event inquiry status", { inquiryId, status });
    return updatedInquiry;
  },

  // --- WAITLIST API ---
  joinWaitlist: async (role: UserRole, email: string, answers: Record<string, string>): Promise<{email: string, role: UserRole}> => {
    await simulateNetworkDelay();
    const entry = { role, email, answers };
    waitlist.push(entry);
    console.log("API: User joined waitlist", entry);
    console.log("Current Waitlist:", waitlist);
    return { email, role };
  }
};
