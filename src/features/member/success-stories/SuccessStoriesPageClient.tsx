"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { avatarUrl } from "@/lib/image";
import { AddSuccessStoryDialog } from "./AddSuccessStoryDialog";
import { StoryCard } from "./StoryCard";
import { countMedia } from "./shared";
import { sortOptions } from "./data";
import type { SuccessStory, SuccessStoriesSortKey } from "./types";
import type { Comment } from "@/lib/types";
import { toast } from "sonner";

const sortKeyMap: Record<string, SuccessStoriesSortKey> = {
  "Newest": "newest",
  "Photos & Videos": "media",
  "Most Popular": "popular",
  "Dating": "dating",
  "Engaged": "engaged",
  "Other": "other",
  "My Post": "mine",
};

function FeedFilters({
  sortKey,
  setSortKey,
  isPending,
  totalStories,
  totalMedia,
}: {
  sortKey: SuccessStoriesSortKey;
  setSortKey: (value: SuccessStoriesSortKey) => void;
  isPending: boolean;
  totalStories: number;
  totalMedia: number;
}) {
  return (
    <aside className="grid gap-4 rounded-[2rem] border border-white/70 bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)]">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/65">Feed filters</p>
      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option) => {
          const key = sortKeyMap[option];
          const active = sortKey === key;

          return (
            <button
              key={option}
              type="button"
              onClick={() => setSortKey(key)}
              className={[
                "rounded-full border px-4 py-2 text-sm transition-all",
                active
                  ? "border-white bg-white text-slate-950 shadow-lg"
                  : "border-white/15 bg-white/5 text-white/78 hover:bg-white/10",
              ].join(" ")}
            >
              {option}
            </button>
          );
        })}
      </div>
      <div className="grid gap-3 rounded-2xl bg-white/8 p-4 ring-1 ring-white/10 sm:grid-cols-3">
        <div>
          <p className="text-2xl font-semibold">{totalStories}</p>
          <p className="text-xs text-white/65">Stories</p>
        </div>
        <div>
          <p className="text-2xl font-semibold">{totalMedia}</p>
          <p className="text-xs text-white/65">Media</p>
        </div>
        <div>
          <p className="text-2xl font-semibold">{isPending ? "Live" : "Ready"}</p>
          <p className="text-xs text-white/65">Sort updates</p>
        </div>
      </div>
    </aside>
  );
}

export function SuccessStoriesPageClient({
  lang,
  dict,
  currentUser,
  initialStories,
}: {
  lang: Locale;
  dict: Dictionary;
  currentUser: { id: string; username: string; avatarSeed: string };
  initialStories: SuccessStory[];
}) {
  const [stories, setStories] = useState(initialStories);
  const [sortKey, setSortKey] = useState<SuccessStoriesSortKey>("newest");
  const [isPending, startTransition] = useTransition();
  const [, setLikedStoryIds] = useState<string[]>([]);

  const visibleStories = useMemo(() => {
    const list = [...stories];
    return list.sort((a, b) => {
      if (sortKey === "newest") return +new Date(b.createdAt) - +new Date(a.createdAt);
      if (sortKey === "popular") return b.likesCount - a.likesCount;
      if (sortKey === "media") return countMedia(b) - countMedia(a);
      if (sortKey === "dating") return Number(b.relationshipStatus === "DATING") - Number(a.relationshipStatus === "DATING");
      if (sortKey === "engaged") return Number(b.relationshipStatus === "ENGAGED") - Number(a.relationshipStatus === "ENGAGED");
      if (sortKey === "other") return Number(b.relationshipStatus === "OTHER") - Number(a.relationshipStatus === "OTHER");
      if (sortKey === "mine") return Number(b.user.username === currentUser.username) - Number(a.user.username === currentUser.username);
      return 0;
    });
  }, [stories, sortKey, currentUser.username]);

  const handleLike = (storyId: string) => {
    setLikedStoryIds((prev) => {
      const isLiked = prev.includes(storyId);
      setStories((current) =>
        current.map((story) =>
          story.id === storyId
            ? { ...story, likesCount: Math.max(story.likesCount + (isLiked ? -1 : 1), 0) }
            : story
        )
      );
      return isLiked ? prev.filter((id) => id !== storyId) : [...prev, storyId];
    });
  };

  const handleComment = (storyId: string, text: string) => {
    const comment: Comment = {
      id: `${storyId}-${Date.now()}`,
      authorId: currentUser.id,
      text,
      createdAt: new Date().toISOString(),
    };

    setStories((prev) =>
      prev.map((story) =>
        story.id === storyId
          ? {
            ...story,
            commentsCount: story.commentsCount + 1,
            comments: [comment, ...story.comments],
          }
          : story
      )
    );
    toast.success("Comment posted");
  };

  return (
    <div className="relative isolate overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-112 bg-[radial-gradient(circle_at_20%_20%,rgba(66,156,168,0.2),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(66,156,168,0.14),transparent_28%),linear-gradient(180deg,#fff,#f8fafc_45%,#eef7f8)]" />
      <div className="absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[#429CA8]/10 blur-3xl" />

      <div className="container py-6 sm:py-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Button variant="ghost" size="sm" asChild className="rounded-full">
            <Link href={`/${lang}/myHome`}>
              <ArrowLeft className="size-4" />
              {dict.common.back}
            </Link>
          </Button>

          <AddSuccessStoryDialog
            title={dict.successStories.shareDialogTitle}
            description={dict.successStories.shareDialogDescription}
            userAvatar={avatarUrl(currentUser.avatarSeed, 96)}
          />
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#2b7e87]">
              <Sparkles className="size-4" />
              {dict.successStories.title}
            </div>
            <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {dict.successStories.introTitle}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              {dict.successStories.introDescription}
            </p>
          </div>

          <FeedFilters
            sortKey={sortKey}
            setSortKey={(value) => startTransition(() => setSortKey(value))}
            isPending={isPending}
            totalStories={stories.length}
            totalMedia={stories.reduce((sum, story) => sum + countMedia(story), 0)}
          />
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-5">
            {visibleStories?.map((story) => (
              <StoryCard
                key={story.id}
                lang={lang}
                story={story}
                onLike={handleLike}
                onComment={handleComment}
                currentUser={currentUser}
                dict={dict}
              />
            ))}
          </div>

          <aside className="hidden xl:block">
            <div className="sticky top-24 space-y-4 rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Why this section matters
              </p>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>Stories create trust. Members can show progress, celebrate milestones, and inspire others in the community.</p>
                <p>Each post now supports richer media previews, mock social proof, and stronger interactive states.</p>
              </div>
              <Button variant="outline" className="w-full rounded-full border-[#429CA8]/20 text-[#2b7e87]" asChild>
                <Link href={`/${lang}/myHome`}>
                  <ChevronDown className="size-4 rotate-90" />
                  Explore more
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
