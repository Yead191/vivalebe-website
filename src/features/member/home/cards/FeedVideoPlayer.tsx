"use client";

import { useEffect, useRef, useState } from "react";
import { videoState } from "@/lib/video-state";

interface FeedVideoPlayerProps {
  src: string;
  poster: string;
}

export function FeedVideoPlayer({ src, poster }: FeedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(videoState.get().isMuted);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Apply initial global state
    const currentGlobal = videoState.get();
    video.muted = currentGlobal.isMuted;
    video.volume = currentGlobal.volume;
    setIsMuted(currentGlobal.isMuted);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              setIsPlaying(false);
            });
            setIsPlaying(true);
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.6 } // Play when 60% of video is visible
    );

    observer.observe(video);

    const unsubscribe = videoState.subscribe((state) => {
      if (videoRef.current) {
        videoRef.current.muted = state.isMuted;
        videoRef.current.volume = state.volume;
        setIsMuted(state.isMuted);
      }
    });

    return () => {
      observer.disconnect();
      unsubscribe();
      video.pause();
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = () => {
    const video = videoRef.current;
    if (!video) return;

    const currentGlobal = videoState.get();
    // Only update global state if this video's state is actually different
    if (video.muted !== currentGlobal.isMuted || video.volume !== currentGlobal.volume) {
      videoState.set({
        isMuted: video.muted,
        volume: video.volume,
      });
    }
  };

  return (
    <div
      className="relative size-full cursor-pointer bg-black group"
      onClick={togglePlay}
      onContextMenu={(e) => e.preventDefault()}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
        controls
        controlsList="nodownload"
        onVolumeChange={handleVolumeChange}
        className="size-full object-cover"
      />
    </div>
  );
}
