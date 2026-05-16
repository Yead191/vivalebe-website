"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Comment, MomentPost, User } from "@/lib/types";
import { photoUrl } from "@/lib/image";
import { PostHeader } from "./PostHeader";
import { PostActions } from "./PostActions";
import { ReportContentModal } from "../modals/ReportContentModal";

interface MomentCardProps {
  lang: Locale;
  dict: Dictionary;
  moment: MomentPost;
  author: User;
  likeCount: number;
  liked: boolean;
  comments: Comment[];
  authors: Record<string, { displayName: string; avatarSeed: string }>;
  currentUserAvatarSeed: string;
}

export function MomentCard({
  lang,
  dict,
  moment,
  author,
  likeCount,
  liked,
  comments,
  authors,
  currentUserAvatarSeed,
}: MomentCardProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const count = moment.imageSeeds.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Controls for Full-Screen View
  useEffect(() => {
    if (!selectedImage) {
      setZoomLevel(1);
      return;
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleEsc);

    // Body scroll lock
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  const toggleZoom = () => setZoomLevel(prev => (prev === 1 ? 2.5 : 1));

  return (
    <>
      <article className="overflow-hidden rounded-xl border border-border bg-card">
        <PostHeader user={author} lang={lang} showAgeGender />
        {moment.text ? (
          <p className="px-4 pt-2 text-sm text-foreground">{moment.text}</p>
        ) : null}
        {count > 0 ? (
          <div
            className={cn(
              "mt-3 gap-1 px-4 pb-3",
              count === 1 ? "flex" : "grid grid-cols-2"
            )}
          >
            {moment.imageSeeds.map((seed, i) => (
              <div
                key={seed + i}
                className="overflow-hidden rounded-md bg-muted aspect-square cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setSelectedImage(seed)}
              >
                <Image
                  src={photoUrl(seed, 600, 600)}
                  alt={moment.text ?? moment.id}
                  width={600}
                  height={600}
                  className="size-full object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        ) : null}
        <PostActions
          kind="moment"
          postId={moment.id}
          initialLikeCount={likeCount}
          initialLiked={liked}
          initialComments={comments}
          authors={authors}
          currentUserAvatarSeed={currentUserAvatarSeed}
          commentPlaceholder={dict.myHome.composerPlaceholder}
        />
      </article>

      {/* High-Performance Portal-based Photo Viewer */}
      {selectedImage && mounted && createPortal(
        <div className="fixed inset-0 z-40 flex flex-col bg-black animate-in fade-in duration-200">
          {/* Top Controls Overlay */}
          <div className="absolute right-6 top-6 z-50 flex items-center gap-6 text-white/90">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="text-sm font-medium hover:text-white transition-colors"
            >
              Report
            </button>
            <button
              onClick={toggleZoom}
              className="hover:text-white transition-colors"
            >
              {zoomLevel > 1 ? <ZoomOut className="size-5" /> : <ZoomIn className="size-5" />}
            </button>
            <button
              onClick={() => setSelectedImage(null)}
              className="hover:text-white transition-colors"
            >
              <X className="size-6" />
            </button>
          </div>

          {/* Main Photo Area - Optimized for Instant Rendering & Zoom */}
          <div className={cn(
            "relative flex h-full w-full items-center justify-center overflow-auto p-0 transition-all duration-300",
            zoomLevel > 1 ? "cursor-zoom-out" : "cursor-zoom-in"
          )}>
            <div
              className="relative transition-all duration-300 ease-out"
              style={{
                width: zoomLevel > 1 ? '250%' : '100%',
                height: zoomLevel > 1 ? '250%' : '100%',
                minHeight: '100vh',
                minWidth: '100vw'
              }}
              onClick={(e) => {
                // Only toggle if clicking the image area, not background
                if (e.target === e.currentTarget) toggleZoom();
              }}
            >
              {/* Low-res background for instant visual feedback */}
              <Image
                src={photoUrl(selectedImage, 600, 600)}
                alt=""
                fill
                className="object-contain blur-md opacity-50"
                unoptimized
              />
              {/* High-res actual photo */}
              <Image
                src={photoUrl(selectedImage, 1600, 1600)}
                alt="Moment photo full screen"
                fill
                className="object-contain"
                unoptimized
                priority
                onClick={toggleZoom}
              />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Content Reporting Modal */}
      <ReportContentModal
        open={isReportModalOpen}
        onOpenChange={setIsReportModalOpen}
      />
    </>
  );
}
