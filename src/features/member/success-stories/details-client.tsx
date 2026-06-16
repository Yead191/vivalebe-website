"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Flag, Heart, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { avatarUrl } from "@/lib/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { Comment } from "@/lib/types";
import type { SuccessStory } from "./types";
import { brandButtonClass, brandSoftClass } from "./shared";
import { StoryComments } from "./StoryComments";
import { StoryMediaStrip } from "./shared";

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
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked((prev) => {
      setStory((current) => ({
        ...current,
        likesCount: Math.max(current.likesCount + (prev ? -1 : 1), 0),
      }));
      return !prev;
    });
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
        <Button
          variant="outline"
          size="sm"
          className={brandSoftClass}
          onClick={() => toast.message("Report sent", { description: "Thanks for helping keep the feed safe." })}
        >
          <Flag className="size-4" />
          {dict.successStories.report}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="p-6 pb-0">
            <div className="flex items-center gap-3">
              <Image
                src={avatarUrl(story.user.profileImage, 96)}
                alt={story.user.name}
                width={54}
                height={54}
                className="size-13 rounded-full object-cover ring-2 ring-white"
                unoptimized
              />
              <div>
                <Link href={`/${lang}/profile/${story.user.username}`} className="font-semibold text-slate-900 hover:text-[#429CA8]">
                  {story.user.name}
                </Link>
                <p className="text-sm text-muted-foreground">@{story.user.username}</p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#2b7e87]">{story.relationshipStatus}</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{story.title}</h1>
              <p className="mt-4 text-base leading-8 text-slate-600">{story.story}</p>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <Button onClick={handleLike} className={brandButtonClass}>
                <Heart className="size-4" />
                {liked ? "Liked" : dict.successStories.like}
                <span className="ml-1">{story.likesCount}</span>
              </Button>
              <Button variant="outline" className={brandSoftClass}>
                <Share2 className="size-4" />
                {dict.successStories.share}
              </Button>
            </div>
          </div>

          <div className="p-6">
            <StoryMediaStrip media={story.media} />
          </div>
        </article>

        <aside className="space-y-4 rounded-[2rem] border border-white/70 bg-white/95 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            {dict.successStories.commentsTitle}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!comment.trim()) return;
              handleComment(comment.trim());
            }}
            className="space-y-3 rounded-[1.5rem] border border-[#429CA8]/12 bg-[#429CA8]/6 p-4"
          >
            <div className="flex items-start gap-3">
              <Image
                src={avatarUrl(currentUser.avatarSeed, 96)}
                alt=""
                width={42}
                height={42}
                className="size-10 rounded-full object-cover ring-2 ring-white"
                unoptimized
              />
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={dict.successStories.commentPlaceholder}
                className="min-h-28 resize-none rounded-2xl border-[#429CA8]/15 bg-white"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" className={brandButtonClass}>
                <MessageCircle className="size-4" />
                {dict.successStories.postComment}
              </Button>
            </div>
          </form>

          <StoryComments comments={story.comments} />
        </aside>
      </div>
    </div>
  );
}
