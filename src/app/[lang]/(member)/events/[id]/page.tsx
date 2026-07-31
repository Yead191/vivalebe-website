import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import {
  getEventById,
  getMyEventBookings,
} from "@/features/member/events/action";
import { getProfileAction } from "@/features/member/settings/action";
import { EventDetailsClient } from "@/features/member/events/EventDetailsClient";

export default async function EventDetailsPage({
  params,
}: PageProps<"/[lang]/events/[id]">) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();

  const [event, profileRes, myBookings] = await Promise.all([
    getEventById(id),
    getProfileAction(),
    getMyEventBookings(),
  ]);

  if (!event) notFound();

  const profile = profileRes?.data || {};
  const currentUserId = String(profile._id || profile.id || "");
  const isOwner = currentUserId !== "" && event.ownerId === currentUserId;
  const existingBooking =
    myBookings.find((booking) => booking.eventId === id) ?? null;

  return (
    <EventDetailsClient
      event={event}
      isOwner={isOwner}
      existingBooking={existingBooking}
    />
  );
}
