"use client";

import { useState } from "react";

import Image from "next/image";
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
import { avatarUrl, photoUrl } from "@/lib/image";
import { createChatRoom } from "../my-list/action";

interface Props {
  user: User;
  lang: Locale;
  dict: Dictionary;
}

export function ProfileHoverCard({ user, lang, dict }: Props) {
  const router = useRouter();
  const [isCreatingChat, setIsCreatingChat] = useState(false);
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
            onClick={(e) => {
              e.stopPropagation();
              goToProfile();
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-brand px-3 py-2 text-xs font-semibold text-brand hover:bg-brand-soft transition-colors"
          >
            <Heart className="size-3.5" />
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
