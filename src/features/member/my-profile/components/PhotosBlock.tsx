"use client";

import { useMemo, useState } from "react";
import { ImagePlus, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PhotoEntry } from "@/lib/types";
import { hasRealImageSrc } from "@/lib/image";
import { ProfileImage } from "@/components/shared/ProfileImage";
import { UploadProfilePhotoModal } from "@/features/member/home/modals/UploadProfilePhotoModal";

type Tab = PhotoEntry["visibility"];

interface PhotosBlockProps {
  photos: PhotoEntry[];
  defaultTab?: Tab;
  onAdd: (additions: PhotoEntry[], files: File[]) => void;
  onRemove: (id: string) => void;
}

const TABS: { key: Tab; label: string }[] = [
  { key: "public", label: "Public" },
  { key: "private", label: "Private" },
  { key: "custom", label: "Custom" },
];

export function PhotosBlock({
  photos,
  defaultTab = "private",
  onAdd,
  onRemove,
}: PhotosBlockProps) {
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);

  const counts = useMemo(() => {
    const real = photos.filter((p) => hasRealImageSrc(p.url));
    return TABS.reduce<Record<Tab, number>>(
      (acc, t) => {
        acc[t.key] = real.filter((p) => p.visibility === t.key).length;
        return acc;
      },
      { public: 0, private: 0, custom: 0 },
    );
  }, [photos]);

  const visible = photos.filter(
    (p) => p.visibility === activeTab && hasRealImageSrc(p.url),
  );

  return (
    <section className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-bold tracking-tight">Photos</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add photos now — they save with the rest of your profile.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 rounded-full bg-muted/70 p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
                activeTab === t.key
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label} ({counts[t.key]})
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {visible.map((photo) => (
          <div
            key={photo.id}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-muted"
          >
            <ProfileImage
              seed={photo.url}
              alt="Profile photo"
              width={400}
              className="size-full object-cover"
              iconClassName="size-10"
            />
            {photo.status === "pending" ? (
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-medium text-white">
                pending
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => onRemove(photo.id)}
              aria-label="Remove photo"
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}

        <UploadProfilePhotoModal
          defaultVisibility={activeTab}
          onAdd={(additions, files) => {
            onAdd(additions, files);
          }}
          trigger={
            <button
              type="button"
              className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-[#429CA8] hover:bg-[#429CA8]/5 hover:text-[#429CA8] cursor-pointer"
              aria-label="Add photo"
            >
              {visible.length === 0 ? (
                <ImagePlus className="size-8" />
              ) : (
                <Plus className="size-8" />
              )}
              <span className="text-xs font-semibold">Add photo</span>
            </button>
          }
        />
      </div>
    </section>
  );
}
