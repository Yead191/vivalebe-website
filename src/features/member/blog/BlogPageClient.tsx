"use client";

import { useState, useMemo } from "react";
import { ChevronDown, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { BlogPost, Comment, User } from "@/lib/types";
import { BlogCard } from "./components/BlogCard";
import { BlogSidebar, type BlogTab } from "./components/BlogSidebar";

type SortMode = "newest" | "popular";

interface BlogPageClientProps {
  lang: Locale;
  dict: Dictionary;
  blogs: BlogPost[];
  authorsMap: Record<string, User>;
  authorInfoMap: Record<string, { displayName: string; avatarSeed: string }>;
  likeMetaMap: Record<string, { count: number; liked: boolean }>;
  commentMap: Record<string, Comment[]>;
  currentUserAvatarSeed: string;
  currentUserId: string;
  recentBlogs: Pick<BlogPost, "id" | "title">[];
  totalBlogs: number;
}

export function BlogPageClient({
  lang,
  dict,
  blogs,
  authorsMap,
  authorInfoMap,
  likeMetaMap,
  commentMap,
  currentUserAvatarSeed,
  currentUserId,
  recentBlogs,
  totalBlogs,
}: BlogPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [activeTab, setActiveTab] = useState<BlogTab>("all");

  const visibleBlogs = useMemo(() => {
    let list = [...blogs];

    if (activeTab === "my") {
      list = list.filter((b) => b.authorId === currentUserId);
    } else if (activeTab === "liked") {
      list = list.filter((b) => likeMetaMap[b.id]?.liked);
    } else if (activeTab === "commented") {
      list = list.filter((b) =>
        (commentMap[b.id] ?? []).some((c) => c.authorId === currentUserId)
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((b) => {
        const author = authorsMap[b.authorId];
        return (
          b.title.toLowerCase().includes(q) ||
          (author?.displayName.toLowerCase().includes(q) ?? false)
        );
      });
    }

    if (sortMode === "newest") {
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      list.sort((a, b) => {
        const scoreA =
          (likeMetaMap[a.id]?.count ?? 0) * 2 +
          (commentMap[a.id]?.length ?? 0);
        const scoreB =
          (likeMetaMap[b.id]?.count ?? 0) * 2 +
          (commentMap[b.id]?.length ?? 0);
        return scoreB - scoreA;
      });
    }

    return list;
  }, [
    blogs,
    activeTab,
    searchQuery,
    sortMode,
    currentUserId,
    likeMetaMap,
    commentMap,
    authorsMap,
  ]);

  return (
    <div className="container py-6">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Main feed */}
        <div className="space-y-5 min-w-0">
          {/* Header */}
          <div>
            <h1 className="text-xs font-bold tracking-widest text-foreground uppercase">
              {dict.blog.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {dict.blog.description}
            </p>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 rounded border border-brand px-4 py-1.5 text-sm font-medium text-brand hover:bg-brand hover:text-white transition-colors"
            >
              <PenLine className="size-3.5" />
              {dict.blog.postBlog}
            </button>
          </div>

          {/* Sort bar */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {dict.blog.totalBlogs}{" "}
              <span className="font-semibold text-foreground">
                {totalBlogs.toLocaleString()}
              </span>
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-muted-foreground">
                {dict.blog.show}
              </span>
              <button
                type="button"
                onClick={() =>
                  setSortMode((m) => (m === "newest" ? "popular" : "newest"))
                }
                className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-brand transition-colors"
              >
                {sortMode === "newest" ? dict.blog.newest : dict.blog.popular}
                <ChevronDown className="size-4" />
              </button>
            </div>
          </div>

          {/* Blog feed */}
          {visibleBlogs.length > 0 ? (
            <div className="space-y-4">
              {visibleBlogs.map((blog) => {
                const author = authorsMap[blog.authorId];
                if (!author) return null;
                return (
                  <BlogCard
                    key={blog.id}
                    lang={lang}
                    dict={dict}
                    blog={blog}
                    author={author}
                    likeCount={likeMetaMap[blog.id]?.count ?? 0}
                    liked={likeMetaMap[blog.id]?.liked ?? false}
                    comments={commentMap[blog.id] ?? []}
                    authors={authorInfoMap}
                    currentUserAvatarSeed={currentUserAvatarSeed}
                  />
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">
              {dict.blog.notFound}
            </p>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-22">
            <BlogSidebar
              lang={lang}
              dict={dict}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              recentBlogs={recentBlogs}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
