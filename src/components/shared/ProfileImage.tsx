"use client";

import { ImageIcon } from "lucide-react";
import { ImageWithFallback as Image } from "@/components/shared/ImageWithFallback";
import { avatarUrl, hasRealImageSrc } from "@/lib/image";
import { cn } from "@/lib/utils";

interface ProfileImageProps {
  seed?: string | null;
  alt: string;
  width: number;
  height?: number;
  className?: string;
  iconClassName?: string;
}

export function ProfileImage({
  seed,
  alt,
  width,
  height = width,
  className,
  iconClassName,
}: ProfileImageProps) {
  const src = avatarUrl(seed, width);
  const showPhoto = hasRealImageSrc(seed) && src !== "/blank-image.png";

  if (!showPhoto) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground/45",
          className,
        )}
        aria-label={alt}
        role="img"
      >
        <ImageIcon className={cn("size-8", iconClassName)} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized
    />
  );
}
