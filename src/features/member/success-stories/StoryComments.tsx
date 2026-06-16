"use client";

import Image from "next/image";
import { avatarUrl } from "@/lib/image";
import { cn } from "@/lib/utils";
import type { Comment } from "@/lib/types";
import { mockCommentAuthors } from "./shared";

export function StoryComments({
  comments,
  compact = false,
}: {
  comments: Comment[];
  compact?: boolean;
}) {
  return (
    <div className={cn("space-y-3", compact && "space-y-2")}>
      {comments.map((comment) => {
        const author = mockCommentAuthors[comment.authorId] ?? {
          name: "Community member",
          username: "member",
          image: avatarUrl(comment.authorId, 96),
        };

        return (
          <div
            key={comment.id}
            className={cn(
              "flex items-start gap-3 rounded-[1.35rem] border border-[#429CA8]/12 bg-white/90 p-3 shadow-[0_12px_40px_rgba(15,23,42,0.05)]",
              compact && "p-2.5"
            )}
          >
            <Image
              src={author.image}
              alt={author.name}
              width={38}
              height={38}
              className="size-9 rounded-full object-cover ring-2 ring-white"
              unoptimized
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-slate-900">{author.name}</p>
                <span className="text-xs text-muted-foreground">@{author.username}</span>
              </div>
              <p className={cn("mt-1 text-sm leading-6 text-slate-600", compact && "text-xs leading-5")}>
                {comment.text}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
