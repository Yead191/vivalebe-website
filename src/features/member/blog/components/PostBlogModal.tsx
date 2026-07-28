"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Dictionary } from "@/i18n/dictionaries";
import { createBlogAction } from "../actions";

interface PostBlogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dict: Dictionary;
}

export function PostBlogModal({
  open,
  onOpenChange,
  dict,
}: PostBlogModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setYoutubeUrl("");
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || isPending) return;

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    if (youtubeUrl.trim()) formData.append("youtubeUrl", youtubeUrl.trim());
    if (imageFile) formData.append("imageUrl", imageFile);

    const tags =
      description.match(/#([A-Za-z0-9_]+)/g)?.map((t) => t.slice(1)) ?? [];
    if (tags.length > 0) {
      for (const tag of tags) formData.append("tags[]", tag);
    } else {
      formData.append("tags[]", "general");
    }

    startTransition(async () => {
      const res = await createBlogAction(formData);
      if (!res.success) {
        toast.error(res.message ?? res.error ?? "Failed to post blog");
        return;
      }
      toast.success(res.message ?? "Blog posted successfully");
      resetForm();
      onOpenChange(false);
      router.refresh();
    });
  };

  const handleClose = () => {
    if (isPending) return;
    resetForm();
    onOpenChange(false);
  };

  const isValid = title.trim().length > 0 && description.trim().length > 0;

  const guidelines = [
    dict.blog.modalGuideline1,
    dict.blog.modalGuideline2,
    dict.blog.modalGuideline3,
    dict.blog.modalGuideline4,
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto scrollbar-hide p-0 bg-white border-none rounded-none">
        <div className="p-8 space-y-6">
          <DialogTitle className="text-center text-lg font-bold tracking-tight text-gray-900">
            {dict.blog.modalTitle}
          </DialogTitle>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-900">
                {dict.blog.modalFieldTitle}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={dict.blog.modalFieldTitlePlaceholder}
                maxLength={200}
                className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm outline-none focus:border-brand transition-colors placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-900">
                {dict.blog.modalFieldDescription}
              </label>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value.slice(0, 5000))
                  }
                  placeholder={dict.blog.modalFieldDescriptionPlaceholder}
                  rows={6}
                  className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm outline-none focus:border-brand transition-colors resize-none placeholder:text-gray-400"
                />
                <span className="absolute bottom-2.5 right-3 text-[10px] text-gray-400">
                  {description.length.toLocaleString()}/5,000
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-900">
                {dict.blog.modalFieldYoutubeUrl}
              </label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder={dict.blog.modalFieldYoutubeUrlPlaceholder}
                className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm outline-none focus:border-brand transition-colors placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                {dict.blog.modalFieldPhoto}
              </label>
              <div>
                {imagePreview ? (
                  <div className="relative w-44 h-44">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-0.5 hover:bg-gray-100 transition-colors shadow-sm"
                    >
                      <X className="size-3.5 text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-44 h-44 border border-dashed border-gray-300 flex items-center justify-center hover:border-brand hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="size-7 text-gray-400" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="px-8 py-2.5 border border-gray-300 text-sm font-bold tracking-wide text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                {dict.blog.modalCancel}
              </button>
              <button
                type="submit"
                disabled={!isValid || isPending}
                className="px-8 py-2.5 bg-brand text-white text-sm font-bold tracking-wide hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? dict.blog.modalPosting : dict.blog.modalPostBlog}
              </button>
            </div>

            <div className="pt-1 space-y-2">
              <p className="text-sm text-brand font-medium leading-snug">
                {dict.blog.modalGuidelinesTitle}
              </p>
              <ol className="space-y-1">
                {guidelines.map((line, i) => (
                  <li key={i} className="text-sm text-brand leading-snug">
                    {i + 1}. {line}
                  </li>
                ))}
              </ol>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
