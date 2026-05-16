"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PhotoEntry } from "@/lib/types";
import { UploadProfilePhotoModal } from "@/features/member/home/modals/UploadProfilePhotoModal";

type Tab = PhotoEntry["visibility"];

interface PhotosBlockProps {
  photos: PhotoEntry[];
  onAdd: (additions: PhotoEntry[]) => void;
  onRemove: (id: string) => void;
}

const TABS: { key: Tab; label: string }[] = [
  { key: "public", label: "Public" },
  { key: "private", label: "Private" },
  { key: "custom", label: "Custom" },
];

export function PhotosBlock({ photos, onAdd, onRemove }: PhotosBlockProps) {
  const [activeTab, setActiveTab] = useState<Tab>("public");

  const counts = useMemo(() => {
    return TABS.reduce<Record<Tab, number>>(
      (acc, t) => {
        acc[t.key] = photos.filter((p) => p.visibility === t.key).length;
        return acc;
      },
      { public: 0, private: 0, custom: 0 }
    );
  }, [photos]);

  const visible = photos.filter((p) => p.visibility === activeTab);

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="text-sm font-bold">Photos:</span>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            className={cn(
              "text-sm transition-colors cursor-pointer",
              activeTab === t.key
                ? "font-semibold text-foreground underline underline-offset-4"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Stay in the spotlight — update your photos regularly to show your best,
        most current self!
      </p>

      <div className="grid grid-cols-3 gap-3">
        {visible.map((photo) => (
          <div
            key={photo.id}
            className="group relative aspect-square overflow-hidden bg-muted"
          >
            <Image
              src={photo.url}
              alt="Profile photo"
              fill
              className="object-cover"
              unoptimized
            />
            {photo.status === "pending" ? (
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
                pending
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => onRemove(photo.id)}
              aria-label="Remove photo"
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}

        <UploadProfilePhotoModal
          defaultVisibility={activeTab}
          onAdd={onAdd}
          trigger={
            <button
              type="button"
              className="flex aspect-square items-center justify-center border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground cursor-pointer"
              aria-label="Add photo"
            >
              <Plus className="size-8" />
            </button>
          }
        />
      </div>
    </section>
  );
}
