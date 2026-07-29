"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";
import { createPostAction, updatePostAction } from "../action";

interface UploadVideoModalProps {
  dict: Dictionary;
  trigger?: React.ReactNode;
  mode?: "create" | "edit";
  postId?: string;
  initialDescription?: string;
}

const HASHTAGS = [
  "Pet",
  "Music",
  "Fitness",
  "Travel",
  "Food",
  "Happy",
  "Friends",
  "Selfie",
  "Fashion",
  "Love",
  "Question",
  "Event",
  "Study",
  "Stdtest",
  "Mentalhealth",
  "Story",
  "Relationship",
  "Endherpes",
  "Support",
  "Health",
  "Lifestlye",
  "Herpesdating",
  "Herpescure",
  "Herpesawareness",
  "Hsv",
];

export function UploadVideoModal({
  dict,
  trigger,
  mode = "create",
  postId,
  initialDescription = "",
}: UploadVideoModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState(initialDescription);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const canPost =
    (mode === "edit"
      ? description.trim().length > 0 || !!file
      : !!file) && !isPending;

  const reset = () => {
    setFile(null);
    setDescription(mode === "edit" ? initialDescription : "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleHashtag = (tag: string) => {
    const hashtag = `#${tag}`;
    if (description.includes(hashtag)) {
      setDescription((prev) =>
        prev.replace(new RegExp(`${hashtag}\\s?`, "g"), "").trim(),
      );
    } else {
      setDescription((prev) =>
        `${prev}${prev ? " " : ""}${hashtag}`.trim(),
      );
    }
  };

  const handleSubmit = () => {
    if (!canPost) return;
    if (mode !== "edit" && !file) {
      toast.error("Please select a video");
      return;
    }

    const formData = new FormData();
    formData.append("description", description.trim());
    formData.append("type", "VIDEO");
    if (file) formData.append("content", file);

    startTransition(async () => {
      const res =
        mode === "edit" && postId
          ? await updatePostAction(postId, formData)
          : await createPostAction(formData);

      if (!res.success) {
        toast.error(res.message ?? res.error ?? "Failed to save video");
        return;
      }

      toast.success(
        res.message ??
          (mode === "edit"
            ? "Video updated successfully"
            : "Video posted successfully"),
      );
      setOpen(false);
      reset();
      router.refresh();
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setDescription(initialDescription);
          setFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        } else {
          reset();
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-left text-sm text-muted-foreground hover:border-brand hover:text-foreground transition-colors"
          >
            <Pencil className="size-4 shrink-0" />
            <span>{dict.myHome.composerPlaceholder}</span>
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide p-0 bg-white border-none rounded-none">
        <div className="relative p-8 space-y-8">
          <DialogTitle className="text-center text-2xl font-bold tracking-tight text-gray-900">
            {mode === "edit" ? "Edit Video" : dict.myHome.modalAddVideo}
          </DialogTitle>

          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-900">
              {dict.myHome.modalUploadVideo}
            </label>
            <p className="text-xs text-gray-500">
              {dict.myHome.modalUploadVideoNote}
            </p>

            {preview ? (
              <div className="group relative aspect-square w-60 overflow-hidden bg-gray-100">
                <video
                  src={preview}
                  className="size-full object-contain"
                  controls
                />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-square w-40 items-center justify-center border-2 border-dashed border-gray-300 hover:border-black transition-colors"
              >
                <Plus className="size-10 text-gray-400" />
              </button>
            )}

            <input
              type="file"
              ref={fileInputRef}
              accept="video/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">
              {dict.myHome.modalDescription}
            </label>
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 2000))}
                rows={6}
                placeholder={dict.myHome.modalDescriptionVideo}
                className="w-full border border-gray-200 p-4 text-sm focus:outline-none focus:border-gray-400 resize-none"
              />
              <div className="absolute bottom-4 right-4 text-[10px] font-medium text-gray-400">
                {description.length.toLocaleString("en-US")}/2,000
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {HASHTAGS.map((tag) => {
              const isActive = description.includes(`#${tag}`);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleHashtag(tag)}
                  className={cn(
                    "px-3 py-1.5 border text-xs font-medium transition-colors",
                    isActive
                      ? "border-brand bg-brand text-white"
                      : "border-gray-200 text-gray-600 hover:border-gray-400",
                  )}
                >
                  #{tag}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={!canPost}
            onClick={handleSubmit}
            className="w-full py-3 bg-brand text-white text-xs font-bold tracking-[0.2em] uppercase transition-colors hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending
              ? mode === "edit"
                ? "Saving..."
                : "Posting..."
              : mode === "edit"
                ? "SAVE"
                : dict.myHome.modalPost}
          </button>

          <div className="space-y-2 pt-4">
            <p className="text-sm font-bold text-gray-900">
              {dict.myHome.modalNotes}
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Photos that are lewd, offensive, nude, racist, or featuring
              children are prohibited, as are any other photos or videos that
              are prohibited by law, protected by a copyright, or that violate
              our{" "}
              <a href="#" className="text-blue-600 underline">
                Service Agreement
              </a>
              .
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
