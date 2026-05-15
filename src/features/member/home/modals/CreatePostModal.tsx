"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Dictionary } from "@/i18n/dictionaries";

interface CreatePostModalProps {
  dict: Dictionary;
  trigger?: React.ReactNode;
}

export function CreatePostModal({ dict, trigger }: CreatePostModalProps) {
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const canPost = text.trim().length > 0 || !!photo;

  return (
    <Dialog>
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
      <DialogContent className="sm:max-w-xl">
        <DialogTitle className="text-center text-base font-semibold">
          {dict.myHome.modalAddPost}
        </DialogTitle>
        <div className="space-y-1">
          <label className="text-sm font-medium">{dict.myHome.modalDescription}</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={dict.myHome.modalDescriptionPost}
            rows={5}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">{dict.myHome.modalAddPhoto}</label>
          <label className="flex aspect-square w-40 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-border text-muted-foreground hover:border-brand hover:text-brand transition-colors">
            {photo ? (
              <span className="px-3 text-center text-xs">{photo.name}</span>
            ) : (
              <span className="text-2xl">+</span>
            )}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
        <DialogClose asChild>
          <button
            type="button"
            disabled={!canPost}
            className="self-start rounded-md bg-brand px-6 py-2 text-xs font-semibold uppercase tracking-wider text-brand-foreground transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
          >
            {dict.myHome.modalPost}
          </button>
        </DialogClose>
        <DialogClose
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-muted"
        >
          <X className="size-4" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
