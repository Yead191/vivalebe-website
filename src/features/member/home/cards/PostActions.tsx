"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { ThumbsUp, MessageCircle, Send } from "lucide-react";
import { toggleLikeAction, addCommentAction } from "@/lib/actions/feed";
import { avatarUrl } from "@/lib/image";
import { cn } from "@/lib/utils";
import type { Comment } from "@/lib/types";

interface PostActionsProps {
  kind: "video" | "moment";
  postId: string;
  initialLikeCount: number;
  initialLiked: boolean;
  initialComments: Comment[];
  authors: Record<string, { displayName: string; avatarSeed: string }>;
  currentUserAvatarSeed: string;
  commentPlaceholder?: string;
}

export function PostActions({
  kind,
  postId,
  initialLikeCount,
  initialLiked,
  initialComments,
  authors,
  currentUserAvatarSeed,
  commentPlaceholder = "Write a comment...",
}: PostActionsProps) {
  const [likes, setLikes] = useState({ count: initialLikeCount, liked: initialLiked });
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [showComments, setShowComments] = useState(initialComments.length > 0);
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();

  const onLike = () => {
    setLikes((prev) =>
      prev.liked
        ? { count: Math.max(0, prev.count - 1), liked: false }
        : { count: prev.count + 1, liked: true }
    );
    startTransition(async () => {
      const next = await toggleLikeAction(kind, postId);
      setLikes({ count: next.count, liked: next.byCurrentUser });
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setText("");
    setShowComments(true);
    startTransition(async () => {
      const updated = await addCommentAction(kind, postId, trimmed);
      setComments(updated);
    });
  };

  return (
    <>
      <div className="flex items-center justify-end gap-4 border-t border-border px-4 py-2">
        <button
          type="button"
          onClick={onLike}
          disabled={isPending}
          className={cn(
            "inline-flex items-center gap-1.5 text-sm transition-colors",
            likes.liked ? "text-brand" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <ThumbsUp
            className={cn("size-4", likes.liked ? "fill-brand" : "")}
          />
          {likes.count > 0 ? likes.count : ""}
        </button>
        <button
          type="button"
          onClick={() => setShowComments((s) => !s)}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageCircle className="size-4" />
          {comments.length > 0 ? comments.length : ""}
        </button>
      </div>

      {showComments ? (
        <div className="border-t border-border px-4 py-3 space-y-3 bg-muted/30">
          {comments.map((c) => {
            const author = authors[c.authorId];
            return (
              <div key={c.id} className="flex gap-2 text-sm">
                <Image
                  src={avatarUrl(author?.avatarSeed ?? c.authorId, 48)}
                  alt={author?.displayName ?? ""}
                  width={28}
                  height={28}
                  className="size-7 shrink-0 rounded-full object-cover"
                  unoptimized
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold">{author?.displayName ?? "USER"}</p>
                  <p className="text-sm text-foreground">{c.text}</p>
                </div>
              </div>
            );
          })}
          <form onSubmit={onSubmit} className="flex items-center gap-2 pt-1">
            <Image
              src={avatarUrl(currentUserAvatarSeed, 48)}
              alt=""
              width={28}
              height={28}
              className="size-7 shrink-0 rounded-full object-cover"
              unoptimized
            />
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={commentPlaceholder}
              className="flex-1 rounded-full border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-brand"
            />
            <button
              type="submit"
              disabled={!text.trim() || isPending}
              aria-label="Send"
              className="rounded-full p-2 text-brand hover:bg-brand-soft disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
