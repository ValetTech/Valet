
export enum UserRole {
  HOST = 'HOST',
  DRIVER = 'DRIVER',
  EVENT_PLANNER = 'EVENT_PLANNER',
}

export enum ApprovalMode {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
}

export enum ReservationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    COMPLETED = 'COMPLETED',
}

export enum EventInquiryStatus {
    PENDING = 'PENDING',
    CONTACTED = 'CONTACTED',
    REJECTED = 'REJECTED',
}

export interface Listing {
  id: string;
  hostId: string;
  address: string;
  description: string;
  rate: number;
  rateType: 'hourly' | 'flat';
  availability: {
    start: string; // "HH:MM"
    end: string;   // "HH:MM"
  };
  approvalMode: ApprovalMode;
  location: {
    latitude: number;
    longitude: number;
  };
  suitableForEvents?: boolean;
}

export interface Reservation {
  id: string;
  listingId: string;
  driverId: string;
  startTime: Date;
  endTime: Date;
  status: ReservationStatus;
}

export interface EventInquiry {
    id: string;
    listingId: string;
    hostId: string;
    userName: string;
    userEmail: string;
    eventType: string;
    eventDate: Date;
    numberOfAttendees: number;
    message: string;
    status: EventInquiryStatus;
}

export interface Location {
  latitude: number;
  longitude: number;
}