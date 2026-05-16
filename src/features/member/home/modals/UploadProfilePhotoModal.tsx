"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { PhotoEntry } from "@/lib/types";

interface UploadProfilePhotoModalProps {
  trigger: React.ReactNode;
  defaultVisibility?: PhotoEntry["visibility"];
  onAdd: (photos: PhotoEntry[]) => void;
}

const VISIBILITY_OPTIONS: { label: string; value: PhotoEntry["visibility"] }[] = [
  { label: "Public", value: "public" },
  { label: "Private", value: "private" },
  { label: "Custom", value: "custom" },
];

export function UploadProfilePhotoModal({
  trigger,
  defaultVisibility = "public",
  onAdd,
}: UploadProfilePhotoModalProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<PhotoEntry["visibility"]>(defaultVisibility);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  useEffect(() => {
    if (!open) {
      setFiles([]);
      setVisibility(defaultVisibility);
    }
  }, [open, defaultVisibility]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const incoming = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...incoming].slice(0, 6));
    e.target.value = "";
  };

  const removeAt = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (files.length === 0) return;
    const additions: PhotoEntry[] = previews.map((url, i) => ({
      id: `p_${Date.now()}_${i}`,
      url,
      visibility,
      status: "pending",
    }));
    onAdd(additions);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-none border-none bg-white p-0 sm:max-w-2xl">
        <div className="space-y-8 p-8">
          <DialogTitle className="text-center text-2xl font-bold tracking-tight text-gray-900">
            Add Profile Photos
          </DialogTitle>

          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-900">Visibility</p>
            <div className="flex gap-2">
              {VISIBILITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setVisibility(opt.value)}
                  className={cn(
                    "border px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors",
                    visibility === opt.value
                      ? "border-brand bg-brand text-white"
                      : "border-gray-200 text-gray-600 hover:border-gray-400"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-900">
              Add photos ({files.length}/6)*
            </p>
            <div className="grid grid-cols-3 gap-4">
              {previews.map((src, i) => (
                <div
                  key={src}
                  className="group relative aspect-square overflow-hidden bg-gray-100"
                >
                  <Image
                    src={src}
                    alt={`Selected photo ${i + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove photo"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}

              {files.length < 6 ? (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex aspect-square items-center justify-center border-2 border-dashed border-gray-300 transition-colors hover:border-black"
                >
                  <Plus className="size-10 text-gray-400" />
                </button>
              ) : null}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <button
            type="button"
            disabled={files.length === 0}
            onClick={handleSubmit}
            className="w-40 bg-brand py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            UPLOAD
          </button>

          <div className="space-y-2 border-t border-gray-100 pt-4">
            <p className="text-sm font-bold text-gray-900">Note:</p>
            <p className="text-xs leading-relaxed text-gray-600">
              Newly uploaded photos are submitted for moderation and will appear
              with a <span className="font-semibold">pending</span> badge until
              approved. Photos that are lewd, offensive, nude, or violate our
              policies are prohibited.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
