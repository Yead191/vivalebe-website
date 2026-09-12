import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentViewedCount, getCurrentUser } from "@/lib/mock/current-user";
import { getProfileAction } from "@/features/member/settings/action";
import {
  getMyEventBookings,
  getPublicEvents,
} from "@/features/member/events/action";
import { EventsFeature } from "@/features/member/events";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Find Sigaleve events, meet members in real life, and join the next gathering.",
  keywords: ["Sigaleve", "events", "meetups", "community events"],
};

export default async function EventsPage({
  params,
}: PageProps<"/[lang]/events">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const [dict, publicEventsRes, myBookings, profileRes] = await Promise.all([
    getDictionary(lang),
    getPublicEvents(),
    getMyEventBookings(),
    getProfileAction(),
  ]);

  const mockMe = getCurrentUser();
  const viewedCount = getCurrentViewedCount();
  const profile = profileRes?.data || {};

  const me = {
    ...mockMe,
    id: profile._id || profile.id || mockMe.id,
    username: profile.username || profile.name || mockMe.username,
    displayName: profile.name || profile.displayName || mockMe.displayName,
    avatarSeed: profile.profile || profile.image || mockMe.avatarSeed,
    coverSeed: profile.profile || profile.image || mockMe.coverSeed,
    country: profile.country || profile.nationality || mockMe.country,
  };

  return (
    <EventsFeature
      lang={lang}
      dict={dict}
      me={me}
      viewedCount={viewedCount}
      allEvents={publicEventsRes.events}
      myBookings={myBookings}
    />
  );
}
