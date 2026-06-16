"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Play, Plus, X, ZoomIn, ZoomOut } from "lucide-react";
import { toast } from "sonner";
import { avatarUrl } from "@/lib/image";
import { cn } from "@/lib/utils";
import type { SuccessStory, SuccessStoryMedia } from "./types";

export const brandButtonClass =
  "bg-[#429CA8] text-white hover:bg-[#388994] shadow-[0_16px_35px_rgba(66,156,168,0.24)]";

export const brandSoftClass =
  "border-[#429CA8]/20 bg-[#429CA8]/8 text-[#2b7e87]";

export const mockCommentAuthors: Record<
  string,
  { name: string; image: string; username: string }
> = {
  u_lucas: {
    name: "Lucas",
    username: "lucas",
    image: avatarUrl("u_lucas", 96),
  },
  u_maya: {
    name: "Maya",
    username: "maya",
    image: avatarUrl("u_maya", 96),
  },
  u_aurora: {
    name: "Aurora",
    username: "aurora",
    image: avatarUrl("u_aurora", 96),
  },
  u_camila: {
    name: "Camila",
    username: "camila",
    image: avatarUrl("u_camila", 96),
  },
  u_sofia: {
    name: "Sofia",
    username: "sofia",
    image: avatarUrl("u_sofia", 96),
  },
  u_beatriz: {
    name: "Beatriz",
    username: "beatriz",
    image: avatarUrl("u_beatriz", 96),
  },
  u_helena: {
    name: "Helena",
    username: "helena",
    image: avatarUrl("u_helena", 96),
  },
  u_olivia: {
    name: "Olivia",
    username: "olivia",
    image: avatarUrl("u_olivia", 96),
  },
  u_pedro: {
    name: "Pedro",
    username: "pedro",
    image: avatarUrl("u_pedro", 96),
  },
  u_rafa: {
    name: "Rafa",
    username: "rafa",
    image: avatarUrl("u_rafa", 96),
  },
  u_larissa: {
    name: "Larissa",
    username: "larissa",
    image: avatarUrl("u_larissa", 96),
  },
  u_tomas: {
    name: "Tomás",
    username: "tomas",
    image: avatarUrl("u_tomas", 96),
  },
};

export function countMedia(story: SuccessStory) {
  return story.media.filter((item) => item.type === "image" || item.type === "video").length;
}

export function getMediaPreviewLabel(media: SuccessStoryMedia) {
  return media.type === "video" ? "Video" : "Photo";
}

export function StoryMediaStrip({
  media,
  storyHref,
  isDetails = false
}: {
  media: SuccessStory["media"];
  storyHref?: string;
  isDetails?: boolean
}) {
  const [selectedMedia, setSelectedMedia] = useState<SuccessStoryMedia | null>(null);
  const [mounted, setMounted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!selectedMedia) {
      setZoomLevel(1);
      return;
    }

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedMedia(null);
    };

    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [selectedMedia]);

  const toggleZoom = () => setZoomLevel((current) => (current === 1 ? 2.5 : 1));
  const visibleMedia = isDetails ? media : media.slice(0, 5);
  const hiddenCount = Math.max(media.length - visibleMedia.length, 0);

  // if (!media.length && isDetails) {
  //   return (
  //     <div className="flex min-h-44 items-center justify-center rounded-[1.75rem] border border-dashed border-[#429CA8]/20 bg-[#429CA8]/6 text-sm text-muted-foreground">
  //       No media attached
  //     </div>
  //   );
  // }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {visibleMedia?.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "group relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-slate-950 text-left ",
            item.type === "image" || item.type === "video" ? "cursor-zoom-in" : "cursor-default",
            index === 0 ? "sm:col-span-2 sm:row-span-2 min-h-72" : "min-h-36"
          )}
        >
          {item.type === "video" ? (
            <>
              <video
                src={item.url}
                controls
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              />
              <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                <Play className="size-3.5" />
                Video
              </div>
            </>
          ) : (
            <>
              <Image
                src={item.url}
                alt={item.alt}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                <Plus className="size-3.5" />
                Photo
              </div>
            </>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          {item.type === "image" || item.type === "video" ? (
            <button
              type="button"
              onClick={() => setSelectedMedia(item)}
              className="absolute inset-0"
              aria-label={`Open ${item.type} fullscreen`}
            />
          ) : null}
        </div>
      ))}
      {hiddenCount > 0 ? (
        <Link href={storyHref ?? ""} className="flex min-h-36 items-center justify-center rounded-[1.5rem] border border-[#429CA8]/18 bg-linear-to-br from-[#429CA8]/12 to-slate-50 text-center">
          <div>
            <p className="text-2xl font-semibold text-slate-900">+{hiddenCount}</p>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">More media</p>
          </div>
        </Link>
      ) : null}

      {selectedMedia && mounted
        ? createPortal(
          <div className="fixed inset-0 z-40 flex flex-col bg-black animate-in fade-in duration-200">
            <div className="absolute right-6 top-6 z-50 flex items-center gap-6 text-white/90">
              <button
                type="button"
                onClick={() => toast.message("Report sent", { description: "Thanks for helping keep the community safe." })}
                className="text-sm font-medium hover:text-white transition-colors"
              >
                Report
              </button>
              <button
                type="button"
                onClick={toggleZoom}
                className="hover:text-white transition-colors"
              >
                {zoomLevel > 1 ? <ZoomOut className="size-5" /> : <ZoomIn className="size-5" />}
              </button>
              <button
                type="button"
                onClick={() => setSelectedMedia(null)}
                className="hover:text-white transition-colors"
              >
                <X className="size-6" />
              </button>
            </div>

            <div
              className={cn(
                "relative flex h-full w-full items-center justify-center overflow-auto transition-all duration-300",
                zoomLevel > 1 ? "cursor-zoom-out" : "cursor-zoom-in"
              )}
            >
              <div
                className="relative transition-all duration-300 ease-out"
                style={{
                  width: zoomLevel > 1 ? "250%" : "100%",
                  height: zoomLevel > 1 ? "250%" : "100%",
                  minHeight: "100vh",
                  minWidth: "100vw",
                }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) toggleZoom();
                }}
              >
                {selectedMedia.type === "image" ? (
                  <>
                    <Image
                      src={selectedMedia.url}
                      alt=""
                      fill
                      className="object-contain blur-md opacity-50"
                      unoptimized
                    />
                    <Image
                      src={selectedMedia.url}
                      alt={selectedMedia.alt}
                      fill
                      className="object-contain"
                      unoptimized
                      priority
                      onClick={toggleZoom}
                    />
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center p-6">
                    <video
                      src={selectedMedia.url}
                      controls
                      autoPlay
                      playsInline
                      preload="auto"
                      className="max-h-full max-w-full rounded-2xl bg-black object-contain shadow-2xl"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )
        : null}
    </div>
  );
}

export function StoryReactions({
  likes,
  comments,
}: {
  likes: number;
  comments: number;
}) {
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
        <Heart className="size-3.5" />
        {likes}
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
        <MessageCircle className="size-3.5" />
        {comments}
      </span>
    </div>
  );
}
