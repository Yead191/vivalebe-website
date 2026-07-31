"use server";

import { getImageUrl } from "@/helpers/getImageUrl";
import { myFetch } from "@/helpers/myFetch";
import { revalidateTags } from "@/helpers/revalidateTags";
import type {
  EventBooking,
  EventBookingEvent,
  EventFormValues,
  EventGuest,
  EventOwner,
  EventStatus,
  EventVisibility,
  MemberEvent,
} from "./types";

interface EventListResult {
  events: MemberEvent[];
  pagination: {
    total: number;
    limit: number;
    page: number;
    totalPage: number;
  };
}

function mapOwner(input: unknown): EventOwner | null {
  if (!input || typeof input !== "object") return null;

  const owner = input as Record<string, unknown>;

  return {
    id: String(owner._id ?? owner.id ?? ""),
    name: String(owner.name ?? "User"),
    profile: getImageUrl(
      typeof owner.profile === "string" ? owner.profile : undefined,
    ),
    country: typeof owner.country === "string" ? owner.country : undefined,
    nationality:
      typeof owner.nationality === "string" ? owner.nationality : undefined,
    state: typeof owner.state === "string" ? owner.state : undefined,
  };
}

function mapGuests(input: unknown): EventGuest[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((guest) => {
      if (!guest || typeof guest !== "object") return null;
      const value = guest as Record<string, unknown>;
      const userId = value.userId;
      if (typeof userId !== "string") return null;
      return { userId };
    })
    .filter((guest): guest is EventGuest => guest !== null);
}

function mapEvent(item: Record<string, unknown>): MemberEvent {
  const owner = mapOwner(item.eventOwner);
  const ownerId =
    typeof item.eventOwner === "string"
      ? item.eventOwner
      : owner?.id || String(item.userId ?? "");

  const priceRaw = item.price;
  const price =
    typeof priceRaw === "number"
      ? priceRaw
      : typeof priceRaw === "string" && priceRaw.trim()
        ? Number(priceRaw)
        : 0;

  const attendRaw = item.attendPerson;
  const attendPerson =
    typeof attendRaw === "number"
      ? attendRaw
      : typeof attendRaw === "string" && attendRaw.trim()
        ? Number(attendRaw)
        : 0;

  return {
    id: String(item._id ?? item.id ?? ""),
    eventName: String(item.eventName ?? ""),
    type: String(item.type ?? ""),
    startDate: String(item.startDate ?? ""),
    endDate: String(item.endDate ?? ""),
    startTime: String(item.startTime ?? ""),
    details: String(item.details ?? ""),
    guests: mapGuests(item.guests),
    visibility:
      item.visibility === "private" ? "private" : ("public" as EventVisibility),
    status:
      item.status === "completed" || item.status === "cancelled"
        ? (item.status as EventStatus)
        : "upcoming",
    price: Number.isFinite(price) ? price : 0,
    attendPerson: Number.isFinite(attendPerson) ? attendPerson : 0,
    createdAt: String(item.createdAt ?? ""),
    updatedAt: String(item.updatedAt ?? ""),
    owner,
    ownerId,
  };
}

function toPayload(values: EventFormValues) {
  const price = Number(values.price);
  return {
    eventName: values.eventName,
    type: values.type,
    startDate: new Date(values.startDate).toISOString(),
    endDate: new Date(values.endDate).toISOString(),
    startTime: new Date(values.startTime).toISOString(),
    details: values.details,
    price: Number.isFinite(price) ? price : 0,
    guests: values.guestUserIds
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
      .map((userId) => ({ userId })),
    visibility: values.visibility,
    status: values.status,
  };
}

export async function getPublicEvents(
  page = 1,
  limit = 10,
): Promise<EventListResult> {
  const res = await myFetch(`/events?page=${page}&limit=${limit}`, {
    method: "GET",
    cache: "no-store",
    tags: ["events-public"],
  });

  const events = Array.isArray(res.data)
    ? res.data.map((item) => mapEvent(item as Record<string, unknown>))
    : [];

  return {
    events,
    pagination: {
      total: res.pagination?.total ?? events.length,
      limit: res.pagination?.limit ?? limit,
      page: res.pagination?.page ?? page,
      totalPage: res.pagination?.totalPage ?? 1,
    },
  };
}

export async function getMyEvents(): Promise<MemberEvent[]> {
  const res = await myFetch("/events/my", {
    method: "GET",
    cache: "no-store",
    tags: ["events-my"],
  });

  return Array.isArray(res.data)
    ? res.data.map((item) => mapEvent(item as Record<string, unknown>))
    : [];
}

export async function getEventById(id: string): Promise<MemberEvent | null> {
  const endpoints = [`/events/${id}`, `/events/${id}-single`];

  for (const endpoint of endpoints) {
    const res = await myFetch(endpoint, {
      method: "GET",
      cache: "no-store",
      tags: [`event-${id}`],
    });

    if (!res.success || res.data == null) continue;

    const raw = Array.isArray(res.data)
      ? res.data[0]
      : typeof res.data === "object" &&
          res.data !== null &&
          "event" in (res.data as Record<string, unknown>)
        ? (res.data as Record<string, unknown>).event
        : res.data;

    if (raw && typeof raw === "object") {
      return mapEvent(raw as Record<string, unknown>);
    }
  }

  // Fallback: find in public/my lists when single-event endpoints fail.
  const [publicEvents, myEvents] = await Promise.all([
    getPublicEvents(1, 100),
    getMyEvents(),
  ]);
  return (
    publicEvents.events.find((event) => event.id === id) ??
    myEvents.find((event) => event.id === id) ??
    null
  );
}

export async function createEvent(values: EventFormValues) {
  const res = await myFetch("/events", {
    method: "POST",
    body: toPayload(values),
  });

  if (res.success) {
    await revalidateTags(["events-public", "events-my"]);
  }

  return res;
}

export async function updateEvent(id: string, values: EventFormValues) {
  const res = await myFetch(`/events/${id}`, {
    method: "PATCH",
    body: toPayload(values),
  });

  if (res.success) {
    await revalidateTags(["events-public", "events-my", `event-${id}`]);
  }

  return res;
}

export async function deleteEvent(id: string) {
  const res = await myFetch(`/events/${id}`, {
    method: "DELETE",
  });

  if (res.success) {
    await revalidateTags(["events-public", "events-my", `event-${id}`]);
  }

  return res;
}

export async function createEventBooking(eventId: string) {
  const res = await myFetch<{
    booking?: Record<string, unknown>;
    checkoutUrl?: string;
  }>("/event-booking/create", {
    method: "POST",
    body: { eventId },
  });

  const checkoutUrl =
    typeof res.data?.checkoutUrl === "string" ? res.data.checkoutUrl : null;

  return {
    success: res.success,
    message: res.message ?? res.error ?? undefined,
    checkoutUrl,
    data: res.data,
  };
}

function mapBookingEvent(input: unknown): EventBookingEvent | null {
  if (!input) return null;

  if (typeof input === "string") {
    return {
      id: input,
      eventName: "Event",
      startDate: "",
      endDate: "",
      details: "",
      price: 0,
      status: "upcoming",
      ownerId: "",
    };
  }

  if (typeof input !== "object") return null;
  const event = input as Record<string, unknown>;
  const priceRaw = event.price;
  const price =
    typeof priceRaw === "number"
      ? priceRaw
      : typeof priceRaw === "string" && priceRaw.trim()
        ? Number(priceRaw)
        : 0;

  return {
    id: String(event._id ?? event.id ?? ""),
    eventName: String(event.eventName ?? "Event"),
    startDate: String(event.startDate ?? ""),
    endDate: String(event.endDate ?? ""),
    details: String(event.details ?? ""),
    price: Number.isFinite(price) ? price : 0,
    status:
      event.status === "completed" || event.status === "cancelled"
        ? (event.status as EventStatus)
        : "upcoming",
    ownerId: String(event.eventOwner ?? event.ownerId ?? ""),
  };
}

function mapEventBooking(item: Record<string, unknown>): EventBooking {
  const event = mapBookingEvent(item.eventId);
  const amountRaw = item.paymentAmount;
  const paymentAmount =
    typeof amountRaw === "number"
      ? amountRaw
      : typeof amountRaw === "string" && amountRaw.trim()
        ? Number(amountRaw)
        : event?.price ?? 0;

  return {
    id: String(item._id ?? item.id ?? ""),
    event,
    eventId: event?.id || String(item.eventId ?? ""),
    userId: String(
      typeof item.userId === "object" && item.userId
        ? ((item.userId as Record<string, unknown>)._id ??
            (item.userId as Record<string, unknown>).id ??
            "")
        : (item.userId ?? ""),
    ),
    bookingRequest: String(item.bookingRequest ?? "pending"),
    paymentStatus: String(item.paymentStatus ?? "pending"),
    paymentDate:
      typeof item.paymentDate === "string" ? item.paymentDate : null,
    paymentAmount: Number.isFinite(paymentAmount) ? paymentAmount : 0,
    currency: String(item.currency ?? "usd"),
    checkoutSessionId:
      typeof item.checkoutSessionId === "string"
        ? item.checkoutSessionId
        : undefined,
    createdAt: String(item.createdAt ?? ""),
    updatedAt: String(item.updatedAt ?? ""),
  };
}

export async function getMyEventBookings(): Promise<EventBooking[]> {
  const res = await myFetch("/event-booking/my", {
    method: "GET",
    cache: "no-store",
    tags: ["event-bookings-my"],
  });

  if (!res.success || !Array.isArray(res.data)) return [];

  return res.data.map((item) =>
    mapEventBooking(item as Record<string, unknown>),
  );
}
