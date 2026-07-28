"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Video } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Dictionary } from "@/i18n/dictionaries";
import { createPostAction, updatePostAction } from "../action";

interface UploadVideoModalProps {
  dict: Dictionary;
  trigger?: React.ReactNode;
  mode?: "create" | "edit";
  postId?: string;
  initialDescription?: string;
}

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
  const [description, setDescription] = useState(initialDescription);
  const [isPending, startTransition] = useTransition();

  const canPost =
    (mode === "edit" ? description.trim().length > 0 || !!file : !!file) &&
    !isPending;

  const notes = [
    dict.myHome.modalNote1,
    dict.myHome.modalNote2,
    dict.myHome.modalNote3,
    dict.myHome.modalNote4,
  ];

  const reset = () => {
    setFile(null);
    setDescription(mode === "edit" ? initialDescription : "");
  };

  const handleSubmit = () => {
    if (!canPost) return;

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
        if (next) setDescription(initialDescription);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <button
            type="button"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-brand transition-colors"
          >
            <Video className="size-4" />
            {dict.myHome.feedUploadVideo}
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogTitle className="text-center text-base font-semibold">
          {mode === "edit" ? "Edit Video" : dict.myHome.modalAddVideo}
        </DialogTitle>
        <div className="space-y-1">
          <p className="text-sm font-medium">{dict.myHome.modalUploadVideo}</p>
          <p className="text-xs text-muted-foreground">
            {dict.myHome.modalUploadVideoNote}
          </p>
        </div>
        <label className="flex aspect-square w-40 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-border text-muted-foreground hover:border-brand hover:text-brand transition-colors">
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
        <div className="space-y-1">
          <label className="text-sm font-medium">
            {dict.myHome.modalDescription}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={dict.myHome.modalDescriptionVideo}
            rows={4}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
        <button
          type="button"
          disabled={!canPost}
          onClick={handleSubmit}
          className="self-start rounded-md bg-brand px-6 py-2 text-xs font-semibold uppercase tracking-wider text-brand-foreground transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
        >
          {isPending
            ? mode === "edit"
              ? "Saving..."
              : "Posting..."
            : mode === "edit"
              ? "SAVE"
              : dict.myHome.modalPost}
        </button>
        <div className="space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">
            {dict.myHome.modalNotes}
          </p>
          <ol className="list-decimal space-y-1 pl-5">
            {notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  );
}
