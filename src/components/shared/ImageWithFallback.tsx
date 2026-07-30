"use client";

import { useState } from "react";
import NextImage, { ImageProps } from "next/image";

const transparentGif = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

// A beautiful, subtle SVG string of the lucide ImageOff icon, centered
const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><rect width='18' height='18' x='3' y='3' rx='2' ry='2'/><line x1='3' y1='3' x2='21' y2='21'/><path d='M10.41 10.41 14 6l5 5'/><path d='M4.09 13.09 9 18'/></svg>`;

export function ImageWithFallback(props: ImageProps) {
  const [error, setError] = useState(false);

  return (
    <NextImage
      {...props}
      src={error ? transparentGif : props.src}
      unoptimized={error ? true : props.unoptimized}
      onError={(e) => {
        setError(true);
        if (props.onError) props.onError(e);
      }}
      className={props.className}
      style={{
        ...props.style,
        ...(error
          ? {
              backgroundImage: `url("${fallbackSvg}")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundColor: "#f1f5f9", // bg-muted
              color: "transparent", // hides broken alt text just in case
            }
          : {}),
      }}
    />
  );
}
