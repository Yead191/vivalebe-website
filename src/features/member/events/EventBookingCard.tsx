"use client";

import Link from "next/link";
import {
  CalendarDays,
  CreditCard,
  DollarSign,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import type { EventBooking } from "./types";
import { cn } from "@/lib/utils";

function formatDate(value: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function paymentClass(status: string) {
  const value = status.toLowerCase();
  if (value === "paid") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (value === "failed" || value === "cancelled")
    return "bg-rose-50 text-rose-700 ring-rose-200";
  return "bg-amber-50 text-amber-700 ring-amber-200";
}

function requestClass(status: string) {
  const value = status.toLowerCase();
  if (value === "accepted")
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (value === "rejected") return "bg-rose-50 text-rose-700 ring-rose-200";
  return "bg-sky-50 text-sky-700 ring-sky-200";
}

interface EventBookingCardProps {
  lang: Locale;
  booking: EventBooking;
}

export function EventBookingCard({ lang, booking }: EventBookingCardProps) {
  const event = booking.event;
  const eventName = event?.eventName || "Event";
  const eventId = booking.eventId || event?.id;
  const currency = (booking.currency || "usd").toUpperCase();

  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          {eventId ? (
            <Link
              href={`/${lang}/events/${eventId}`}
              className="block text-2xl font-semibold text-foreground transition-colors hover:text-brand"
            >
              {eventName}
            </Link>
          ) : (
            <h3 className="text-2xl font-semibold text-foreground">
              {eventName}
            </h3>
          )}
          <p className="text-sm text-muted-foreground">
            Booked on {formatDate(booking.createdAt)}
          </p>
        </div>

        {eventId ? (
          <Button variant="ghost" size="icon-sm" asChild>
            <Link
              href={`/${lang}/events/${eventId}`}
              aria-label="Open event details"
            >
              <MoreHorizontal className="size-5" />
            </Link>
          </Button>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium ring-1 capitalize",
            paymentClass(booking.paymentStatus),
          )}
        >
          Payment: {booking.paymentStatus}
        </span>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium ring-1 capitalize",
            requestClass(booking.bookingRequest),
          )}
        >
          Booking: {booking.bookingRequest}
        </span>
        {event?.status ? (
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize text-muted-foreground">
            {event.status}
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 text-sm text-foreground/90 sm:grid-cols-2">
        <div className="flex items-start gap-2">
          <CalendarDays className="mt-0.5 size-4 text-brand" />
          <div>
            <p className="font-medium">Event date</p>
            <p>
              {formatDate(event?.startDate ?? "")}
              {event?.endDate ? ` - ${formatDate(event.endDate)}` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <DollarSign className="mt-0.5 size-4 text-brand" />
          <div>
            <p className="font-medium">Amount</p>
            <p>
              {currency} ${booking.paymentAmount || event?.price || 0}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 sm:col-span-2">
          <CreditCard className="mt-0.5 size-4 text-brand" />
          <div>
            <p className="font-medium">Payment date</p>
            <p>
              {booking.paymentDate
                ? formatDate(booking.paymentDate)
                : "Not paid yet"}
            </p>
          </div>
        </div>
      </div>

      {event?.details ? (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">Details</p>
          <p className="line-clamp-3 whitespace-pre-line text-sm text-muted-foreground">
            {event.details}
          </p>
        </div>
      ) : null}
    </article>
  );
}
