"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BellRing,
  BookOpenText,
  Camera,
  ChevronDown,
  Heart,
  MessageCircle,
  MoreHorizontal,
  PlusCircle,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";
import { avatarUrl } from "@/lib/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Comment } from "@/lib/types";
import { sortOptions } from "./data";
import type { SuccessStory, SuccessStoriesSortKey } from "./types";

const relationMap: Record<
  SuccessStory["relationshipStatus"],
  { label: string; className: string }
> = {
  DATING: {
    label: "Dating",
    className: "bg-sky-500/10 text-sky-700 ring-sky-500/20",
  },
  ENGAGED: {
    label: "Engaged",
    className: "bg-rose-500/10 text-rose-700 ring-rose-500/20",
  },
  OTHER: {
    label: "Other",
    className: "bg-amber-500/10 text-amber-700 ring-amber-500/20",
  },
};

function countMedia(story: SuccessStory) {
  return story.media.filter((item) => item.type === "image" || item.type === "video").length;
}

function formatDate(date: string, lang: Locale) {
  return new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function StoryCard({
  lang,
  story,
  onLike,
  onComment,
  currentUser,
  dict,
}: {
  lang: Locale;
  story: SuccessStory;
  onLike: (id: string) => void;
  onComment: (id: string, text: string) => void;
  currentUser: { id: string; username: string; avatarSeed: string };
  dict: Dictionary;
}) {
  const [comment, setComment] = useState("");
  const mediaCount = countMedia(story);
  const storyHref = `/${lang}/success-stories/details/${story.id}`;
  const meta = relationMap[story.relationshipStatus];

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/60 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <Link href={storyHref} className="block">
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
          {story.media[0] ? (
            <Image
              src={story.media[0].url}
              alt={story.media[0].alt}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_40%),linear-gradient(135deg,_#111827,_#1f2937_55%,_#0f172a)]">
              <Sparkles className="size-12 text-white/70" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <Badge className={cn("rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ring-1", meta.className)}>
              {meta.label}
            </Badge>
            {mediaCount > 0 ? (
              <Badge variant="secondary" className="rounded-full px-3 py-1 text-[11px] font-semibold">
                {mediaCount} media
              </Badge>
            ) : null}
          </div>
          <div className="absolute inset-x-4 bottom-4">
            <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-white">
              {story.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/78 line-clamp-2">
              {story.story}
            </p>
          </div>
        </div>
      </Link>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link href={`/${lang}/profile/${story.user.username}`} className="shrink-0">
              <Image
                src={avatarUrl(story.user.profileImage, 88)}
                alt={story.user.name}
                width={44}
                height={44}
                className="size-11 rounded-full object-cover ring-2 ring-white shadow-sm"
                unoptimized
              />
            </Link>
            <div className="min-w-0">
              <Link href={`/${lang}/profile/${story.user.username}`} className="block truncate font-semibold text-foreground hover:text-brand">
                {story.user.name}
              </Link>
              <p className="text-xs text-muted-foreground">{formatDate(story.createdAt, lang)}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="rounded-full">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={storyHref}>{dict.successStories.openDetails}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() =>
                  toast.message(dict.successStories.report, {
                    description: "Thanks for helping keep the community safe.",
                  })
                }
              >
                {dict.successStories.report}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="rounded-full border-dashed px-3 py-1">
            <BookOpenText className="mr-1.5 size-3.5" />
            {story.relationshipStatus}
          </Badge>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
            <Heart className="size-3.5" />
            {story.likesCount}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
            <MessageCircle className="size-3.5" />
            {story.commentsCount}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onLike(story.id)} className="rounded-full">
            <Heart className="size-4" />
            {dict.successStories.like}
          </Button>
          <Button variant="secondary" size="sm" asChild className="rounded-full">
            <Link href={storyHref}>
              <MessageCircle className="size-4" />
              {dict.successStories.comment}
            </Link>
          </Button>
        </div>

        <form
          className="mt-4 flex items-start gap-3 rounded-2xl border border-border/70 bg-muted/40 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!comment.trim()) return;
            onComment(story.id, comment.trim());
            setComment("");
          }}
        >
          <Image
            src={avatarUrl(currentUser.avatarSeed, 60)}
            alt=""
            width={34}
            height={34}
            className="size-8 rounded-full object-cover"
            unoptimized
          />
          <div className="min-w-0 flex-1">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={dict.successStories.commentPlaceholder}
              className="min-h-20 resize-none rounded-2xl border-border/70 bg-background"
            />
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">{dict.successStories.commentHint}</p>
              <Button type="submit" size="sm" className="rounded-full">
                <MessageCircle className="size-4" />
                {dict.successStories.reply}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </article>
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
    setStories((prev) =>
      prev.map((story) =>
        story.id === storyId ? { ...story, likesCount: story.likesCount + 1 } : story
      )
    );
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
      <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_20%_20%,rgba(244,114,182,0.18),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.16),transparent_28%),linear-gradient(180deg,#fff,#f8fafc_45%,#f1f5f9)]" />
      <div className="absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />

      <div className="container py-6 sm:py-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Button variant="ghost" size="sm" asChild className="rounded-full">
            <Link href={`/${lang}/myHome`}>
              <ArrowLeft className="size-4" />
              {dict.common.back}
            </Link>
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-full shadow-lg shadow-brand/20">
                <PlusCircle className="size-4" />
                {dict.successStories.createStory}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{dict.successStories.shareDialogTitle}</DialogTitle>
                <DialogDescription>{dict.successStories.shareDialogDescription}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input placeholder="Title" />
                <Input placeholder="Relationship status" />
                <Textarea placeholder="Tell your story..." className="min-h-40 sm:col-span-2" />
              </div>
              <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-4">
                <p className="text-sm font-medium">{dict.successStories.guidelinesTitle}</p>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Camera className="mt-0.5 size-4" />
                    {dict.successStories.guideline1}
                  </li>
                  <li className="flex items-start gap-2">
                    <BellRing className="mt-0.5 size-4" />
                    {dict.successStories.guideline2}
                  </li>
                  <li className="flex items-start gap-2">
                    <TriangleAlert className="mt-0.5 size-4" />
                    {dict.successStories.guideline3}
                  </li>
                </ul>
              </div>
              <DialogFooter>
                <Button variant="outline">Save draft</Button>
                <Button>Post story</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-brand">
              <Sparkles className="size-4" />
              {dict.successStories.title}
            </div>
            <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {dict.successStories.introTitle}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              {dict.successStories.introDescription}
            </p>
          </div>

          <aside className="grid gap-4 rounded-[2rem] border border-white/70 bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)]">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/65">
              Feed filters
            </p>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => {
                const key: SuccessStoriesSortKey =
                  option === "Newest"
                    ? "newest"
                    : option === "Photos & Videos"
                      ? "media"
                      : option === "Most Popular"
                        ? "popular"
                        : option === "Dating"
                          ? "dating"
                          : option === "Engaged"
                            ? "engaged"
                            : option === "Other"
                              ? "other"
                              : "mine";
                const active = sortKey === key;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => startTransition(() => setSortKey(key))}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition-all",
                      active
                        ? "border-white bg-white text-slate-950 shadow-lg"
                        : "border-white/15 bg-white/5 text-white/78 hover:bg-white/10"
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            <div className="grid gap-3 rounded-2xl bg-white/8 p-4 ring-1 ring-white/10 sm:grid-cols-3">
              <div>
                <p className="text-2xl font-semibold">{stories.length}</p>
                <p className="text-xs text-white/65">{dict.successStories.stories}</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {stories.reduce((sum, story) => sum + story.likesCount, 0)}
                </p>
                <p className="text-xs text-white/65">{dict.successStories.likes}</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {stories.reduce((sum, story) => sum + story.commentsCount, 0)}
                </p>
                <p className="text-xs text-white/65">{dict.successStories.comments}</p>
              </div>
            </div>
          </aside>
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-5">
            {isPending ? <p className="text-sm text-muted-foreground">Updating feed...</p> : null}
            {visibleStories.map((story) => (
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
                <p>
                  Stories create trust. Members can show progress, celebrate
                  milestones, and inspire others in the community.
                </p>
                <p>
                  Each post supports rich media, social actions, profile
                  deep-links, and moderation tools, so the experience feels
                  complete rather than like a simple list.
                </p>
              </div>
              <Button variant="outline" className="w-full rounded-full" asChild>
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
