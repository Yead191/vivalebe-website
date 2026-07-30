"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { User } from "@/lib/types";
import { ProfileHoverCard } from "./ProfileHoverCard";

interface RightSidebarProps {
  lang: Locale;
  dict: Dictionary;
  suggestions: User[];
}

export function RightSidebar({ lang, dict, suggestions }: RightSidebarProps) {
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(suggestions.length / itemsPerPage);

  const handleRefresh = () => {
    if (totalPages > 1) {
      setPage((prev) => (prev + 1) % totalPages);
    }
  };

  const displayedSuggestions = suggestions.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  return (
    <aside className="space-y-3 max-h-[calc(100vh-90px)] overflow-auto scrollbar-hide pb-8">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold tracking-wider text-foreground">
          {dict.myHome.youMightLike}
        </h3>
        {totalPages > 1 && (
          <button
            type="button"
            onClick={handleRefresh}
            aria-label="Refresh suggestions"
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted transition-colors active:scale-95"
          >
            <RefreshCw className="size-3.5" />
          </button>
        )}
      </div>
      <div className="flex flex-col gap-3">
        {displayedSuggestions.map((user) => (
          <ProfileHoverCard key={user.id} user={user} lang={lang} dict={dict} />
        ))}
        {displayedSuggestions.length === 0 && (
          <p className="text-sm text-muted-foreground px-1">
            No suggestions available
          </p>
        )}
      </div>
    </aside>
  );
}
