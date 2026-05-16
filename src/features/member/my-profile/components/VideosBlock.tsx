"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Play, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VideoEntry } from "@/lib/types";

type Tab = VideoEntry["visibility"];

interface VideosBlockProps {
  videos: VideoEntry[];
  onAdd: (video: VideoEntry) => void;
  onRemove: (id: string) => void;
}

const TABS: { key: Tab; label: string }[] = [
  { key: "public", label: "Public" },
  { key: "private", label: "Private" },
];

function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function VideosBlock({ videos, onAdd, onRemove }: VideosBlockProps) {
  const [activeTab, setActiveTab] = useState<Tab>("public");

  const counts = useMemo(() => {
    return TABS.reduce<Record<Tab, number>>(
      (acc, t) => {
        acc[t.key] = videos.filter((v) => v.visibility === t.key).length;
        return acc;
      },
      { public: 0, private: 0 }
    );
  }, [videos]);

  const visible = videos.filter((v) => v.visibility === activeTab);

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="text-sm font-bold">Videos:</span>
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

      <div className="grid grid-cols-3 gap-3">
        {visible.map((video) => (
          <div
            key={video.id}
            className="group relative aspect-square overflow-hidden bg-muted"
          >
            <Image
              src={video.thumbnail}
              alt="Video thumbnail"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow">
                <Play className="size-5 fill-current" />
              </span>
            </div>
            <span className="absolute bottom-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-xs font-medium text-white">
              {formatDuration(video.durationSeconds)}
            </span>
            <button
              type="button"
              onClick={() => onRemove(video.id)}
              aria-label="Remove video"
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}

        <AddVideoTile defaultVisibility={activeTab} onAdd={onAdd} />
      </div>
    </section>
  );
}

interface AddVideoTileProps {
  defaultVisibility: Tab;
  onAdd: (video: VideoEntry) => void;
}

function AddVideoTile({ defaultVisibility, onAdd }: AddVideoTileProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [visibility, setVisibility] = useState<Tab>(defaultVisibility);
  const [duration, setDuration] = useState<number>(0);
  const [thumb, setThumb] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!file) {
      setThumb(null);
      setDuration(0);
      return;
    }
    const url = URL.createObjectURL(file);
    setThumb(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!open) {
      setFile(null);
      setVisibility(defaultVisibility);
    }
  }, [open, defaultVisibility]);

  const handleLoaded = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSubmit = () => {
    if (!file || !thumb) return;
    onAdd({
      id: `v_${Date.now()}`,
      url: thumb,
      thumbnail: thumb,
      durationSeconds: duration,
      visibility,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex aspect-square items-center justify-center border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground cursor-pointer"
          aria-label="Add video"
        >
          <Plus className="size-8" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogTitle className="text-center text-base font-semibold">
          Add a video
        </DialogTitle>

        <div className="space-y-3">
          <p className="text-sm font-medium">Visibility</p>
          <div className="flex gap-2">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setVisibility(t.key)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                  visibility === t.key
                    ? "border-brand bg-brand text-white"
                    : "border-input bg-background text-foreground hover:bg-muted"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex aspect-square w-40 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand">
          {file ? (
            <span className="px-3 text-center text-xs">{file.name}</span>
          ) : (
            <span className="text-2xl">+</span>
          )}
          <input
            type="file"
            accept="video/*"
            className="sr-only"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        {thumb ? (
          <video
            ref={videoRef}
            src={thumb}
            onLoadedMetadata={handleLoaded}
            className="hidden"
            muted
          />
        ) : null}

        <button
          type="button"
          disabled={!file}
          onClick={handleSubmit}
          className="self-start rounded-md bg-brand px-6 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
        >
          Post
        </button>
      </DialogContent>
    </Dialog>
  );
}
