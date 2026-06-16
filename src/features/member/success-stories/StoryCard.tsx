"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, MoreHorizontal, Share2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { avatarUrl } from "@/lib/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { SuccessStory } from "./types";
import { brandButtonClass, countMedia, StoryMediaStrip, StoryReactions } from "./shared";
import { StoryComments } from "./StoryComments";

const relationMap: Record<SuccessStory["relationshipStatus"], { label: string; className: string }> = {
  DATING: { label: "Dating", className: "bg-sky-500/10 text-sky-700 ring-sky-500/20" },
  ENGAGED: { label: "Engaged", className: "bg-rose-500/10 text-rose-700 ring-rose-500/20" },
  OTHER: { label: "Other", className: "bg-amber-500/10 text-amber-700 ring-amber-500/20" },
};

function formatDate(date: string, lang: Locale) {
  return new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function StoryCard({
  lang,
  story,
  currentUser,
  dict,
  onLike,
  onComment,
}: {
  lang: Locale;
  story: SuccessStory;
  currentUser: { id: string; username: string; avatarSeed: string };
  dict: Dictionary;
  onLike: (id: string) => void;
  onComment: (id: string, text: string) => void;
}) {
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const commentInputId = `story-comment-${story.id}`;
  const mediaCount = countMedia(story);
  const storyHref = `/${lang}/success-stories/details/${story.id}`;
  const meta = relationMap[story.relationshipStatus];
  const previewComments = story.comments.slice(0, 2);

  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <div className="p-5 pb-0 sm:p-6 sm:pb-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link href={`/${lang}/profile/${story.user.username}`}>
              <img
                src={avatarUrl(story.user.profileImage, 120)}
                alt={story.user.name}
                className="size-12 rounded-full object-cover ring-2 ring-white"
              />
            </Link>
            <div className="min-w-0">
              <Link href={`/${lang}/profile/${story.user.username}`} className="block truncate font-semibold text-slate-900 hover:text-[#429CA8]">
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
                <Link href={storyHref}>Open details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() =>
                  toast.message("Report sent", {
                    description: "Thanks for helping keep the community safe.",
                  })
                }
              >
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge className={cn("rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ring-1", meta.className)}>
            {meta.label}
          </Badge>
          {mediaCount > 0 ? (
            <Badge variant="outline" className="rounded-full border-dashed px-3 py-1 text-[11px] font-semibold">
              {mediaCount} media
            </Badge>
          ) : null}
          <Badge variant="outline" className="rounded-full border-[#429CA8]/20 px-3 py-1 text-[11px] font-semibold text-[#2b7e87]">
            {story.relationshipStatus}
          </Badge>
        </div>

        <div className="mt-4">
          <Link href={storyHref} className="group block">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 group-hover:text-[#429CA8]">{story.title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600 line-clamp-3">{story.story}</p>
          </Link>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <StoryMediaStrip media={story.media} storyHref={storyHref} />

        <div className="mt-5 flex gap-3 items-center">
          <Button
            type="button"
            variant="outline"
            className={cn(
              " justify-start gap-2 rounded-[1.25rem] border-[#429CA8]/18 px-4 py-6",
              liked ? "bg-[#429CA8] text-[#429CA8]! hover:bg-[#388994]" : "text-slate-900"
            )}
            onClick={() => {
              setLiked((prev) => !prev);
              onLike(story.id);
            }}
          >
            <Heart className={cn("size-4", liked && "fill-current")} />
            <span>{story.likesCount}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            className=" justify-start gap-2 rounded-[1.25rem] border-[#429CA8]/18 px-4 py-6 text-slate-900"
            onClick={() => {
              const input = document.getElementById(commentInputId) as HTMLTextAreaElement | null;
              input?.focus();
              input?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          >
            <MessageCircle className="size-4" />
            <span>{story.commentsCount}</span>
          </Button>

          <Button
            variant="ghost"
            className="rounded-full sm:col-span-2"
            onClick={() =>
              toast.message(dict.successStories.share, {
                description: "Sharing can be wired to your real flow next.",
              })
            }
          >
            <Share2 className="size-4" />
            {dict.successStories.share}
          </Button>
        </div>

        <form
          className="mt-5 flex items-start gap-3 rounded-[1.5rem] border border-[#429CA8]/12 bg-[#429CA8]/6 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!comment.trim()) return;
            onComment(story.id, comment.trim());
            setComment("");
          }}
        >
          <Image
            src={avatarUrl(currentUser.avatarSeed, 80)}
            alt=""
            height={80}
            width={80}
            className="size-9 rounded-full object-cover ring-2 ring-white"
          />
          <div className="min-w-0 flex-1">
            <textarea
              id={commentInputId}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={dict.successStories.commentPlaceholder}
              className="min-h-20 w-full resize-none rounded-2xl border border-[#429CA8]/15 bg-white px-4 py-3 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-[#429CA8]"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">{dict.successStories.commentHint}</p>
              <Button type="submit" className={brandButtonClass}>
                {dict.successStories.comment}
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Recent comments</p>
            <p className="text-xs text-muted-foreground">{previewComments.length} shown</p>
          </div>
          <StoryComments comments={previewComments} compact />
        </div>
      </div>
    </article>
  );
}
