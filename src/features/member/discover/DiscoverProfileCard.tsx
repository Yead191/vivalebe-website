"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, Heart, MessageCircle, Smile } from "lucide-react";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { User } from "@/lib/types";
import { photoUrl } from "@/lib/image";
import {
  sendWink,
  acceptWink,
  createChatRoom,
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

  const handleWinkClick = async () => {
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
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSendingWink(false);
    }
  };
  const photoCount = user.photos.length;

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="grid gap-0 sm:grid-cols-[300px_minmax(0,1fr)] lg:grid-cols-[400px_minmax(0,1fr)] 2xl:grid-cols-[500px_minmax(0,1fr)]">
        <Link
          href={`/${lang}/profile/${user.username}`}
          className="relative block aspect-square w-full overflow-hidden bg-muted sm:aspect-auto"
        >
          <Image
            src={photoUrl(user.coverSeed, 520, 520)}
            alt={user.displayName}
            width={520}
            height={520}
            className="size-full object-cover transition-transform hover:scale-105"
            unoptimized
          />
          {photoCount > 1 ? (
            <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white">
              <Camera className="size-3" />
              {photoCount}
            </span>
          ) : null}
        </Link>

        <div className="flex flex-col gap-3 p-5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/${lang}/profile/${user.username}`}
                className="text-base font-semibold tracking-wide hover:text-brand transition-colors"
              >
                {user.displayName}
              </Link>
              {user.premium ? (
                <span className="rounded-sm border border-border px-1.5 text-[10px] font-semibold tracking-wider text-foreground">
                  {dict.discover.premium}
                </span>
              ) : null}
              {user.verified ? <VerifiedBadge /> : null}
            </div>
            <p className="text-sm text-muted-foreground">
              {user.age}, {user.city}
              {user.state ? `, ${user.state}` : ""}, {user.country}
            </p>
            {user.willingToFly ? (
              <p className="text-sm font-medium text-brand">
                {dict.discover.willingToFly}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold tracking-wider text-foreground">
              {dict.discover.basicInformation}
            </h4>
            <dl className="grid grid-cols-1 gap-y-1 text-sm">
              <Row label={dict.discover.ethnicity} value={user.ethnicity} />
              <Row label={dict.discover.height} value={user.height} />
              <Row label={dict.discover.bodyType} value={user.bodyType} />
              <Row label={dict.discover.livingWith} value={user.livingWith} />
            </dl>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-semibold tracking-wider text-foreground">
              {dict.discover.profileHeadline}
            </h4>
            <p className="text-sm text-foreground">{user.headline}</p>
          </div>

          <div className="mt-auto flex items-center gap-4 pt-2">
            <button
              type="button"
              aria-label="Wink"
              onClick={handleWinkClick}
              disabled={isSendingWink || winked}
              className={`transition-colors disabled:opacity-50 ${winked ? "text-brand" : "text-muted-foreground hover:text-brand"}`}
            >
              <Smile className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Message"
              onClick={handleChatClick}
              disabled={isCreatingChat}
              className="text-muted-foreground hover:text-brand transition-colors disabled:opacity-50"
            >
              <MessageCircle className="size-5" />
            </button>
            <Link
              href={`/${lang}/profile/${user.username}?action=like`}
              aria-label="Like"
              className="text-muted-foreground hover:text-brand transition-colors"
            >
              <Heart className="size-5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[8rem_minmax(0,1fr)] gap-2">
      <dt className="text-muted-foreground">{label}:</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}
