import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getEventById } from "@/features/member/events/action";
import { getProfileAction } from "@/features/member/settings/action";
import { EventDetailsClient } from "@/features/member/events/EventDetailsClient";

export default async function EventDetailsPage({
  params,
}: PageProps<"/[lang]/events/[id]">) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();

  const [event, profileRes] = await Promise.all([
    getEventById(id),
    getProfileAction(),
  ]);

  if (!event) notFound();

  const profile = profileRes?.data || {};
  const currentUserId = String(profile._id || profile.id || "");
  const isOwner = currentUserId !== "" && event.ownerId === currentUserId;

  return <EventDetailsClient event={event} isOwner={isOwner} />;
}
