import { getImageUrl } from "@/helpers/getImageUrl";

export function avatarUrl(seed: string | null | undefined, size = 256): string {
  if (!seed || seed === "default") return "/assets/blank-image.png";
  if (/^https?:\/\//i.test(seed)) return seed;
  if (seed.startsWith("/") || seed.startsWith("blob:")) {
    return getImageUrl(seed) ?? "/assets/blank-image.png";
  }
  // Instead of pravatar, we use the requested default blank image if it's just a seed string (like a name)
  return "/assets/blank-image.png";
}

export function photoUrl(
  seed: string | null | undefined,
  width = 640,
  height = 800,
): string {
  if (!seed || seed === "default") return "/assets/blank-image.png";
  if (/^https?:\/\//i.test(seed)) return seed;
  if (seed.startsWith("/") || seed.startsWith("blob:")) {
    return getImageUrl(seed) ?? "/assets/blank-image.png";
  }
  // Instead of picsum, we use the requested default blank image
  return "/assets/blank-image.png";
}
