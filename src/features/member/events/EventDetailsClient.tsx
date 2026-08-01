"use client";

import { useTransition } from "react";
import {
  CalendarDays,
  Clock3,
  DollarSign,
  MapPin,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import BackButton from "@/components/shared/BackButton";
import { Button } from "@/components/ui/button";
import { EventFormDialog } from "./EventFormDialog";
import { createEventBooking } from "./action";
import type { EventBooking, MemberEvent } from "./types";

function formatDate(value: string, withTime = false) {
  if (!value) return "—";
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    ...(withTime
      ? {
          hour: "numeric",
          minute: "2-digit",
        }
      : {}),
  }).format(date);
}

interface EventDetailsClientProps {
  event: MemberEvent;
  isOwner: boolean;
  existingBooking?: EventBooking | null;
}

export function EventDetailsClient({
  event,
  isOwner,
  existingBooking = null,
}: EventDetailsClientProps) {
  const router = useRouter();
  const [isBooking, startBooking] = useTransition();
  const paymentStatus = existingBooking?.paymentStatus.toLowerCase() ?? "";
  const isPaymentComplete = paymentStatus === "paid";
  const showBookAndPay = !isOwner && !isPaymentComplete;

  const ownerName = event.owner?.name || "Event host";
  const ownerMeta = [
    event.owner?.state,
    event.owner?.country || event.owner?.nationality,
  ]
    .filter(Boolean)
    .join(", ");

  const handleBookEvent = () => {
    startBooking(async () => {
      const res = await createEventBooking(event.id);

      if (!res.success) {
        toast.error(res.message ?? "Failed to create event booking");
        return;
      }

      if (res.checkoutUrl) {
        window.location.assign(res.checkoutUrl);
        return;
      }

      toast.error("Checkout URL not available");
    });
  };

  return (
    <div className="container py-5">
      <div className="mb-5">
        <BackButton />
      </div>

      <div className="mx-auto max-w-3xl space-y-8">
        <header className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-base font-semibold tracking-wider">
              {ownerName}
            </h1>
            {ownerMeta ? (
              <p className="text-sm text-muted-foreground">{ownerMeta}</p>
            ) : null}
          </div>
          {isOwner ? (
            <EventFormDialog
              mode="edit"
              event={event}
              triggerLabel="Edit event"
              onSuccess={() => router.refresh()}
            />
          ) : null}
        </header>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold uppercase tracking-wide">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Join {ownerName.toUpperCase()}'s Event
            </h2>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {event.visibility}
              </span>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                {event.status}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-foreground">
              {event.eventName}
            </h3>
            <p className="text-sm text-muted-foreground">{event.type}</p>
          </div>

          <div className="grid gap-4 text-sm text-foreground/90 md:grid-cols-2">
            <div className="flex items-start gap-2">
              <CalendarDays className="mt-0.5 size-4 text-brand" />
              <div>
                <p className="font-medium">Date</p>
                <p>
                  {formatDate(event.startDate)} - {formatDate(event.endDate)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock3 className="mt-0.5 size-4 text-brand" />
              <div>
                <p className="font-medium">Start time</p>
                <p>{formatDate(event.startTime, true)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 text-brand" />
              <div>
                <p className="font-medium">Location</p>
                <p>{ownerMeta || "Location not provided"}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Users className="mt-0.5 size-4 text-brand" />
              <div>
                <p className="font-medium">Attending</p>
                <p>
                  {event.attendPerson} attending
                  {event.guests.length > 0
                    ? ` · ${event.guests.length} invited`
                    : ""}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 md:col-span-2">
              <DollarSign className="mt-0.5 size-4 text-brand" />
              <div>
                <p className="font-medium">Price</p>
                <p className="text-base font-semibold text-foreground">
                  USD ${event.price}
                </p>
              </div>
            </div>
          </div>

          {!isOwner && existingBooking ? (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {/* {isPaymentComplete ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
                  Already booked
                </span>
              ) : null} */}
              <span
                className={
                  isPaymentComplete
                    ? "rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium capitalize text-emerald-700 ring-1 ring-emerald-200"
                    : "rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium capitalize text-amber-700 ring-1 ring-amber-200"
                }
              >
                Payment: {existingBooking.paymentStatus}
              </span>
              <span className="rounded-full bg-sky-50 px-3 py-1.5 text-sm font-medium capitalize text-sky-700 ring-1 ring-sky-200">
                Booking: {existingBooking.bookingRequest}
              </span>
            </div>
          ) : null}

          {showBookAndPay ? (
            <div className="pt-2">
              <Button
                type="button"
                onClick={handleBookEvent}
                disabled={isBooking}
                className="bg-brand text-white hover:bg-brand/90"
              >
                {isBooking
                  ? "Redirecting to checkout..."
                  : `Book & Pay · $${event.price}`}
              </Button>
            </div>
          ) : null}
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Event Details
          </h2>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
              {event.details}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
