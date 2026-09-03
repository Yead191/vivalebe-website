import { getImageUrl } from "@/helpers/getImageUrl";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function avatarUrl(seed: string | null | undefined, size = 256): string {
  if (!seed || seed === "default") return "/blank-image.png";
  if (/^https?:\/\//i.test(seed)) return seed;
  if (
    seed.startsWith("/") ||
    seed.startsWith("blob:") ||
    seed.startsWith("image/") ||
    seed.startsWith("protected/")
  ) {
    return getImageUrl(seed) ?? "/blank-image.png";
  }
  // Instead of pravatar, we use the requested default blank image if it's just a seed string (like a name)
  return "/blank-image.png";
}

export function photoUrl(
  seed: string | null | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  width = 640,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  height = 800,
): string {
  if (!seed || seed === "default") return "/blank-image.png";
  if (/^https?:\/\//i.test(seed)) return seed;
  if (
    seed.startsWith("/") ||
    seed.startsWith("blob:") ||
    seed.startsWith("image/") ||
    seed.startsWith("protected/")
  ) {
    return getImageUrl(seed) ?? "/blank-image.png";
  }
  // Instead of picsum, we use the requested default blank image
  return "/blank-image.png";
}
