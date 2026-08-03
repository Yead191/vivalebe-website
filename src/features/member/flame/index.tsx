"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { User } from "@/lib/types";
import {
  getSwipeFeed,
  swipeAction,
  type SwipeFeedResult,
} from "@/features/member/flame/action";
import { FlameCard } from "./FlameCard";
import { PreferencesModal, type FlamePreferences } from "./PreferencesModal";

interface FlameFeatureProps {
  lang: Locale;
  dict: Dictionary;
  me: Pick<User, "id" | "country" | "premium">;
  candidates: User[];
  initialPagination: SwipeFeedResult["pagination"];
}

const DEFAULT_PREFS: FlamePreferences = {
  genders: ["W"],
  ageRange: [19, 99],
  distance: "anywhere",
  willingToFly: false,
  expandedSearch: false,
};

export function FlameFeature({
  lang,
  dict,
  me,
  candidates: initialCandidates,
  initialPagination,
}: FlameFeatureProps) {
  const router = useRouter();
  const [prefs, setPrefs] = useState<FlamePreferences>(DEFAULT_PREFS);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [deck, setDeck] = useState<User[]>(initialCandidates);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastPassed, setLastPassed] = useState<User | null>(null);
  const [page, setPage] = useState(initialPagination.page);
  const [totalPage, setTotalPage] = useState(initialPagination.totalPage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const filtered = deck.filter((u) => {
    if (prefs.distance === "country" && me.country && u.country !== me.country) {
      return false;
    }
    return true;
  });

  const current = filtered[currentIndex];

  const loadMore = async () => {
    if (isLoadingMore || page >= totalPage) return;
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const feed = await getSwipeFeed(nextPage, 10);
      if (feed.users.length > 0) {
        setDeck((prev) => {
          const seen = new Set(prev.map((u) => u.id));
          return [...prev, ...feed.users.filter((u) => !seen.has(u.id))];
        });
      }
      setPage(feed.pagination.page);
      setTotalPage(feed.pagination.totalPage);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const advance = (fromIndex: number, total: number) => {
    const next = fromIndex + 1;
    if (next >= total - 2) {
      void loadMore();
    }
    setCurrentIndex(next);
  };

  const handlePass = async () => {
    if (!current || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await swipeAction(current.id, "reject");
      if (!res.success) {
        toast.error(res.message || "Failed to reject");
        return;
      }
      setLastPassed(current);
      advance(currentIndex, filtered.length);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async () => {
    if (!current || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await swipeAction(current.id, "like");
      if (!res.success) {
        toast.error(res.message || "Failed to like");
        return;
      }
      setLastPassed(null);
      advance(currentIndex, filtered.length);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUndo = () => {
    if (!lastPassed) return;
    if (!me.premium) {
      router.push(`/${lang}/subscription?required=1`);
      return;
    }
    const idx = filtered.findIndex((u) => u.id === lastPassed.id);
    if (idx >= 0) {
      setCurrentIndex(idx);
      setLastPassed(null);
    }
  };

  const handleSavePrefs = (next: FlamePreferences) => {
    setPrefs(next);
    setCurrentIndex(0);
    setLastPassed(null);
    setPrefsOpen(false);
  };

  const resetDeck = () => {
    setCurrentIndex(0);
    setLastPassed(null);
  };

  return (
    <div className="container py-6">
      <div className="mb-6 text-start">
        <button
          type="button"
          onClick={() => setPrefsOpen(true)}
          className="text-sm font-medium underline underline-offset-4 hover:text-brand transition-colors cursor-pointer"
        >
          Preferences for My Potential Matches
        </button>
      </div>

      <div className="">
        {current ? (
          <FlameCard
            lang={lang}
            dict={dict}
            user={current}
            canUndo={lastPassed !== null}
            isPremium={me.premium}
            disabled={isSubmitting}
            onPass={handlePass}
            onLike={handleLike}
            onUndo={handleUndo}
          />
        ) : (
          <EmptyState
            hasMatches={filtered.length > 0}
            isLoadingMore={isLoadingMore}
            onReset={resetDeck}
            onOpenPrefs={() => setPrefsOpen(true)}
            onLoadMore={page < totalPage ? () => void loadMore() : undefined}
          />
        )}
      </div>

      <PreferencesModal
        open={prefsOpen}
        onOpenChange={setPrefsOpen}
        initial={prefs}
        userCountry={me.country || "your country"}
        isPremium={me.premium}
        onSave={handleSavePrefs}
      />
    </div>
  );
}

interface EmptyStateProps {
  hasMatches: boolean;
  isLoadingMore: boolean;
  onReset: () => void;
  onOpenPrefs: () => void;
  onLoadMore?: () => void;
}

function EmptyState({
  hasMatches,
  isLoadingMore,
  onReset,
  onOpenPrefs,
  onLoadMore,
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
      <h3 className="text-base font-semibold text-foreground">
        {isLoadingMore ? "Loading more profiles…" : "No more profiles right now"}
      </h3>
      {!isLoadingMore ? (
        <>
          <p className="mt-2 text-sm text-muted-foreground">
            You&apos;ve seen everyone matching your preferences. Adjust your
            preferences to see more.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {hasMatches ? (
              <button
                type="button"
                onClick={onReset}
                className="cursor-pointer rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                Start over
              </button>
            ) : null}
            {onLoadMore ? (
              <button
                type="button"
                onClick={onLoadMore}
                className="cursor-pointer rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                Load more
              </button>
            ) : null}
            <button
              type="button"
              onClick={onOpenPrefs}
              className="cursor-pointer rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity"
            >
              Adjust preferences
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
