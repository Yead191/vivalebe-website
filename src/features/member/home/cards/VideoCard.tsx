import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Comment, User, VideoPost } from "@/lib/types";
import { photoUrl } from "@/lib/image";
import { PostHeader } from "./PostHeader";
import { PostActions } from "./PostActions";

interface VideoCardProps {
  lang: Locale;
  dict: Dictionary;
  video: VideoPost;
  author: User;
  likeCount: number;
  liked: boolean;
  comments: Comment[];
  authors: Record<string, { displayName: string; avatarSeed: string }>;
  currentUserAvatarSeed: string;
}

export function VideoCard({
  lang,
  dict,
  video,
  author,
  likeCount,
  liked,
  comments,
  authors,
  currentUserAvatarSeed,
}: VideoCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card">
      <PostHeader user={author} lang={lang} />
      {video.caption ? (
        <p className="px-4 pt-2 text-sm text-foreground">{video.caption}</p>
      ) : null}
      <div className="mt-3 aspect-[4/5] bg-muted overflow-hidden">
        <Image
          src={photoUrl(video.imageSeed, 800, 1000)}
          alt={video.caption ?? video.id}
          width={800}
          height={1000}
          className="size-full object-cover"
          unoptimized
        />
      </div>
      <PostActions
        kind="video"
        postId={video.id}
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
