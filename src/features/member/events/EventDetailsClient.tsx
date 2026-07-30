"use client";

import { useEffect, useState } from "react";
import { ImageWithFallback as Image } from "@/components/shared/ImageWithFallback";
import { CalendarDays, Clock3, Heart, MapPin, MessageCircle, Smile } from "lucide-react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/shared/BackButton";
import { EventFormDialog } from "./EventFormDialog";
import type { MemberEvent } from "./types";

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
}

export function EventDetailsClient({
  event,
  isOwner,
}: EventDetailsClientProps) {
  const router = useRouter();
  const [active, setActive] = useState("join-event");

  useEffect(() => {
    const handler = () => {
      const ids = ["join-event", "details", "private-note"];
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      setActive(current);
    };

    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const ownerName = event.owner?.name || "Event host";
  const ownerImage = event.owner?.profile || "/image20.png";
  const ownerMeta = [
    event.owner?.nationality || event.owner?.country,
    event.owner?.state,
  ]
    .filter(Boolean)
    .join(", ");

  const navItems = [
    { id: "join-event", label: `JOIN ${ownerName.toUpperCase()}'S EVENT` },
    { id: "details", label: "EVENT DETAILS" },
    { id: "private-note", label: "ADD A PRIVATE NOTE" },
  ];

  return (
    <div className="container py-5">
      <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <div>
          <div className="lg:sticky lg:top-22">
            <BackButton />

            <aside className="space-y-5">
              <div className="overflow-hidden rounded-xl bg-muted">
                <Image
                  src={ownerImage}
                  alt={ownerName}
                  width={480}
                  height={600}
                  className="aspect-4/5 w-full object-cover"
                  unoptimized
                />
              </div>

              <div className="flex items-center gap-5 px-1 text-muted-foreground">
                <button type="button" aria-label="Wink" className="hover:text-brand transition-colors">
                  <Smile className="size-5" />
                </button>
                <button type="button" aria-label="Like" className="hover:text-brand transition-colors">
                  <Heart className="size-5" />
                </button>
                <button type="button" aria-label="Message" className="hover:text-brand transition-colors">
                  <MessageCircle className="size-5" />
                </button>
              </div>

              <nav className="space-y-3 px-1 pt-2 text-xs font-semibold tracking-wider">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      document
                        .getElementById(item.id)
                        ?.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                    className={
                      active === item.id
                        ? "block text-left text-foreground underline underline-offset-4"
                        : "block text-left text-muted-foreground transition-colors hover:text-foreground"
                    }
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </aside>
          </div>
        </div>

        <div className="space-y-8">
          <header className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h1 className="text-base font-semibold tracking-wider">{ownerName}</h1>
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

          <section id="join-event" className="space-y-4 rounded-2xl border border-border bg-card p-5 scroll-mt-24">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold uppercase tracking-wide">
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
              <h3 className="text-2xl font-semibold text-foreground">{event.eventName}</h3>
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
              <div className="flex items-start gap-2 md:col-span-2">
                <MapPin className="mt-0.5 size-4 text-brand" />
                <div>
                  <p className="font-medium">Location</p>
                  <p>{ownerMeta || "Location not provided"}</p>
                </div>
              </div>
            </div>
          </section>

          <section id="details" className="space-y-3 scroll-mt-24">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Event Details
            </h2>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {event.details}
              </p>

              <div className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                <p>Created: {formatDate(event.createdAt, true)}</p>
                <p>Updated: {formatDate(event.updatedAt, true)}</p>
                <p>Invited guests: {event.guests.length}</p>
              </div>
            </div>
          </section>

          <section id="private-note" className="space-y-3 scroll-mt-24">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Add A Private Note
            </h2>
            <textarea
              rows={4}
              placeholder="Write a private note about this event..."
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-brand"
            />
          </section>
        </div>
      </div>
    </div>
  );
}
