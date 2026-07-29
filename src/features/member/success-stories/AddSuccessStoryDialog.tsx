"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Camera, Play, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { brandButtonClass, brandSoftClass } from "./shared";
import {
  createSuccessStoryAction,
  updateSuccessStoryAction,
} from "./action";
import type { SuccessStory } from "./types";

type PreviewItem = {
  id: string;
  file?: File;
  url: string;
  type: "image" | "video";
};

interface AddSuccessStoryDialogProps {
  title: string;
  description: string;
  userAvatar: string;
  mode?: "create" | "edit";
  story?: SuccessStory;
  trigger?: React.ReactNode;
}

export function AddSuccessStoryDialog({
  title,
  description,
  userAvatar,
  mode = "create",
  story,
  trigger,
}: AddSuccessStoryDialogProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState<PreviewItem[]>([]);
  const [storyTitle, setStoryTitle] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState<
    "DATING" | "ENGAGED" | "OTHER"
  >("DATING");
  const [storyText, setStoryText] = useState("");
  const [isPending, startTransition] = useTransition();

  const imageCount = useMemo(
    () => media.filter((item) => item.type === "image").length,
    [media],
  );
  const videoCount = useMemo(
    () => media.filter((item) => item.type === "video").length,
    [media],
  );

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;

    const nextFiles = Array.from(files);
    const accepted: PreviewItem[] = [];
    let nextImageCount = imageCount;
    let nextVideoCount = videoCount;

    for (const file of nextFiles) {
      const type = file.type.startsWith("video/")
        ? "video"
        : file.type.startsWith("image/")
          ? "image"
          : null;
      if (!type) continue;

      if (type === "image" && nextImageCount >= 9) {
        toast.error("You can upload up to 9 images at a time.");
        continue;
      }

      if (type === "video" && nextVideoCount >= 1) {
        toast.error("Only 1 video can be uploaded at a time.");
        continue;
      }

      accepted.push({
        id: `${file.name}-${file.size}-${Date.now()}`,
        file,
        url: URL.createObjectURL(file),
        type,
      });

      if (type === "image") nextImageCount += 1;
      if (type === "video") nextVideoCount += 1;
    }

    if (accepted.length) {
      setMedia((prev) => [...prev, ...accepted]);
    }
  };

  const resetForm = () => {
    for (const item of media) {
      if (item.file) URL.revokeObjectURL(item.url);
    }
    setStoryTitle(story?.title ?? "");
    setRelationshipStatus(story?.relationshipStatus ?? "DATING");
    setStoryText(story?.story ?? "");
    setMedia(
      story?.media.map((item) => ({
        id: item.id,
        url: item.url,
        type: item.type,
      })) ?? [],
    );
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    resetForm();
  };

  const removeMedia = (id: string) => {
    setMedia((previous) => {
      const item = previous.find((current) => current.id === id);
      if (item?.file) URL.revokeObjectURL(item.url);
      return previous.filter((current) => current.id !== id);
    });
  };

  const handleSubmit = () => {
    if (!storyTitle.trim() || !storyText.trim() || isPending) return;

    const formData = new FormData();
    formData.append("relationshipStatus", relationshipStatus.toLowerCase());
    formData.append("title", storyTitle.trim());
    formData.append("description", storyText.trim());
    for (const item of media) {
      if (item.file) formData.append("media", item.file);
    }

    startTransition(async () => {
      const result =
        mode === "edit" && story
          ? await updateSuccessStoryAction(story.id, formData)
          : await createSuccessStoryAction(formData);

      if (!result.success) {
        toast.error(result.message ?? "Failed to save success story");
        return;
      }

      toast.success(
        result.message ??
          (mode === "edit"
            ? "Success story updated"
            : "Success story created"),
      );
      setOpen(false);
      resetForm();
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className={brandButtonClass}>
            <UploadCloud className="size-4" />
            Add success story
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] min-w-xl overflow-hidden p-0 ">
        <div className="max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>
              {mode === "edit" ? "Edit success story" : title}
            </DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 pt-4">
            <div className="grid gap-4">
              <Input
                placeholder="Story title"
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                className="min-h-10"
              />
              <Select
                value={relationshipStatus}
                onValueChange={(value) =>
                  setRelationshipStatus(value as "DATING" | "ENGAGED" | "OTHER")
                }
              >
                <SelectTrigger className="min-h-10 w-full">
                  <SelectValue placeholder="Relationship status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DATING">DATING</SelectItem>
                  <SelectItem value="ENGAGED">ENGAGED</SelectItem>
                  <SelectItem value="OTHER">OTHER</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="Tell your story..."
              className="min-h-36"
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
            />

            <div className="rounded-[1.5rem] border border-dashed border-[#429CA8]/25 bg-[#429CA8]/6 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">Upload media</p>
                  <p className="text-sm text-muted-foreground">
                    Max 9 images and 1 video. Images and video can be mixed.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className={brandSoftClass}
                  onClick={() => inputRef.current?.click()}
                >
                  <Camera className="size-4" />
                  Choose files
                </Button>
              </div>

              <input
                ref={inputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {media.map((item) => (
                  <div
                    key={item.id}
                    className="relative overflow-hidden rounded-2xl border border-white/70 bg-white"
                  >
                    {item.type === "image" ? (
                      <Image
                        src={item.url}
                        alt={item.file?.name ?? storyTitle}
                        width={320}
                        height={240}
                        className="h-36 w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-36 items-center justify-center bg-slate-950 text-white">
                        <Play className="size-10" />
                      </div>
                    )}
                    <button
                      type="button"
                      className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white"
                      onClick={() => removeMedia(item.id)}
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-[1.5rem] bg-muted/30 p-4">
              <Image
                src={userAvatar}
                alt=""
                width={44}
                height={44}
                className="size-11 rounded-full object-cover"
                unoptimized
              />
              <div className="text-sm text-muted-foreground">
                Posts can include polished media previews, readable copy, and a
                premium story layout.
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              className={brandButtonClass}
              disabled={!storyTitle.trim() || !storyText.trim() || isPending}
              onClick={handleSubmit}
            >
              {isPending
                ? "Saving..."
                : mode === "edit"
                  ? "Save changes"
                  : "Post story"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
