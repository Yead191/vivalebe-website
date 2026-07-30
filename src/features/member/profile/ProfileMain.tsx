"use client";

import { useState } from "react";
import { ImageWithFallback as Image } from "@/components/shared/ImageWithFallback";
import { MessageCircle } from "lucide-react";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { User } from "@/lib/types";
import { photoUrl } from "@/lib/image";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PhotoViewerOverlay } from "./modals/PhotoViewerOverlay";
import { useRouter } from "next/navigation";
import { createChatRoom } from "../my-list/action";

interface Props {
  lang: Locale;
  dict: Dictionary;
  user: User;
  isPremium?: boolean;
}

export function ProfileMain({ lang, dict, user, isPremium = false }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"public" | "private">("public");
  const [expanded, setExpanded] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState<number | null>(null);

  const publicPhotos = user.photos.slice(0, 3);
  const remainingPublic = Math.max(0, user.photos.length - publicPhotos.length);
  const aboutPreview =
    user.bio.length > 320 ? user.bio.slice(0, 320) : user.bio;
  const hasMore = user.bio.length > 320;

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
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-base font-semibold tracking-wider">
              {user.displayName}
            </h1>
            {user.online ? (
              <span
                aria-label="Online"
                className="size-2.5 rounded-full bg-emerald-500"
              />
            ) : null}
            {user.verified ? <VerifiedBadge /> : null}
          </div>
          <p className="text-sm text-muted-foreground">
            {user.age}, {user.gender}, {user.city}
            {user.state ? `, ${user.state}` : ""}, {user.country}
          </p>
        </div>
        {/* <button
          type="button"
          aria-label="More"
          className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <MoreHorizontal className="size-5" />
          <span className="text-[10px]">more</span>
        </button> */}
      </header>

      <section id="summary" className="space-y-3 scroll-mt-24">
        <div className="flex items-center gap-3 text-sm">
          <span className="font-semibold">{dict.profile.photos}</span>
          <button
            type="button"
            onClick={() => setActiveTab("public")}
            className={cn(
              "underline-offset-4",
              activeTab === "public"
                ? "font-semibold text-foreground underline"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {dict.profile.public.replace("{count}", String(user.photos.length))}
          </button>
          <button
            disabled={!isPremium}
            type="button"
            onClick={() => setActiveTab("private")}
            className={cn(
              "underline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed",
              activeTab === "private"
                ? "font-semibold text-foreground underline"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {dict.profile.private} ({user.privatePhotosCount})
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {publicPhotos.map((seed, i) => {
            const isLast = i === publicPhotos.length - 1;
            const showOverlay = isLast && remainingPublic > 0;
            return (
              <div
                key={seed}
                className="group relative aspect-square overflow-hidden rounded-md bg-muted cursor-pointer"
                onClick={() => setSelectedPhotoIdx(i)}
              >
                <Image
                  src={photoUrl(seed, 400, 400)}
                  alt={`${user.displayName} ${i + 1}`}
                  width={400}
                  height={400}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized
                />
                {showOverlay ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-2xl font-bold text-white group-hover:bg-black/30 transition-colors">
                    +{remainingPublic}
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                )}
              </div>
            );
          })}
        </div>

        <button type="button" className="text-sm text-foreground">
          <span className="underline underline-offset-4">
            {dict.profile.remindUpload.split(" ")[0]}
          </span>{" "}
          {dict.profile.remindUpload
            .replace("{name}", user.displayName)
            .split(" ")
            .slice(1)
            .join(" ")}
        </button>
      </section>

      <button
        type="button"
        onClick={handleChatClick}
        disabled={isCreatingChat}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-3 text-sm font-semibold text-brand-foreground hover:bg-brand-hover transition-colors disabled:opacity-50"
      >
        <MessageCircle className="size-5" />
        {isCreatingChat ? "..." : dict.profile.sendPrivateMessage}
      </button>

      <section id="more-about-me" className="space-y-2 scroll-mt-24">
        <h2 className="text-sm font-semibold">
          {dict.profile.profileHeadline}
        </h2>
        <p className="text-sm text-foreground">{user.headline}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold">{dict.profile.aboutMe}</h2>
        <p className="whitespace-pre-line text-sm text-foreground">
          {expanded ? user.bio : aboutPreview}
          {hasMore && !expanded ? "..." : ""}
        </p>
        {hasMore ? (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="text-xs underline underline-offset-4 text-foreground hover:text-brand transition-colors"
          >
            {expanded ? dict.common.back : dict.common.more}
          </button>
        ) : null}
      </section>

      <section id="moments" className="space-y-2 scroll-mt-24">
        <h2 className="text-sm font-semibold">{dict.profile.navMoments}</h2>
        <p className="text-sm text-muted-foreground">—</p>
      </section>
      <section id="personal-blogs" className="space-y-2 scroll-mt-24">
        <h2 className="text-sm font-semibold">
          {dict.profile.navPersonalBlogs}
        </h2>
        <p className="text-sm text-muted-foreground">—</p>
      </section>
      {/* <section id="private-note" className="space-y-2 scroll-mt-24">
        <h2 className="text-sm font-semibold">
          {dict.profile.navAddPrivateNote}
        </h2>
        <textarea
          placeholder="…"
          rows={3}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-brand transition-colors"
        />
      </section> */}

      {/* Full-Screen Photo Viewer */}
      {/* {selectedPhotoIdx !== null && (
        <PhotoViewerOverlay
          user={user}
          initialIndex={selectedPhotoIdx}
          onClose={() => setSelectedPhotoIdx(null)}
        />
      )} */}
    </div>
  );
}
