"use client";

import { useState } from "react";
import { ImageWithFallback as Image } from "@/components/shared/ImageWithFallback";
import Link from "next/link";
import { MoreHorizontal, Flag } from "lucide-react";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Locale } from "@/i18n/config";
import type { User } from "@/lib/types";
import { avatarUrl } from "@/lib/image";
import { ReportContentModal } from "../modals/ReportContentModal";

interface PostHeaderProps {
  postId: string;
  user: User;
  lang: Locale;
  showAgeGender?: boolean;
}

export function PostHeader({
  postId,
  user,
  lang,
  showAgeGender = false,
}: PostHeaderProps) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const location = [user.city, user.state, user.country]
    .filter(Boolean)
    .join(", ");
  const meta =
    showAgeGender && user.age > 0
      ? `${user.age}, ${user.gender}${location ? `, ${location}` : ""}`
      : location;

  return (
    <>
      <div className="flex items-start gap-3 px-4 pt-4">
        <Link href={`/${lang}/my-list/profile/${user.id}`} className="shrink-0">
          <Image
            src={avatarUrl(user.avatarSeed, 80)}
            alt={user.displayName}
            width={36}
            height={36}
            className="size-9 rounded-full object-cover ring-1 ring-border"
            unoptimized
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href={`/${lang}/my-list/profile/${user.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold tracking-wide hover:text-brand transition-colors"
          >
            {user.displayName}
            {user.verified ? <VerifiedBadge /> : null}
          </Link>
          {meta ? <p className="text-xs text-muted-foreground">{meta}</p> : null}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="More"
              className="rounded-full p-1.5 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <MoreHorizontal className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
              onClick={() => setIsReportModalOpen(true)}
            >
              <Flag className="mr-2 size-4" />
              Report Post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ReportContentModal
        open={isReportModalOpen}
        onOpenChange={setIsReportModalOpen}
        postId={postId}
      />
    </>
  );
}
