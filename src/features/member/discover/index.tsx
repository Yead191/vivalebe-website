import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/mock/current-user";
import { UsernameSearchForm } from "./UsernameSearchForm";
import { DiscoverProfileCard } from "./DiscoverProfileCard";
import {
  getMutualMatches,
  type MatchSearchFilters,
} from "@/features/member/my-list/action";
import { getSearchHistory } from "./action";
import { getProfileAction } from "@/features/member/settings/action";
import { SavedSearches } from "./SavedSearches";

interface DiscoverFeatureProps {
  lang: Locale;
  dict: Dictionary;
  query: string;
  filters?: MatchSearchFilters;
}

export async function DiscoverFeature({
  lang,
  dict,
  query,
  filters = {},
}: DiscoverFeatureProps) {
  const mockMe = getCurrentUser();

  let isPremium = !!mockMe.premium;
  let meId = mockMe.id;

  try {
    const profileRes = await getProfileAction();
    if (profileRes?.success && profileRes?.data) {
      isPremium = !!(
        profileRes.data.premiumMembership ?? profileRes.data.premium
      );
      meId = profileRes.data._id || profileRes.data.id || mockMe.id;
    }
  } catch (err) {
    unstable_rethrow(err);
    console.error("Error fetching profile in discover:", err);
  }

  const searchFilters: MatchSearchFilters = {
    ...filters,
    ...(query.trim() && !filters.name ? { name: query.trim() } : {}),
  };

  const [users, historyRes] = await Promise.all([
    getMutualMatches(searchFilters),
    getSearchHistory().catch(() => ({ success: false, data: [] })),
  ]);

  const searches = historyRes?.success ? historyRes.data : [];
  const matches = users.filter((u) => u.id !== meId);

  return (
    <div className="container py-6">
      <nav className="mb-4 flex items-center gap-2 border-b border-border pb-3 text-xs font-semibold tracking-wider">
        <Link
          href={`/${lang}/discover`}
          className="cursor-pointer text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
        >
          {dict.discover.breadcrumb}
        </Link>
        <span className="text-muted-foreground">›</span>
        <span className="text-foreground underline underline-offset-4">
          {dict.discover.usernameSearch}
        </span>
      </nav>

      <div className="mb-6 max-w-3xl">
        <UsernameSearchForm lang={lang} dict={dict} initialQuery={query} />
      </div>

      <SavedSearches
        lang={lang}
        dict={dict}
        searches={searches}
        isPremium={isPremium}
      />

      <h2 className="mb-3 text-xs font-semibold tracking-wider text-foreground">
        {dict.discover.youMightLike}
      </h2>

      {matches.length === 0 ? (
        <p className="rounded-md border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
          {dict.discover.noResults}
        </p>
      ) : (
        <div className="space-y-4">
          {matches.map((user) => (
            <DiscoverProfileCard
              key={user.id}
              lang={lang}
              dict={dict}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
}
