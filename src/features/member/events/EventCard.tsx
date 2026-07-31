"use client";

import { ImageWithFallback as Image } from "@/components/shared/ImageWithFallback";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  DollarSign,
  MapPin,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import type { MemberEvent } from "./types";
import { EventFormDialog } from "./EventFormDialog";

function formatDate(value: string, withTime = false) {
  if (!value) return "—";
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
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

function formatType(value: string) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function statusClass(status: MemberEvent["status"]) {
  if (status === "completed")
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (status === "cancelled") return "bg-rose-50 text-rose-700 ring-rose-200";
  return "bg-amber-50 text-amber-700 ring-amber-200";
}

function ownerLocation(event: MemberEvent) {
  return [
    event.owner?.state,
    event.owner?.country || event.owner?.nationality,
  ]
    .filter(Boolean)
    .join(", ");
}

interface EventCardProps {
  lang: Locale;
  event: MemberEvent;
  editable?: boolean;
  onMutate?: () => void;
}

export function EventCard({
  lang,
  event,
  editable = false,
  onMutate,
}: EventCardProps) {
  const ownerName = event.owner?.name || "Event host";
  const ownerMeta = ownerLocation(event);
  const profileImage = event.owner?.profile || "/image20.png";

  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Image
            src={profileImage}
            alt={ownerName}
            width={56}
            height={56}
            className="size-14 rounded-full object-cover"
            unoptimized
          />
          <div className="space-y-1">
            <p className="text-lg font-semibold uppercase tracking-wide text-foreground">
              {ownerName}
            </p>
            {ownerMeta ? (
              <p className="text-sm text-muted-foreground">{ownerMeta}</p>
            ) : null}
          </div>
        </div>

        {editable ? (
          <EventFormDialog
            mode="edit"
            event={event}
            triggerLabel="Edit"
            triggerVariant="outline"
            onSuccess={onMutate}
          />
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${statusClass(event.status)}`}
        >
          {event.status}
        </span>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          {event.visibility}
        </span>
        <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
          USD ${event.price}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <Link
          href={`/${lang}/events/${event.id}`}
          className="block text-2xl font-semibold text-foreground transition-colors hover:text-brand"
        >
          {event.eventName}
        </Link>

        <div className="grid gap-3 text-sm text-foreground/90 sm:grid-cols-2">
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
          <div className="flex items-start gap-2">
            <DollarSign className="mt-0.5 size-4 text-brand" />
            <div>
              <p className="font-medium">Price</p>
              <p>USD ${event.price}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Type</p>
          <p className="text-sm text-muted-foreground">{formatType(event.type)}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Details</p>
          <p className="line-clamp-4 whitespace-pre-line text-sm text-muted-foreground">
            {event.details}
          </p>
        </div>

        <div className="flex justify-end pt-1">
          <Button asChild>
            <Link href={`/${lang}/events/${event.id}`}>Details & Pay</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
