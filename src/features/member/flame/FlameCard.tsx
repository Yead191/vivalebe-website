"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { User } from "@/lib/types";
import { photoUrl } from "@/lib/image";

interface FlameCardProps {
  lang: Locale;
  dict: Dictionary;
  user: User;
  canUndo: boolean;
  isPremium: boolean;
  onPass: () => void;
  onLike: () => void;
  onUndo: () => void;
}

export function FlameCard({
  lang,
  user,
  canUndo,
  isPremium,
  onPass,
  onLike,
  onUndo,
}: FlameCardProps) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const photos = user.photos.length > 0 ? user.photos : [user.coverSeed];
  const photoCount = photos.length;
  const currentSeed = photos[photoIdx] ?? user.coverSeed;
  const profileHref = `/${lang}/profile/${user.username}`;

  const prevPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIdx((i) => (i - 1 + photoCount) % photoCount);
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIdx((i) => (i + 1) % photoCount);
  };

  return (
    <TooltipProvider>
      <article className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="grid gap-0 md:grid-cols-[minmax(0,520px)_minmax(0,1fr)]">
          <div className="group relative aspect-square w-full bg-muted">
            <Link
              href={profileHref}
              className="block size-full"
              aria-label={`Open ${user.displayName}'s profile`}
            >
              <Image
                src={photoUrl(currentSeed, 720, 720)}
                alt={user.displayName}
                width={600}
                height={620}
                className="object-cover"


              />
            </Link>

            {photoCount > 1 ? (
              <>
                <span className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
                  {photoIdx + 1} / {photoCount}
                </span>
                <button
                  type="button"
                  onClick={prevPhoto}
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 inline-flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md bg-black/40 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={nextPhoto}
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 inline-flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md bg-black/40 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            ) : null}

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3">
              {canUndo ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={onUndo}
                      disabled={!isPremium}
                      aria-label={isPremium ? "Undo last pass" : "Undo (premium required)"}
                      className={cn(
                        "inline-flex size-12 cursor-pointer items-center justify-center rounded-full bg-white shadow-md transition-transform",
                        isPremium
                          ? "text-foreground hover:scale-105"
                          : "cursor-not-allowed text-muted-foreground opacity-60"
                      )}
                    >
                      <RotateCcw className="size-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isPremium ? "Undo last pass" : "Subscribe to use Undo"}
                  </TooltipContent>
                </Tooltip>
              ) : null}

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={onPass}
                    aria-label="Pass"
                    className="inline-flex size-12 cursor-pointer items-center justify-center rounded-full bg-white text-foreground shadow-md transition-transform hover:scale-105"
                  >
                    <X className="size-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Pass</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={onLike}
                    aria-label="Like"
                    className="inline-flex size-12 cursor-pointer items-center justify-center rounded-full bg-white text-brand shadow-md transition-transform hover:scale-105"
                  >
                    <Heart className="size-5 fill-brand" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Like</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="flex flex-col gap-5 p-6">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={profileHref}
                  className="text-lg font-bold tracking-wide hover:text-brand transition-colors"
                >
                  {user.displayName}, {user.age}
                </Link>
                {user.premium ? (
                  <span className="rounded-sm border border-border px-1.5 text-[10px] font-semibold tracking-wider text-foreground">
                    PREMIUM
                  </span>
                ) : null}
                {user.verified ? <VerifiedBadge /> : null}
              </div>
              <p className="text-sm text-muted-foreground">
                {user.city}
                {user.state ? `, ${user.state}` : ""}, {user.country}
              </p>
              {user.willingToFly ? (
                <p className="text-sm font-medium text-brand">Willing to fly to meet</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                More About Me
              </h4>
              <dl className="space-y-1 text-sm">
                <Row label="Relationship status" value={user.relationshipStatus} />
                <Row label="Height" value={user.height} />
                <Row label="Body type" value={user.bodyType} />
                <Row label="Living With" value={user.livingWith} />
              </dl>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Profile Headline
              </h4>
              <p className="text-sm text-foreground">{user.headline}</p>
            </div>
          </div>
        </div>
      </article>
    </TooltipProvider>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-foreground">
      <span className="font-semibold">{label}:</span> {value}
    </div>
  );
}
