"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getPrivateAlbum } from "../action";
import { Loader2, Lock } from "lucide-react";
import { getImageUrl } from "@/helpers/getImageUrl";

export function PrivateAlbumBlock() {
  const [albumData, setAlbumData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const res = await getPrivateAlbum();
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
  }, []);

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
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Lock className="w-5 h-5 text-brand" />
        <h3 className="text-lg font-bold">My Private Album</h3>
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
                className="relative aspect-square overflow-hidden bg-muted rounded-md"
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
                className="relative aspect-square overflow-hidden bg-muted rounded-md"
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
