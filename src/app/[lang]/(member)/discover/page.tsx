import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { DiscoverFeature } from "@/features/member/discover";
import type { MatchSearchFilters } from "@/features/member/my-list/action";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover Members - Sigaleve",
  description:
    "Discover Sigaleve members who match what you are looking for — honestly and on your terms.",
  keywords: ["Sigaleve", "discover", "search members", "match", "honest relationships", "honest dating", "our story", "mission", "vision", "values", "culture", "community", "platform", "product", "service", "company", "team", "team members", "team member", "team member profile", "team member profile page"],
};

function firstString(value: string | string[] | undefined) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0] ?? "";
  return "";
}

export default async function DiscoverPage({
  params,
  searchParams,
}: PageProps<"/[lang]/discover">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const sp = await searchParams;
  const name = firstString(sp.name || sp.q);
  const lookingFor = firstString(sp.lookingFor);
  const country = firstString(sp.country);
  const state = firstString(sp.state);
  const ageFrom = firstString(sp.ageFrom || sp.ageMin);
  const ageTo = firstString(sp.ageTo || sp.ageMax);
  const displayName = firstString(sp.displayName);

  const filters: MatchSearchFilters = {
    ...(name ? { name } : {}),
    ...(lookingFor ? { lookingFor } : {}),
    ...(country ? { country } : {}),
    ...(state ? { state } : {}),
    ...(ageFrom ? { ageFrom } : {}),
    ...(ageTo ? { ageTo } : {}),
    ...(displayName ? { displayName } : {}),
  };

  const dict = await getDictionary(lang);

  return (
    <DiscoverFeature
      lang={lang}
      dict={dict}
      query={name}
      filters={filters}
    />
  );
}
