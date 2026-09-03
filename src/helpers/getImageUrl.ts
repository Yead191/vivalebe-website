export function getImageUrl(imageurl: string | null | undefined) {
  if (!imageurl || imageurl === "default") return "/blank-image.png";
  if (imageurl.startsWith("http") || imageurl.startsWith("blob:")) {
    return imageurl;
  }

  // Prefer NEXT_PUBLIC_* so server and client resolve the same base URL
  const socketBase = process.env.NEXT_PUBLIC_SOCKET_URL?.replace(/\/$/, "");
  const imageBase =
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
    process.env.IMAGE_BASE_URL ||
    socketBase ||
    "http://10.10.26.159:5000";

  // Strip accidental /files, /api/v1, or trailing slashes so static routes like /image/... resolve correctly
  const cleanBase = imageBase
    .replace(/\/files\/?$/, "")
    .replace(/\/api\/v1\/?$/, "")
    .replace(/\/$/, "");
  const normalizedPath = imageurl.startsWith("/") ? imageurl : `/${imageurl}`;
  return `${cleanBase}${normalizedPath}`;
}
