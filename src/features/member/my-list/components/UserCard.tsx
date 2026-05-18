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
}

export function UserCard({ lang, dict, user }: UserCardProps) {
  const [liked, setLiked] = useState(false);
  const [winked, setWinked] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const photo = user.photos[0] ?? avatarUrl(user.avatarSeed, 520);
  const photoCount = user.photos.length;

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
        <div className="grid grid-cols-[260px_minmax(0,1fr)] sm:grid-cols-[280px_minmax(0,1fr)]">
          {/* Left: Photo */}
          <Link
            href={`/${lang}/profile/${user.username}`}
            className="relative block overflow-hidden bg-muted"
            style={{ minHeight: 280 }}
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
          <div className="flex flex-col gap-3 p-4 sm:p-5">
            {/* Name row + menu */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Link
                    href={`/${lang}/profile/${user.username}`}
                    className="text-sm font-bold tracking-wide hover:text-brand transition-colors"
                  >
                    {user.displayName}
                  </Link>
                  {user.premium ? (
                    <span className="rounded-sm border border-border px-1.5 text-[9px] font-semibold tracking-wider text-foreground">
                      PREMIUM
                    </span>
                  ) : null}
                  {user.verified ? <VerifiedBadge /> : null}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {user.age}, {user.city}
                  {user.state ? `, ${user.state}` : ""},{" "}
                  {user.country}
                </p>
              </div>

              {/* Three-dot menu */}
              <div className="relative shrink-0" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted transition-colors"
                >
                  <MoreHorizontal className="size-4" />
                </button>
                {menuOpen ? (
                  <div className="absolute right-0 top-7 z-20 min-w-[130px] rounded border border-border bg-popover shadow-md text-sm">
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-muted transition-colors"
                      onClick={() => {
                        setMenuOpen(false);
                        setReportOpen(true);
                      }}
                    >
                      <Flag className="size-3.5 text-muted-foreground" />
                      {dict.myList.report}
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-muted transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Ban className="size-3.5 text-muted-foreground" />
                      {dict.myList.block}
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-muted transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <EyeOff className="size-3.5 text-muted-foreground" />
                      {dict.myList.hide}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Basic information */}
            <div className="space-y-1">
              <h4 className="text-[10px] font-bold tracking-widest text-foreground uppercase">
                {dict.discover.basicInformation}
              </h4>
              <div className="space-y-0.5">
                {user.ethnicity ? (
                  <p className="text-xs text-brand">
                    {dict.discover.ethnicity}: {user.ethnicity}
                  </p>
                ) : null}
                {user.height ? (
                  <p className="text-xs text-brand">
                    {dict.discover.height}: {user.height}
                  </p>
                ) : null}
                {user.bodyType ? (
                  <p className="text-xs text-brand">
                    {dict.discover.bodyType}: {user.bodyType}
                  </p>
                ) : null}
                {user.livingWith ? (
                  <p className="text-xs text-brand">
                    {dict.discover.livingWith}: {user.livingWith}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Profile headline */}
            {user.headline ? (
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold tracking-widest text-foreground uppercase">
                  {dict.discover.profileHeadline}
                </h4>
                <p className="text-xs text-brand leading-relaxed line-clamp-2">
                  {user.headline}
                </p>
              </div>
            ) : null}

            {/* Action buttons */}
            <div className="mt-auto flex items-center gap-5 pt-2">
              <button
                type="button"
                aria-label={dict.myList.wink}
                onClick={() => setWinked((w) => !w)}
                className={cn(
                  "transition-colors",
                  winked ? "text-brand" : "text-muted-foreground hover:text-brand"
                )}
              >
                <Smile className="size-5" />
              </button>
              <button
                type="button"
                aria-label={dict.myList.message}
                onClick={() => setMessageOpen(true)}
                className="text-muted-foreground hover:text-brand transition-colors"
              >
                <MessageCircle className="size-5" />
              </button>
              <button
                type="button"
                aria-label={dict.myList.like}
                onClick={() => setLiked((l) => !l)}
                className={cn(
                  "transition-colors",
                  liked ? "text-brand" : "text-muted-foreground hover:text-brand"
                )}
              >
                <Heart
                  className={cn("size-5", liked ? "fill-brand" : "")}
                />
              </button>
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

      <ReportContentModal open={reportOpen} onOpenChange={setReportOpen} />
    </>
  );
}
