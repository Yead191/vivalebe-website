"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { User } from "@/lib/types";
import { MyListTabs } from "./components/MyListTabs";
import { UserCard } from "./components/UserCard";

type SortMode = "newest" | "oldest";

interface MyListClientProps {
  lang: Locale;
  dict: Dictionary;
  activeTab: string;
  users: User[];
}

export function MyListClient({ lang, dict, activeTab, users }: MyListClientProps) {
  const [sort, setSort] = useState<SortMode>("newest");

  const sorted = sort === "newest" ? users : [...users].reverse();

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
          <span>{sort === "newest" ? dict.myList.newest : dict.myList.oldest}</span>
          <ChevronDown className="size-4" />
        </button>
      </div>

      {/* User list */}
      {sorted.length > 0 ? (
        <div className="space-y-4">
          {sorted.map((user) => (
            <UserCard
              key={user.id}
              lang={lang}
              dict={dict}
              user={user}
            />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-sm text-muted-foreground">
          {dict.myList.empty}
        </p>
      )}
    </div>
  );
}
