"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, MessageCircle, Flag, Share2 } from "lucide-react";
import { avatarUrl } from "@/lib/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { Comment } from "@/lib/types";
import type { SuccessStory } from "./types";

export function SuccessStoryDetailsClient({
  lang,
  dict,
  initialStory,
  currentUser,
}: {
  lang: Locale;
  dict: Dictionary;
  currentUser: { id: string; username: string; avatarSeed: string };
  initialStory: SuccessStory;
}) {
  const [story, setStory] = useState(initialStory);
  const [comment, setComment] = useState("");

  const handleLike = () => {
    setStory((prev) => ({ ...prev, likesCount: prev.likesCount + 1 }));
  };

  const handleComment = (text: string) => {
    const newComment: Comment = {
      id: `${story.id}-${Date.now()}`,
      authorId: currentUser.id,
      text,
      createdAt: new Date().toISOString(),
    };

    setStory((prev) => ({
      ...prev,
      commentsCount: prev.commentsCount + 1,
      comments: [newComment, ...prev.comments],
    }));
    toast.success("Comment posted");
    setComment("");
  };

  return (
    <div className="container py-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild className="rounded-full">
          <Link href={`/${lang}/success-stories`}>
            <ArrowLeft className="size-4" />
            {dict.successStories.backToStories}
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="rounded-full" onClick={() => toast.message("Report sent", { description: "Thanks for helping keep the feed safe." })}>
          <Flag className="size-4" />
          {dict.successStories.report}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="relative h-[24rem] bg-slate-950">
            {story.media[0] ? (
              <Image src={story.media[0].url} alt={story.media[0].alt} fill className="object-cover" unoptimized />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">{story.relationshipStatus}</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">{story.title}</h1>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-3">
              <Image src={avatarUrl(story.user.profileImage, 96)} alt={story.user.name} width={52} height={52} className="size-13 rounded-full object-cover" unoptimized />
              <div>
                <Link href={`/${lang}/profile/${story.user.username}`} className="font-semibold hover:text-brand">
                  {story.user.name}
                </Link>
                <p className="text-sm text-muted-foreground">@{story.user.username}</p>
              </div>
            </div>

            <p className="mt-5 text-base leading-8 text-foreground/90">{story.story}</p>

            <div className="mt-6 flex items-center gap-2">
              <Button onClick={handleLike} className="rounded-full">
                <Heart className="size-4" />
                {dict.successStories.like} {story.likesCount}
              </Button>
              <Button variant="secondary" className="rounded-full">
                <Share2 className="size-4" />
                {dict.successStories.share}
              </Button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {story.media.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-2xl border border-border">
                  {item.type === "image" ? (
                    <Image src={item.url} alt={item.alt} width={800} height={600} className="h-56 w-full object-cover" unoptimized />
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-slate-950 text-white">
                      <MessageCircle className="size-8" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </article>

        <aside className="space-y-4 rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            {dict.successStories.commentsTitle}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!comment.trim()) return;
              handleComment(comment.trim());
            }}
            className="space-y-3 rounded-2xl border border-border bg-muted/40 p-4"
          >
              <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={dict.successStories.commentPlaceholder}
              className="min-h-32 resize-none rounded-2xl bg-background"
            />
            <div className="flex justify-end">
              <Button type="submit" className="rounded-full">
                <MessageCircle className="size-4" />
                {dict.successStories.postComment}
              </Button>
            </div>
          </form>

          <div className="space-y-3">
            {story.comments.length === 0 ? (
              <p className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                {dict.successStories.commentHint}
              </p>
            ) : (
              story.comments.map((item) => (
                <div key={item.id} className="rounded-2xl border border-border p-4 text-sm">
                  <p className="font-medium">{story.user.name}</p>
                  <p className="mt-1 text-muted-foreground">{item.text}</p>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
