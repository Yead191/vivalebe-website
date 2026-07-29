"use client";

import Link from "next/link";
import { Lock, History } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";

interface SearchHistoryItem {
  _id: string;
  searchTerm: string;
  createdAt: string;
}

interface SavedSearchesProps {
  lang: Locale;
  dict: Dictionary;
  searches: SearchHistoryItem[];
  isPremium: boolean;
}

export function SavedSearches({
  lang,
  dict,
  searches,
  isPremium,
}: SavedSearchesProps) {
  if (!searches || searches.length === 0) return null;

  return (
    <div className="mb-6 space-y-3">
      <h3 className="text-xs font-semibold tracking-wider text-foreground">
        {dict.nav.discoverSavedSearch || "SAVED SEARCHES"}
      </h3>
      <div className="relative">
        {!isPremium && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg bg-background/60 backdrop-blur-[2px] p-4 text-center border border-border">
            <Lock className="mb-2 size-5 text-brand" />
            <p className="mb-3 text-sm font-medium text-foreground">
              {dict.nav.premiumLocked || "Premium feature"}
            </p>
            <Link
              href={`/${lang}/subscription`}
              className="inline-flex h-8 items-center justify-center rounded-md bg-brand px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-brand/90"
            >
              Unlock
            </Link>
          </div>
        )}

        <div
          className={cn(
            "flex flex-wrap gap-2",
            !isPremium && "pointer-events-none select-none blur-[2px]",
          )}
        >
          {searches.map((item) => (
            <Link
              key={item._id}
              href={`/${lang}/discover?from=username&name=${encodeURIComponent(
                item.searchTerm,
              )}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
            >
              <History className="size-3.5" />
              {item.searchTerm}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
