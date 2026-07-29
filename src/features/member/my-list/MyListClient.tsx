"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { User } from "@/lib/types";
import { MyListTabs } from "./components/MyListTabs";
import { UserCard } from "./components/UserCard";
import Link from "next/link";

type SortMode = "newest" | "oldest";

interface MyListClientProps {
  lang: Locale;
  dict: Dictionary;
  activeTab: string;
  users: User[];
  isPremium?: boolean;
}

export function MyListClient({
  lang,
  dict,
  activeTab,
  users,
  isPremium = false,
}: MyListClientProps) {
  const [sort, setSort] = useState<SortMode>("newest");
  const [localUsers, setLocalUsers] = useState<User[]>(users);

  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  const handleRemove = (id: string) => {
    setLocalUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const sorted = sort === "newest" ? localUsers : [...localUsers].reverse();

  return (
    <div className="container py-6">
      {/* Tabs */}
      <MyListTabs lang={lang} dict={dict} activeTab={activeTab} />

      {/* Sort bar */}
      <div className="mt-6 flex justify-end mb-4">
        <button
          type="button"
          onClick={() => setSort((s) => (s === "newest" ? "oldest" : "newest"))}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="font-medium">{dict.myList.sortBy}</span>
          <span>
            {sort === "newest" ? dict.myList.newest : dict.myList.oldest}
          </span>
          <ChevronDown className="size-4" />
        </button>
      </div>

      {/* User list */}
      {sorted.length > 0 ? (
        <div className="relative">
          {!isPremium && (activeTab === "viewed-you" || activeTab === "mutual") && (
            <div className="sticky top-[50vh] left-0 right-0 z-10 flex h-0 flex-col items-center justify-center overflow-visible p-4">
              <div className="bg-background/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-border text-center max-w-md w-full -translate-y-1/2">
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Premium Feature
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Upgrade your membership to see who viewed your profile and your mutual matches.
                </p>
                <Link
                  href={`/${lang}/subscription`}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand px-6 font-semibold text-primary-foreground shadow-lg transition-all hover:bg-brand/90 hover:scale-105"
                >
                  Buy Subscription
                </Link>
              </div>
            </div>
          )}

          <div
            className={`space-y-4 ${
              !isPremium && (activeTab === "viewed-you" || activeTab === "mutual")
                ? "blur-md pointer-events-none select-none"
                : ""
            }`}
          >
            {sorted.map((user) => (
              <UserCard
                key={user.id}
                lang={lang}
                dict={dict}
                user={user}
                activeTab={activeTab}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="py-16 text-center text-sm text-muted-foreground">
          {dict.myList.empty}
        </p>
      )}
    </div>
  );
}
