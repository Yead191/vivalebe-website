"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { BlogPost } from "@/lib/types";

export type BlogTab = "all" | "my" | "liked" | "commented";

interface BlogSidebarProps {
  lang: Locale;
  dict: Dictionary;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTab: BlogTab;
  onTabChange: (tab: BlogTab) => void;
  recentBlogs: Pick<BlogPost, "id" | "title">[];
}

export function BlogSidebar({
  lang,
  dict,
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  recentBlogs,
}: BlogSidebarProps) {
  const tabs: { id: BlogTab; label: string }[] = [
    { id: "my", label: dict.blog.myBlogs },
    { id: "liked", label: dict.blog.myLikedBlogs },
    { id: "commented", label: dict.blog.myCommentedBlogs },
  ];

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder={dict.blog.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-background pl-4 pr-10 py-2 text-sm outline-none focus:border-brand transition-colors"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
      </div>

      {/* Navigation tabs */}
      <div className="flex flex-col">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(activeTab === tab.id ? "all" : tab.id)}
            className={cn(
              "text-left text-sm py-1.5 transition-colors border-b border-transparent",
              activeTab === tab.id
                ? "text-brand font-semibold border-brand"
                : "text-foreground hover:text-brand"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recently Posted */}
      {recentBlogs.length > 0 ? (
        <div>
          <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3">
            {dict.blog.recentlyPosted}
          </p>
          <div className="flex flex-col gap-2.5">
            {recentBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/${lang}/blog/${blog.id}`}
                className="text-sm text-brand hover:underline leading-snug line-clamp-2"
              >
                {blog.title}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
