"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Dictionary } from "@/i18n/dictionaries";

interface PostBlogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dict: Dictionary;
}

export function PostBlogModal({ open, onOpenChange, dict }: PostBlogModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || isSubmitting) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    if (youtubeUrl.trim()) formData.append("youtubeUrl", youtubeUrl.trim());
    if (imageFile) formData.append("image", imageFile);

    // Log FormData entries (replace with real API call)
    console.log("--- SUBMITTING BLOG ---");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File (${value.name}, ${value.size} bytes)`);
      } else {
        console.log(`${key}:`, value);
      }
    }

    await new Promise((r) => setTimeout(r, 800));

    setIsSubmitting(false);
    handleClose();
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setTitle("");
    setDescription("");
    setYoutubeUrl("");
    setImageFile(null);
    setImagePreview(null);
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto scrollbar-hide p-0 bg-white border-none rounded-none">
        <div className="p-8 space-y-6">
          <DialogTitle className="text-center text-lg font-bold tracking-tight text-gray-900">
            {dict.blog.modalTitle}
          </DialogTitle>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
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

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-900">
                {dict.blog.modalFieldDescription}
              </label>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 5000))}
                  placeholder={dict.blog.modalFieldDescriptionPlaceholder}
                  rows={6}
                  className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm outline-none focus:border-brand transition-colors resize-none placeholder:text-gray-400"
                />
                <span className="absolute bottom-2.5 right-3 text-[10px] text-gray-400">
                  {description.length.toLocaleString()}/5,000
                </span>
              </div>
            </div>

            {/* YouTube URL */}
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

            {/* Photo upload */}
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

            {/* Actions */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-8 py-2.5 border border-gray-300 text-sm font-bold tracking-wide text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                {dict.blog.modalCancel}
              </button>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="px-8 py-2.5 bg-brand text-white text-sm font-bold tracking-wide hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? dict.blog.modalPosting : dict.blog.modalPostBlog}
              </button>
            </div>

            {/* Community guidelines */}
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
