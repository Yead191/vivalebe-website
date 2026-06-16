"use client";

import Image from "next/image";
import { Heart, MessageCircle, Play, Plus } from "lucide-react";
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
}: {
  media: SuccessStory["media"];
}) {
  const visibleMedia = media.slice(0, 3);
  const hiddenCount = Math.max(media.length - visibleMedia.length, 0);

  if (!media.length) {
    return (
      <div className="flex min-h-44 items-center justify-center rounded-[1.75rem] border border-dashed border-[#429CA8]/20 bg-[#429CA8]/6 text-sm text-muted-foreground">
        No media attached
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {visibleMedia.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "group relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-slate-950",
            index === 0 ? "sm:col-span-2 sm:row-span-2 min-h-72" : "min-h-36"
          )}
        >
          {item.type === "video" ? (
            <>
              <video
                src={item.url}
                controls
                className="h-full w-full object-cover"
                poster=""
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
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        </div>
      ))}
      {hiddenCount > 0 ? (
        <div className="flex min-h-36 items-center justify-center rounded-[1.5rem] border border-[#429CA8]/18 bg-gradient-to-br from-[#429CA8]/12 to-slate-50 text-center">
          <div>
            <p className="text-2xl font-semibold text-slate-900">+{hiddenCount}</p>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">More media</p>
          </div>
        </div>
      ) : null}
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
