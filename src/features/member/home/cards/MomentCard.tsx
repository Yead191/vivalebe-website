import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Comment, MomentPost, User } from "@/lib/types";
import { photoUrl } from "@/lib/image";
import { PostHeader } from "./PostHeader";
import { PostActions } from "./PostActions";

interface MomentCardProps {
  lang: Locale;
  dict: Dictionary;
  moment: MomentPost;
  author: User;
  likeCount: number;
  liked: boolean;
  comments: Comment[];
  authors: Record<string, { displayName: string; avatarSeed: string }>;
  currentUserAvatarSeed: string;
}

export function MomentCard({
  lang,
  dict,
  moment,
  author,
  likeCount,
  liked,
  comments,
  authors,
  currentUserAvatarSeed,
}: MomentCardProps) {
  const count = moment.imageSeeds.length;
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card">
      <PostHeader user={author} lang={lang} showAgeGender />
      {moment.text ? (
        <p className="px-4 pt-2 text-sm text-foreground">{moment.text}</p>
      ) : null}
      {count > 0 ? (
        <div
          className={cn(
            "mt-3 gap-1 px-4 pb-3",
            count === 1 ? "flex" : "grid grid-cols-2"
          )}
        >
          {moment.imageSeeds.map((seed, i) => (
            <div
              key={seed + i}
              className="overflow-hidden rounded-md bg-muted aspect-square"
            >
              <Image
                src={photoUrl(seed, 600, 600)}
                alt={moment.text ?? moment.id}
                width={600}
                height={600}
                className="size-full object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      ) : null}
      <PostActions
        kind="moment"
        postId={moment.id}
        initialLikeCount={likeCount}
        initialLiked={liked}
        initialComments={comments}
        authors={authors}
        currentUserAvatarSeed={currentUserAvatarSeed}
        commentPlaceholder={dict.myHome.composerPlaceholder}
      />
    </article>
  );
}
