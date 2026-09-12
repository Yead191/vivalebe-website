"use client";

import { useEffect, useState } from "react";
import { ImageWithFallback as Image } from "@/components/shared/ImageWithFallback";
import { handleClientSubscriptionError } from "@/helpers/handleClientSubscriptionError";
import type { Locale } from "@/i18n/config";
import { getPrivateAlbum } from "../action";
import { Loader2, Lock } from "lucide-react";
import { getImageUrl } from "@/helpers/getImageUrl";

export function PrivateAlbumBlock({
  lang,
  refreshKey = 0,
}: {
  lang: Locale;
  refreshKey?: number;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [albumData, setAlbumData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlbum = async () => {
      setIsLoading(true);
      try {
        const res = await getPrivateAlbum();
        if (handleClientSubscriptionError(res, lang)) return;
        if (res.success && res.data) {
          setAlbumData(res.data);
        }
      } catch (error) {
        console.error("Failed to load private album", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlbum();
  }, [lang, refreshKey]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-brand" />
      </div>
    );
  }

  if (!albumData) {
    return null;
  }

  return (
    <section className="space-y-4 rounded-2xl border border-border/70 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Lock className="w-5 h-5 text-brand" />
        <h3 className="text-base font-bold tracking-tight">My Private Album</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        These photos and media are protected and only visible to members you
        grant access to.
      </p>

      {albumData.images && albumData.images.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Private Images</h4>
          <div className="grid grid-cols-3 gap-3">
            {albumData.images.map((img: string, idx: number) => (
              <div
                key={idx}
                className="relative aspect-square overflow-hidden rounded-2xl bg-muted"
              >
                <Image
                  src={getImageUrl(img) || ""}
                  alt={`Private image ${idx + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {albumData.protectedImages && albumData.protectedImages.length > 0 && (
        <div className="space-y-2 mt-4">
          <h4 className="text-sm font-semibold">Protected Images</h4>
          <div className="grid grid-cols-3 gap-3">
            {albumData.protectedImages.map((img: string, idx: number) => (
              <div
                key={idx}
                className="relative aspect-square overflow-hidden rounded-2xl bg-muted"
              >
                <Image
                  src={getImageUrl(img) || ""}
                  alt={`Protected image ${idx + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {albumData.media && albumData.media.length > 0 && (
        <div className="space-y-2 mt-4">
          <h4 className="text-sm font-semibold">Private Media</h4>
          <div className="grid grid-cols-2 gap-3">
            {albumData.media.map((vid: string, idx: number) => (
              <div
                key={idx}
                className="relative aspect-video overflow-hidden bg-black rounded-md flex items-center justify-center"
              >
                <video
                  src={getImageUrl(vid) || ""}
                  controls
                  className="max-w-full max-h-full"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
