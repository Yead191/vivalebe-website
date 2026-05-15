import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { users } from "@/lib/mock/users";
import { getCurrentUser } from "@/lib/mock/current-user";
import { UsernameSearchForm } from "./UsernameSearchForm";
import { DiscoverProfileCard } from "./DiscoverProfileCard";

interface DiscoverFeatureProps {
  lang: Locale;
  dict: Dictionary;
  query: string;
}

export function DiscoverFeature({ lang, dict, query }: DiscoverFeatureProps) {
  const me = getCurrentUser();
  const q = query.trim().toLowerCase();
  const matches = users.filter((u) => {
    if (u.id === me.id) return false;
    if (!q) return true;
    return (
      u.username.toLowerCase().includes(q) ||
      u.displayName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container py-6">
      <nav className="mb-4 flex items-center gap-2 border-b border-border pb-3 text-xs font-semibold tracking-wider">
        <Link
          href={`/${lang}/discover`}
          className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
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
