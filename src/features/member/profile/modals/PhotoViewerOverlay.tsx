"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight,
  Heart, MessageSquare, Send, MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { photoUrl } from "@/lib/image";
import type { User } from "@/lib/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ReportContentModal } from "../../home/modals/ReportContentModal";

interface PhotoViewerOverlayProps {
  user: User;
  initialIndex: number;
  onClose: () => void;
}

const MOCK_COMMENTS = [
  {
    id: 1,
    user: "BREATHLESS",
    text: "That's not what I expected 150#'s to look like....lol. Impressed. It looks good on you.",
    time: "2h",
    avatar: "https://github.com/shadcn.png"
  },
  {
    id: 2,
    user: "MARCO",
    text: "Great photo! The colors are amazing.",
    time: "1h",
    avatar: ""
  },
];

export function PhotoViewerOverlay({ user, initialIndex, onClose }: PhotoViewerOverlayProps) {
  const [index, setIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");

  const photos = user.photos;
  const currentPhoto = photos[index];

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const next = () => {
    setIndex((prev) => (prev + 1) % photos.length);
    setZoomLevel(1);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + photos.length) % photos.length);
    setZoomLevel(1);
  };

  const toggleZoom = () => setZoomLevel((z) => (z === 1 ? 2.5 : 1));

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex animate-in fade-in duration-200">
      {/* Photo Area (Left) */}
      <div className="relative flex flex-1 flex-col bg-[#050505] overflow-hidden">
        {/* Top bar controls */}
        <div className="absolute right-6 top-6 z-10 flex items-center gap-4 text-white/80">
          <button
            onClick={toggleZoom}
            className="hover:text-white transition-colors"
          >
            {zoomLevel > 1 ? <ZoomOut className="size-5" /> : <ZoomIn className="size-5" />}
          </button>
          <button
            onClick={onClose}
            className="md:hidden hover:text-white transition-colors"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Navigation Arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-6 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white/70 hover:bg-black/40 hover:text-white transition-all"
            >
              <ChevronLeft className="size-8" />
            </button>
            <button
              onClick={next}
              className="absolute right-6 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white/70 hover:bg-black/40 hover:text-white transition-all"
            >
              <ChevronRight className="size-8" />
            </button>
          </>
        )}

        {/* Image Container */}
        <div className={cn(
          "relative flex h-full w-full items-center justify-center overflow-auto scrollbar-hide",
          zoomLevel > 1 ? "cursor-zoom-out" : "cursor-zoom-in"
        )}
          onClick={(e) => { if (e.target === e.currentTarget) toggleZoom(); }}
        >
          <div
            className="relative transition-all duration-300 ease-out"
            style={{
              width: zoomLevel > 1 ? '250%' : '100%',
              height: zoomLevel > 1 ? '250%' : '100%',
              minHeight: '100vh',
            }}
          >
            <Image
              src={photoUrl(currentPhoto, 1600, 1600)}
              alt={`${user.displayName} photo`}
              fill
              className="object-contain"
              unoptimized
              priority
              onClick={toggleZoom}
            />
          </div>
        </div>

        {/* Footer controls */}
        <div className="absolute bottom-6 left-6 z-10 flex items-center gap-4">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="text-xs font-medium text-white/60 hover:text-white transition-colors"
          >
            Report
          </button>
          <span className="text-[10px] text-white/40 uppercase tracking-widest">
            {index + 1} / {photos.length}
          </span>
        </div>
      </div>

      {/* Social Sidebar (Right) */}
      <div className="hidden md:flex w-[400px] flex-col bg-white border-l border-gray-100 shadow-2xl relative">
        {/* Sidebar Header */}
        <div className="p-4 flex items-start justify-between border-b border-gray-50">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border border-gray-100">
              <AvatarImage src={photoUrl(user.avatarSeed, 80, 80)} />
              <AvatarFallback>{user.displayName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-bold tracking-wide uppercase">{user.displayName}</h3>
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-tighter">
                {user.age}, {user.gender}, {user.city}, {user.country}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 transition-colors"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Interaction Stats */}
        <div className="px-4 py-3 flex items-center gap-6 border-b border-gray-50">
          <div className="flex items-center gap-1.5 text-gray-600">
            <button
              onClick={() => setLiked(!liked)}
              className="group flex items-center gap-1.5"
            >
              <Heart className={cn("size-5 transition-colors", liked ? "fill-brand text-brand" : "group-hover:text-gray-900")} />
              <span className="text-xs font-bold">{liked ? 6 : 5}</span>
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <MessageSquare className="size-5" />
            <span className="text-xs font-bold">{MOCK_COMMENTS.length}</span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
          {MOCK_COMMENTS.map((c) => (
            <div key={c.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Avatar className="size-8 shrink-0">
                <AvatarImage src={c.avatar} />
                <AvatarFallback>{c.user[0]}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold tracking-wide">{c.user}</span>
                  <span className="text-[10px] text-muted-foreground">{c.time}</span>
                </div>
                <p className="text-[13px] text-gray-700 leading-relaxed font-normal">
                  {c.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="relative flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarImage src="" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="ADD A PUBLIC COMMENT..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-transparent border-none py-2 pr-10 text-[11px] font-bold tracking-wider uppercase placeholder:text-gray-400 focus:outline-none"
              />
              <button
                disabled={!comment.trim()}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors disabled:opacity-0"
              >
                <Send className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ReportContentModal
        open={isReportModalOpen}
        onOpenChange={setIsReportModalOpen}
      />
    </div>,
    document.body
  );
}
