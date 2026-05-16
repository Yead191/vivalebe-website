"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { videoState } from "@/lib/video-state";

interface FeedVideoPlayerProps {
  id: string;
  src: string;
  poster: string;
}

export function FeedVideoPlayer({ id, src, poster }: FeedVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Mount-once latch: render <video> the first time it's broadly visible,
  // then keep it in the DOM. Tearing down a <video> on scroll forces the
  // decoder + metadata fetch to restart and is the main source of jank.
  const [hasMounted, setHasMounted] = useState(false);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;

        if (entry.isIntersecting && !hasMountedRef.current) {
          hasMountedRef.current = true;
          setHasMounted(true);
        }

        const video = videoRef.current;
        if (entry.intersectionRatio > 0.6) {
          if (videoState.get().activeVideoId !== id) {
            videoState.set({ activeVideoId: id });
          }
          if (video && video.paused) {
            video.play().catch(() => {});
          }
        } else {
          if (video && !video.paused) {
            video.pause();
          }
          if (
            entry.intersectionRatio < 0.1 &&
            videoState.get().activeVideoId === id
          ) {
            videoState.set({ activeVideoId: null });
          }
        }
      },
      { threshold: [0, 0.1, 0.6] }
    );

    observer.observe(container);

    const unsubscribe = videoState.subscribe((state) => {
      const video = videoRef.current;
      if (!video) return;

      if (video.muted !== state.isMuted) video.muted = state.isMuted;
      if (video.volume !== state.volume) video.volume = state.volume;

      if (state.activeVideoId !== id && !video.paused) {
        video.pause();
      }
    });

    return () => {
      observer.disconnect();
      unsubscribe();
    };
  }, [id]);

  const handleVolumeChange = () => {
    const video = videoRef.current;
    if (!video) return;

    const currentGlobal = videoState.get();
    if (video.muted !== currentGlobal.isMuted || video.volume !== currentGlobal.volume) {
      videoState.set({
        isMuted: video.muted,
        volume: video.volume,
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative size-full bg-black"
      onContextMenu={(e) => e.preventDefault()}
    >
      {hasMounted ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted={videoState.get().isMuted}
          loop
          playsInline
          preload="metadata"
          controls
          controlsList="nodownload"
          onVolumeChange={handleVolumeChange}
          className="size-full object-cover"
        />
      ) : (
        <Image
          src={poster}
          alt=""
          fill
          className="object-cover"
          unoptimized
        />
      )}
    </div>
  );
}
