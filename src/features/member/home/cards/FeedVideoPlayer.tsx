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
  const [isInView, setIsInView] = useState(false);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Lazy mount/unmount: only render <video> when broad visibility > 0.1
          if (entry.isIntersecting) {
            setIsInView(true);
          } else {
            setIsInView(false);
          }

          // Playback control: play only when highly visible (> 0.6)
          const video = videoRef.current;
          if (entry.intersectionRatio > 0.6) {
            videoState.set({ activeVideoId: id });
            if (video && video.paused) {
              video.play().catch(() => { });
              isPlayingRef.current = true;
            }
          } else {
            // Pause when visibility drops below 0.6
            if (video && !video.paused) {
              video.pause();
              isPlayingRef.current = false;
            }
            // Clear global active ID if this was the one
            if (videoState.get().activeVideoId === id && entry.intersectionRatio < 0.1) {
              videoState.set({ activeVideoId: null });
            }
          }
        });
      },
      { threshold: [0.1, 0.6] }
    );

    observer.observe(container);

    const unsubscribe = videoState.subscribe((state) => {
      const video = videoRef.current;
      if (!video) return;

      // Sync audio settings directly via DOM to avoid re-renders
      if (video.muted !== state.isMuted) video.muted = state.isMuted;
      if (video.volume !== state.volume) video.volume = state.volume;

      // Single playback enforcement: pause if another video becomes active
      if (state.activeVideoId !== id && !video.paused) {
        video.pause();
        isPlayingRef.current = false;
      }
    });

    return () => {
      observer.disconnect();
      unsubscribe();
    };
  }, [id]);

  // const togglePlay = () => {
  //   const video = videoRef.current;
  //   if (!video) return;

  //   if (!video.paused) {
  //     video.pause();
  //     isPlayingRef.current = false;
  //     if (videoState.get().activeVideoId === id) {
  //       videoState.set({ activeVideoId: null });
  //     }
  //   } else {
  //     videoState.set({ activeVideoId: id });
  //     video.play().catch(() => {});
  //     isPlayingRef.current = true;
  //   }
  // };

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
      className="relative size-full cursor-pointer bg-black group"
      // onClick={togglePlay}
      onContextMenu={(e) => e.preventDefault()}
    >
      {isInView ? (
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
