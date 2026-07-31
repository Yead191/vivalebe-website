import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { User } from "@/lib/types";
import type { EventBooking, MemberEvent } from "./types";
import { EventsPageClient } from "./EventsPageClient";

interface EventsFeatureProps {
  lang: Locale;
  dict: Dictionary;
  me: User;
  viewedCount: number;
  allEvents: MemberEvent[];
  myBookings: EventBooking[];
}

export function EventsFeature(props: EventsFeatureProps) {
  return <EventsPageClient {...props} />;
}
