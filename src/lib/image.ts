import { getImageUrl } from "@/helpers/getImageUrl";

const DUMMY_IMAGE_HOSTS =
  /unsplash\.com|picsum\.photos|pravatar\.cc|randomuser\.me|dicebear\.com/i;

export function hasRealImageSrc(seed: string | null | undefined): boolean {
  if (!seed || seed === "default") return false;
  if (DUMMY_IMAGE_HOSTS.test(seed)) return false;
  if (/^https?:\/\//i.test(seed)) return true;
  return (
    seed.startsWith("/") ||
    seed.startsWith("blob:") ||
    seed.startsWith("image/") ||
    seed.startsWith("protected/")
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function avatarUrl(seed: string | null | undefined, size = 256): string {
  if (!hasRealImageSrc(seed)) return "/blank-image.png";
  if (/^https?:\/\//i.test(seed!)) return seed!;
  if (
    seed!.startsWith("/") ||
    seed!.startsWith("blob:") ||
    seed!.startsWith("image/") ||
    seed!.startsWith("protected/")
  ) {
    return getImageUrl(seed) ?? "/blank-image.png";
  }
  return "/blank-image.png";
}

export function photoUrl(
  seed: string | null | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  width = 640,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  height = 800,
): string {
  return avatarUrl(seed, width);
}
