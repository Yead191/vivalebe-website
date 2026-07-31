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
  price?: number;
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
  visibility: EventVisibility;
  status: EventStatus;
  guestUserIds: string;
}
