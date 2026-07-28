"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Smile,
  MessageCircle,
  Heart,
  MoreHorizontal,
  Flag,
  EyeOff,
  Ban,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { avatarUrl } from "@/lib/image";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { User } from "@/lib/types";
import { SendMessageModal } from "./SendMessageModal";
import { ReportContentModal } from "@/features/member/home/modals/ReportContentModal";

interface UserCardProps {
  lang: Locale;
  dict: Dictionary;
  user: User;
  activeTab?: string;
  onRemove?: (id: string) => void;
}

import { useRouter } from "next/navigation";
import {
  createChatRoom,
  sendWink,
  acceptWink,
  respondToPrivateAlbumRequest,
  swipeUser,
  blockUser,
  hideUser,
} from "../action";
import { toast } from "sonner";

export function UserCard({ lang, dict, user, activeTab, onRemove }: UserCardProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(user.isLiked || false);
  const [winked, setWinked] = useState(user.isWinked || false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [isSendingWink, setIsSendingWink] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  const [responseStatus, setResponseStatus] = useState<
    "accepted" | "rejected" | null
  >(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleRespond = async (isGranted: boolean) => {
    if (!user.privateAlbumRequestId) return;
    setIsResponding(true);
    try {
      const res = await respondToPrivateAlbumRequest(
        user.privateAlbumRequestId,
        isGranted,
      );
      if (res.success) {
        toast.success("Responded successfully");
        setResponseStatus(isGranted ? "accepted" : "rejected");
      } else {
        toast.error(res.message || "Failed to respond");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsResponding(false);
    }
  };

  const photo = user.photos[0] ?? avatarUrl(user.avatarSeed, 520);
  const photoCount = user.photos.length;

  const handleWinkClick = async () => {
    if (winked) return;
    setIsSendingWink(true);
    try {
      let res;
      if (user.winkId) {
        // Double match if winkId is present
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

  const handleLikeClick = async () => {
    if (isSwiping) return;
    setIsSwiping(true);

    // Toggle the UI optimistically or just wait for the response
    const action = liked ? "dislike" : "like";
    setLiked(!liked);

    try {
      const res = await swipeUser(user.id, action);
      if (res.success) {
        toast.success(res.message || `User ${action}d successfully`);
      } else {
        // Revert on failure
        setLiked(liked);
        toast.error(res.message || "Failed to swipe");
      }
    } catch (error) {
      setLiked(liked);
      toast.error("An error occurred");
    } finally {
      setIsSwiping(false);
    }
  };

  const handleBlock = async () => {
    if (isBlocking) return;
    setIsBlocking(true);
    setMenuOpen(false);

    try {
      const res = await blockUser(user.id);
      if (res.success) {
        toast.success(res.message || "User blocked successfully");
        if (onRemove) onRemove(user.id);
      } else {
        toast.error(res.message || "Failed to block user");
      }
    } catch (error) {
      toast.error("An error occurred while blocking");
    } finally {
      setIsBlocking(false);
    }
  };

  const handleHide = async () => {
    if (isHiding) return;
    setIsHiding(true);
    setMenuOpen(false);

    try {
      const res = await hideUser(user.id);
      if (res.success) {
        toast.success(res.message || "User hidden successfully");
        if (onRemove) onRemove(user.id);
      } else {
        toast.error(res.message || "Failed to hide user");
      }
    } catch (error) {
      toast.error("An error occurred while hiding");
    } finally {
      setIsHiding(false);
    }
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <>
      <article className="overflow-hidden border border-border bg-card">
        <div className="grid grid-cols-[260px_minmax(0,1fr)] sm:grid-cols-[480px_minmax(0,1fr)]">
          {/* Left: Photo */}
          <Link
            href={`/${lang}/my-list/profile/${user.id}`}
            className="relative block overflow-hidden bg-muted min-h-70 lg:min-h-92 2xl:min-h-120 "
          >
            <Image
              src={photo}
              alt={user.displayName}
              fill
              sizes="280px"
              className="object-cover transition-transform hover:scale-105"
              unoptimized
            />
            {photoCount > 1 ? (
              <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[11px] text-white">
                <Camera className="size-3" />
                {photoCount}
              </span>
            ) : null}
          </Link>

          {/* Right: Info */}
          <div className="flex flex-col gap-3 lg:gap-5 p-4 sm:p-5 lg:p-6 h-full">
            {/* Name row + menu */}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 lg:gap-2">
                  <Link
                    href={`/${lang}/my-list/profile/${user.id}`}
                    className="text-sm lg:text-base font-bold tracking-wide hover:text-brand transition-colors"
                  >
                    {user.displayName}
                  </Link>
                  {user.premium ? (
                    <span className="rounded-sm border border-border px-1.5 py-0.5 text-[9px] lg:text-[10px] font-semibold tracking-wider text-foreground">
                      PREMIUM
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
              </div>

              {/* Three-dot menu */}
              <div className="relative shrink-0" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted transition-colors"
                >
                  <MoreHorizontal className="size-4 lg:size-5" />
                </button>
                {menuOpen ? (
                  <div className="absolute right-0 top-8 z-20 min-w-36 rounded border border-border bg-popover shadow-md text-sm lg:text-base">
                    <button
                      type="button"
                      className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left hover:bg-muted transition-colors"
                      onClick={() => {
                        setMenuOpen(false);
                        setReportOpen(true);
                      }}
                    >
                      <Flag className="size-3.5 lg:size-4 text-muted-foreground" />
                      {dict.myList.report}
                    </button>
                    <button
                      type="button"
                      disabled={isBlocking}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left hover:bg-muted transition-colors disabled:opacity-50"
                      onClick={handleBlock}
                    >
                      <Ban className="size-3.5 lg:size-4 text-muted-foreground" />
                      {isBlocking ? "Blocking..." : dict.myList.block}
                    </button>
                    <button
                      type="button"
                      disabled={isHiding}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left hover:bg-muted transition-colors disabled:opacity-50"
                      onClick={handleHide}
                    >
                      <EyeOff className="size-3.5 lg:size-4 text-muted-foreground" />
                      {isHiding ? "Hiding..." : dict.myList.hide}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Basic information */}
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

            {/* Profile headline */}
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

            {/* Action buttons */}
            <div className="mt-auto flex items-center justify-between pt-3 lg:pt-5 w-full">
              <div className="flex items-center gap-6 lg:gap-8">
                <button
                  type="button"
                  aria-label={dict.myList.wink}
                  onClick={handleWinkClick}
                  disabled={isSendingWink || winked}
                  className={cn(
                    "transition-colors disabled:opacity-50",
                    winked
                      ? "text-brand"
                      : "text-muted-foreground hover:text-brand",
                  )}
                >
                  <Smile className="size-5 lg:size-6" />
                </button>
                <button
                  type="button"
                  aria-label={dict.myList.message}
                  onClick={handleChatClick}
                  disabled={isCreatingChat}
                  className="text-muted-foreground hover:text-brand transition-colors disabled:opacity-50"
                >
                  <MessageCircle className="size-5 lg:size-6" />
                </button>
                <button
                  type="button"
                  aria-label={dict.myList.like}
                  onClick={handleLikeClick}
                  disabled={isSwiping}
                  className={cn(
                    "transition-colors disabled:opacity-50",
                    liked
                      ? "text-brand"
                      : "text-muted-foreground hover:text-brand",
                  )}
                >
                  <Heart className="size-5 lg:size-6" />
                </button>
              </div>

              {activeTab === "private-album-requests" &&
                user.privateAlbumRequestId && (
                  <div className="flex items-center gap-2">
                    {responseStatus ? (
                      <span className="text-xs font-semibold text-muted-foreground px-2">
                        {responseStatus === "accepted"
                          ? "Accepted"
                          : "Rejected"}
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleRespond(true)}
                          disabled={isResponding}
                          className="rounded-full bg-brand px-3 py-1 text-[10px] lg:text-xs font-semibold text-white hover:bg-brand/90 disabled:opacity-50"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRespond(false)}
                          disabled={isResponding}
                          className="rounded-full bg-muted px-3 py-1 text-[10px] lg:text-xs font-semibold text-foreground hover:bg-muted/80 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
      </article>

      <SendMessageModal
        user={user}
        open={messageOpen}
        onOpenChange={setMessageOpen}
        dict={dict}
      />

      <ReportContentModal
        open={reportOpen}
        onOpenChange={setReportOpen}
        postId={user.id}
      />
    </>
  );
}
