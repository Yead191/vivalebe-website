"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, X, ZoomIn, ZoomOut, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { BlogPost, Comment, User } from "@/lib/types";
import { photoUrl } from "@/lib/image";
import { PostHeader } from "@/features/member/home/cards/PostHeader";
import { PostActions } from "@/features/member/home/cards/PostActions";
import { ReportContentModal } from "@/features/member/home/modals/ReportContentModal";

interface BlogDetailClientProps {
  lang: Locale;
  dict: Dictionary;
  blog: BlogPost;
  author: User;
  authorsMap: Record<string, { displayName: string; avatarSeed: string }>;
  likeCount: number;
  liked: boolean;
  comments: Comment[];
  currentUserAvatarSeed: string;
}

export function BlogDetailClient({
  lang,
  dict,
  blog,
  author,
  authorsMap,
  likeCount,
  liked,
  comments,
  currentUserAvatarSeed,
}: BlogDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!selectedImage) {
      setZoomLevel(1);
      return;
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  const toggleZoom = () => setZoomLevel((z) => (z === 1 ? 2.5 : 1));

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing
    }
  };

  const formattedDate = new Intl.DateTimeFormat(
    lang === "pt" ? "pt-BR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  ).format(new Date(blog.createdAt));

  const count = blog.imageSeeds.length;

  return (
    <>
      <div className="container py-6 max-w-2xl">
        {/* Back */}
        <Link
          href={`/${lang}/blog`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5"
        >
          <ArrowLeft className="size-4" />
          {dict.blog.backToBlogs}
        </Link>

        <article className="overflow-hidden rounded-xl border border-border bg-card">
          <PostHeader user={author} lang={lang} showAgeGender />

          {/* Title + date */}
          <div className="px-4 pt-4 pb-2">
            <h1 className="text-xl font-bold leading-snug">{blog.title}</h1>
            <p className="text-xs text-muted-foreground mt-1">{formattedDate}</p>
          </div>

          {/* Images */}
          {count > 0 ? (
            <div
              className={cn(
                "mt-2 gap-1 px-4",
                count === 1 ? "flex" : "grid grid-cols-2"
              )}
            >
              {blog.imageSeeds.map((seed, i) => (
                <div
                  key={seed + i}
                  className="overflow-hidden rounded-md bg-muted aspect-5/3 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage(seed)}
                >
                  <Image
                    src={photoUrl(seed, 800, 600)}
                    alt={blog.title}
                    width={800}
                    height={600}
                    className="size-full object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          ) : null}

          {/* Full content */}
          <div className="px-4 py-5">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {blog.content}
            </p>

            {/* Tags */}
            {blog.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-5">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-brand/10 text-brand font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {/* Share bar */}
          <div className="flex items-center justify-between border-t border-border px-4 py-2">
            <button
              type="button"
              onClick={() => setIsReportOpen(true)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {dict.blog.report}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Share2 className="size-4" />
              {copied ? "Copied!" : dict.blog.share}
            </button>
          </div>

          {/* Like + Comments */}
          <PostActions
            kind="blog"
            postId={blog.id}
            initialLikeCount={likeCount}
            initialLiked={liked}
            initialComments={comments}
            authors={authorsMap}
            currentUserAvatarSeed={currentUserAvatarSeed}
            commentPlaceholder={dict.blog.commentPlaceholder}
          />
        </article>
      </div>

      {/* Full-screen photo viewer */}
      {selectedImage && mounted
        ? createPortal(
            <div className="fixed inset-0 z-40 flex flex-col bg-black animate-in fade-in duration-200">
              <div className="absolute right-6 top-6 z-50 flex items-center gap-6 text-white/90">
                <button
                  onClick={() => setIsReportOpen(true)}
                  className="text-sm font-medium hover:text-white transition-colors"
                >
                  {dict.blog.report}
                </button>
                <button
                  onClick={toggleZoom}
                  className="hover:text-white transition-colors"
                >
                  {zoomLevel > 1 ? (
                    <ZoomOut className="size-5" />
                  ) : (
                    <ZoomIn className="size-5" />
                  )}
                </button>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="hover:text-white transition-colors"
                >
                  <X className="size-6" />
                </button>
              </div>

              <div
                className={cn(
                  "relative flex h-full w-full items-center justify-center overflow-auto transition-all duration-300",
                  zoomLevel > 1 ? "cursor-zoom-out" : "cursor-zoom-in"
                )}
              >
                <div
                  className="relative transition-all duration-300 ease-out"
                  style={{
                    width: zoomLevel > 1 ? "250%" : "100%",
                    height: zoomLevel > 1 ? "250%" : "100%",
                    minHeight: "100vh",
                    minWidth: "100vw",
                  }}
                  onClick={(e) => {
                    if (e.target === e.currentTarget) toggleZoom();
                  }}
                >
                  <Image
                    src={photoUrl(selectedImage, 600, 600)}
                    alt=""
                    fill
                    className="object-contain blur-md opacity-50"
                    unoptimized
                  />
                  <Image
                    src={photoUrl(selectedImage, 1600, 1600)}
                    alt="Blog photo full screen"
                    fill
                    className="object-contain"
                    unoptimized
                    priority
                    onClick={toggleZoom}
                  />
                </div>
              </div>
            </div>,
            document.body
          )
        : null}

      <ReportContentModal open={isReportOpen} onOpenChange={setIsReportOpen} />
    </>
  );
}
