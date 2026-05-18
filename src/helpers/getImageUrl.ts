export function getImageUrl(imageurl: string | null | undefined) {
  // if (!imageurl) return undefined;
  if (imageurl?.startsWith("/asset")) return "http://68.178.164.48:5005" + imageurl;
  if (imageurl?.startsWith("http") || imageurl?.startsWith('blob:')) return imageurl;
  return (
    (process.env.IMAGE_BASE_URL || "http://68.178.164.48:5005/files") + imageurl
  );
}
