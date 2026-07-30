"use client";

import { useState } from "react";
import { ImageWithFallback as Image } from "@/components/shared/ImageWithFallback";
import Link from "next/link";
import { Camera, Heart, MessageCircle, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { User } from "@/lib/types";
import { photoUrl } from "@/lib/image";
import {
  sendWink,
  acceptWink,
  createChatRoom,
  swipeUser,
} from "@/features/member/my-list/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  lang: Locale;
  dict: Dictionary;
  user: User;
}

export function DiscoverProfileCard({ lang, dict, user }: Props) {
  const router = useRouter();
  const [winked, setWinked] = useState(user.isWinked || false);
  const [isSendingWink, setIsSendingWink] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [liked, setLiked] = useState(user.isLiked || false);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSwiping) return;
    setIsSwiping(true);

    const action = liked ? "dislike" : "like";
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

  const handleChatClick = async () => {
    try {
      setIsCreatingChat(true);
      const res = await createChatRoom(user.id);
      if (res.success) {
        // Proceed to chat page
        const roomId = res.data?._id || res.data?.id;
        if (roomId) {
          router.push(`/${lang}/chat/${roomId}`);
        } else {
          router.push(`/${lang}/chat`);
        }
      } else {
        console.error("Failed to create chat room", res);
        // Fallback to chat if creation fails (maybe already exists)
        router.push(`/${lang}/chat`);
      }
    } catch (error) {
      console.error(error);
      router.push(`/${lang}/chat`);
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleWinkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (winked) return;
    setIsSendingWink(true);
    try {
      let res;
      if (user.winkId) {
        res = await acceptWink(user.winkId);
      } else {
        res = await sendWink(user.id);
      }

      if (res.success) {
        setWinked(true);
        toast.success(res.message || "Wink sent successfully");
      } else {
        toast.error(res.message || "Failed to send wink");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSendingWink(false);
    }
  };
  const photoCount = user.photos.length;

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:grid sm:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[480px_minmax(0,1fr)]">
        <Link
          href={`/${lang}/my-list/profile/${user.id}`}
          className="relative block overflow-hidden bg-muted aspect-square sm:aspect-auto sm:min-h-70 lg:min-h-92 2xl:min-h-120 "
        >
          <Image
            src={photoUrl(user.coverSeed, 520, 520)}
            alt={user.displayName}
            fill
            sizes="280px"
            className="object-cover transition-transform hover:scale-105"
            unoptimized
          />
          {photoCount > 1 ? (
            <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white">
              <Camera className="size-3" />
              {photoCount}
            </span>
          ) : null}
        </Link>

        <div className="flex flex-col gap-3 lg:gap-5 p-4 sm:p-5 lg:p-6 h-full">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/${lang}/my-list/profile/${user.id}`}
                className="text-sm lg:text-base font-bold tracking-wide hover:text-brand transition-colors"
              >
                {user.displayName}
              </Link>
              {user.premium ? (
                <span className="rounded-sm border border-border px-1.5 py-0.5 text-[9px] lg:text-[10px] font-semibold tracking-wider text-foreground">
                  {dict.discover.premium}
                </span>
              ) : null}
              {user.verified ? <VerifiedBadge /> : null}
            </div>
            <p className="mt-1 text-xs lg:text-sm leading-relaxed text-muted-foreground">
              {user.age}, {user.city}
              {user.state ? `, ${user.state}` : ""}
              {", "}
              {user.country}
            </p>
            {user.willingToFly ? (
              <p className="text-sm font-medium text-brand">
                {dict.discover.willingToFly}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] lg:text-xs font-bold tracking-widest text-foreground uppercase">
              {dict.discover.basicInformation}
            </h4>
            <div className="space-y-1 lg:space-y-1.5">
              {user.ethnicity ? (
                <p className="text-xs lg:text-sm text-brand leading-relaxed">
                  {dict.discover.ethnicity}: {user.ethnicity}
                </p>
              ) : null}
              {user.height ? (
                <p className="text-xs lg:text-sm text-brand leading-relaxed">
                  {dict.discover.height}: {user.height}
                </p>
              ) : null}
              {user.bodyType ? (
                <p className="text-xs lg:text-sm text-brand leading-relaxed">
                  {dict.discover.bodyType}: {user.bodyType}
                </p>
              ) : null}
              {user.livingWith ? (
                <p className="text-xs lg:text-sm text-brand leading-relaxed">
                  {dict.discover.livingWith}: {user.livingWith}
                </p>
              ) : null}
            </div>
          </div>

          {user.headline ? (
            <div className="space-y-2">
              <h4 className="text-[10px] lg:text-xs font-bold tracking-widest text-foreground uppercase">
                {dict.discover.profileHeadline}
              </h4>
              <p className="text-xs lg:text-sm text-brand leading-relaxed lg:leading-loose line-clamp-2">
                {user.headline}
              </p>
            </div>
          ) : null}

          <div className="mt-auto flex items-center gap-6 lg:gap-8 pt-3 lg:pt-5 w-full">
            <button
              type="button"
              aria-label="Wink"
              onClick={handleWinkClick}
              disabled={isSendingWink || winked}
              className={`transition-colors disabled:opacity-50 ${winked ? "text-brand" : "text-muted-foreground hover:text-brand"}`}
            >
              <Smile
                className={cn(
                  "size-5 lg:size-6 transition-transform",
                  winked && "fill-current stroke-card scale-110",
                )}
              />
            </button>
            <button
              type="button"
              aria-label="Message"
              onClick={handleChatClick}
              disabled={isCreatingChat}
              className="text-muted-foreground hover:text-brand transition-colors disabled:opacity-50"
            >
              <MessageCircle className="size-5 lg:size-6" />
            </button>
            <button
              type="button"
              aria-label="Like"
              onClick={handleLikeClick}
              disabled={isSwiping}
              className={`transition-colors disabled:opacity-50 ${liked ? "text-red-500" : "text-muted-foreground hover:text-brand"}`}
            >
              <Heart
                className={cn("size-5 lg:size-6", liked && "fill-current")}
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
