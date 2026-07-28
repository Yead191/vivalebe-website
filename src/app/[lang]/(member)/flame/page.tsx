import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getProfileAction } from "@/features/member/settings/action";
import { getSwipeFeed } from "@/features/member/flame/action";
import { FlameFeature } from "@/features/member/flame";
import type { User } from "@/lib/types";

export default async function FlamePage({
  params,
}: PageProps<"/[lang]/flame">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const [dict, feed, profileRes] = await Promise.all([
    getDictionary(lang),
    getSwipeFeed(1, 10),
    getProfileAction(),
  ]);

  const p = profileRes?.data || {};
  const me: Pick<User, "id" | "country" | "premium"> = {
    id: p._id || p.id || "",
    country: p.nationality || p.country || "",
    premium: !!(p.premium || p.isPremium || p.subscription),
  };

  return (
    <FlameFeature
      lang={lang}
      dict={dict}
      me={me}
      candidates={feed.users}
      initialPagination={feed.pagination}
    />
  );
}
