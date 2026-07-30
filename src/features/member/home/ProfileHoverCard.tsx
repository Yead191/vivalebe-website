"use client";

import { useState } from "react";

import { ImageWithFallback as Image } from "@/components/shared/ImageWithFallback";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { User } from "@/lib/types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { avatarUrl, photoUrl } from "@/lib/image";
import { createChatRoom, swipeUser } from "../my-list/action";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  user: User;
  lang: Locale;
  dict: Dictionary;
}

export function ProfileHoverCard({ user, lang, dict }: Props) {
  const router = useRouter();
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [liked, setLiked] = useState(user.isLiked || false);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSwiping) return;
    setIsSwiping(true);

    const action = liked ? "reject" : "like";
    setLiked(!liked);

    try {
      const res = await swipeUser(user.id, action);
      if (res.success) {
        toast.success(res.message || `User ${action}d successfully`);
      } else {
        setLiked(liked);
        toast.error(res.message || "Failed to swipe");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setLiked(liked);
      toast.error("An error occurred");
    } finally {
      setIsSwiping(false);
    }
  };

  const goToProfile = () => router.push(`/${lang}/my-list/profile/${user.id}`);

  const handleChatClick = async () => {
    try {
      setIsCreatingChat(true);
      const res = await createChatRoom(user.id);
      if (res.success) {
        const roomId = res.data?._id || res.data?.id;
        if (roomId) {
          router.push(`/${lang}/chat/${roomId}`);
        } else {
          router.push(`/${lang}/chat`);
        }
      } else {
        console.error("Failed to create chat room", res);
        router.push(`/${lang}/chat`);
      }
    } catch (error) {
      console.error(error);
      router.push(`/${lang}/chat`);
    } finally {
      setIsCreatingChat(false);
    }
  };

  return (
    <HoverCard openDelay={150} closeDelay={120}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          onClick={goToProfile}
          className="block aspect-4/5 w-full overflow-hidden rounded-lg bg-muted ring-1 ring-border focus-visible:ring-2 focus-visible:ring-brand outline-none"
          aria-label={user.displayName}
        >
          <Image
            src={user.coverSeed}
            alt={user.displayName}
            width={240}
            height={300}
            className="size-full object-cover transition-transform hover:scale-105"
            unoptimized
          />
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        side="left"
        align="start"
        className="w-80 p-0 overflow-hidden"
      >
        <button
          type="button"
          onClick={goToProfile}
          className="block w-full text-left"
        >
          <div className="flex items-center gap-3 p-4">
            <Image
              src={avatarUrl(user.avatarSeed, 80)}
              alt={user.displayName}
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
              unoptimized
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold tracking-wide">
                  {user.displayName}
                </span>
                {user.verified ? <VerifiedBadge /> : null}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {user.city}, {user.country}
              </p>
            </div>
          </div>
        </button>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 border-t border-border px-4 py-3 text-xs">
          <dt className="text-muted-foreground">
            {dict.profile.relationshipStatus}:
          </dt>
          <dd>{user.relationshipStatus}</dd>
          <dt className="text-muted-foreground">{dict.discover.ethnicity}:</dt>
          <dd>{user.ethnicity}</dd>
          <dt className="text-muted-foreground">{dict.profile.religion}:</dt>
          <dd>{user.religion}</dd>
          <dt className="text-muted-foreground">{dict.discover.livingWith}:</dt>
          <dd>{user.livingWith}</dd>
        </dl>
        <div className="grid grid-cols-2 gap-2 border-t border-border p-3">
          <button
            type="button"
            onClick={handleLikeClick}
            disabled={isSwiping}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-50",
              liked
                ? "border-red-500 text-red-500 hover:bg-red-50"
                : "border-brand text-brand hover:bg-brand-soft",
            )}
          >
            <Heart className={cn("size-3.5", liked && "fill-current")} />
            {dict.myHome.actionLike}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleChatClick();
            }}
            disabled={isCreatingChat}
            className="inline-flex items-center justify-center rounded-md bg-brand px-3 py-2 text-xs font-semibold text-brand-foreground hover:bg-brand-hover transition-colors disabled:opacity-50"
          >
            {isCreatingChat ? "..." : dict.myHome.actionMessage}
          </button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
