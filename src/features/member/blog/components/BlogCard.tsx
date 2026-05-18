"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { BlogPost, Comment, User } from "@/lib/types";
import { photoUrl } from "@/lib/image";
import { PostHeader } from "@/features/member/home/cards/PostHeader";
import { PostActions } from "@/features/member/home/cards/PostActions";

interface BlogCardProps {
  lang: Locale;
  dict: Dictionary;
  blog: BlogPost;
  author: User;
  likeCount: number;
  liked: boolean;
  comments: Comment[];
  authors: Record<string, { displayName: string; avatarSeed: string }>;
  currentUserAvatarSeed: string;
}

export function BlogCard({
  lang,
  dict,
  blog,
  author,
  likeCount,
  liked,
  comments,
  authors,
  currentUserAvatarSeed,
}: BlogCardProps) {
  const count = blog.imageSeeds.length;

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card">
      <PostHeader user={author} lang={lang} showAgeGender />

      <Link href={`/${lang}/blog/${blog.id}`} className="block group">
        <div className="px-4 pt-3 pb-2">
          <h2 className="font-semibold text-base leading-snug group-hover:text-brand transition-colors line-clamp-2">
            {blog.title}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {blog.content}
          </p>
        </div>

        {count > 0 ? (
          <div
            className={cn(
              "mt-2 gap-1 px-4 pb-3",
              count === 1 ? "flex" : "grid grid-cols-2"
            )}
          >
            {blog.imageSeeds.slice(0, 2).map((seed, i) => (
              <div
                key={seed + i}
                className="overflow-hidden rounded-md bg-muted aspect-5/3"
              >
                <Image
                  src={photoUrl(seed, 600, 400)}
                  alt={blog.title}
                  width={600}
                  height={400}
                  className="size-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  unoptimized
                />
              </div>
            ))}
          </div>
        ) : null}
      </Link>

      <PostActions
        kind="blog"
        postId={blog.id}
        initialLikeCount={likeCount}
        initialLiked={liked}
        initialComments={comments}
        authors={authors}
        currentUserAvatarSeed={currentUserAvatarSeed}
        commentPlaceholder={dict.blog.commentPlaceholder}
      />
    </article>
  );
}
