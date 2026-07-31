export type EventVisibility = "public" | "private";

export type EventStatus = "upcoming" | "completed" | "cancelled";

export interface EventOwner {
  id: string;
  name: string;
  profile?: string;
  country?: string;
  nationality?: string;
  state?: string;
}

export interface EventGuest {
  userId: string;
}

export interface MemberEvent {
  id: string;
  eventName: string;
  type: string;
  startDate: string;
  endDate: string;
  startTime: string;
  details: string;
  guests: EventGuest[];
  visibility: EventVisibility;
  status: EventStatus;
  price: number;
  attendPerson: number;
  createdAt: string;
  updatedAt: string;
  owner: EventOwner | null;
  ownerId: string;
}

export interface EventFormValues {
  eventName: string;
  type: string;
  startDate: string;
  endDate: string;
  startTime: string;
  details: string;
  price: string;
  visibility: EventVisibility;
  status: EventStatus;
  guestUserIds: string;
}

export type BookingRequestStatus = "pending" | "accepted" | "rejected";
export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled";

export interface EventBookingEvent {
  id: string;
  eventName: string;
  startDate: string;
  endDate: string;
  details: string;
  price: number;
  status: EventStatus;
  ownerId: string;
}

export interface EventBooking {
  id: string;
  event: EventBookingEvent | null;
  eventId: string;
  userId: string;
  bookingRequest: BookingRequestStatus | string;
  paymentStatus: PaymentStatus | string;
  paymentDate: string | null;
  paymentAmount: number;
  currency: string;
  checkoutSessionId?: string;
  createdAt: string;
  updatedAt: string;
}
