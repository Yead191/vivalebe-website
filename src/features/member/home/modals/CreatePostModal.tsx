"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Pencil, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";

interface CreatePostModalProps {
  dict: Dictionary;
  trigger?: React.ReactNode;
}

const HASHTAGS = [
  "Pet", "Music", "Fitness", "Travel", "Food", "Happy", "Friends", "Selfie",
  "Fashion", "Love", "Question", "Event", "Study", "Stdtest", "Mentalhealth",
  "Story", "Relationship", "Endherpes", "Support", "Health", "Lifestlye",
  "Herpesdating", "Herpescure", "Herpesawareness", "Hsv",
];

export function CreatePostModal({ dict, trigger }: CreatePostModalProps) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate previews when files change
  useEffect(() => {
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);

    // Cleanup URLs to avoid memory leaks
    return () => newPreviews.forEach(url => URL.revokeObjectURL(url));
  }, [files]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => {
        const combined = [...prev, ...newFiles];
        return combined.slice(0, 9); // Max 9
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleHashtag = (tag: string) => {
    const hashtag = `#${tag}`;
    if (text.includes(hashtag)) {
      setText(prev => prev.replace(new RegExp(`${hashtag}\\s?`, 'g'), '').trim());
    } else {
      setText(prev => `${prev}${prev ? ' ' : ''}${hashtag}`.trim());
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("description", text);
    files.forEach((file, i) => {
      formData.append(`photo_${i}`, file);
    });

    console.log("--- SUBMITTING MOMENT ---");
    console.log("Description:", text);
    console.log("Files:", files);

    // Log entries for verification
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File (${value.name}, ${value.size} bytes)`);
      } else {
        console.log(`${key}:`, value);
      }
    }

    setIsOpen(false);
    // Reset state
    setText("");
    setFiles([]);
  };

  const canPost = text.trim().length > 0 || files.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            Add Moment
          </DialogTitle>

          {/* Photo Section */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-900">
              Add photos ({files.length}/9)*
            </label>
            <div className="grid grid-cols-3 gap-4">
              {previews.map((src, i) => (
                <div key={src} className="group relative aspect-3/4 overflow-hidden bg-gray-100">
                  <Image
                    src={src}
                    alt={`Preview ${i}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => removeFile(i)}
                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}

              {files.length < 9 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-3/4 items-center justify-center border-2 border-dashed border-gray-300 hover:border-black transition-colors"
                >
                  <Plus className="size-10 text-gray-400" />
                </button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">Description</label>
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 2000))}
                rows={6}
                className="w-full border border-gray-200 p-4 text-sm focus:outline-none focus:border-gray-400 resize-none"
              />
              <div className="absolute bottom-4 right-4 text-[10px] font-medium text-gray-400">
                {text.length.toLocaleString()}/2,000
              </div>
            </div>
          </div>

          {/* Hashtags Section */}
          <div className="flex flex-wrap gap-2">
            {HASHTAGS.map(tag => {
              const isActive = text.includes(`#${tag}`);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleHashtag(tag)}
                  className={cn(
                    "px-3 py-1.5 border text-xs font-medium transition-colors",
                    isActive
                      ? "border-brand bg-brand text-white"
                      : "border-gray-200 text-gray-600 hover:border-gray-400"
                  )}
                >
                  #{tag}
                </button>
              );
            })}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            disabled={!canPost}
            onClick={handleSubmit}
            className="w-40 py-3 bg-brand text-white text-xs font-bold tracking-[0.2em] uppercase transition-colors hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            POST
          </button>

          {/* Policy Note */}
          <div className="space-y-2 pt-4">
            <p className="text-sm font-bold text-gray-900">Note:</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Photos that are lewd, offensive, nude, racist, or featuring children are prohibited, as are any other photos or
              videos that are prohibited by law, protected by a copyright, or that violate our{" "}
              <a href="#" className="text-blue-600 underline">Service Agreement</a>.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
