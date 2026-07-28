export function getImageUrl(imageurl: string | null | undefined) {
  if (!imageurl) return undefined;
  if (imageurl.startsWith("http") || imageurl.startsWith("blob:")) {
    return imageurl;
  }

  // Prefer NEXT_PUBLIC_* so server and client resolve the same base URL
  const socketBase = process.env.NEXT_PUBLIC_SOCKET_URL?.replace(/\/$/, "");
  const imageBase =
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
    process.env.IMAGE_BASE_URL ||
    (socketBase ? `${socketBase}/files` : undefined) ||
    "http://10.10.26.159:5000/files";

  if (imageurl.startsWith("/asset")) {
    return `${imageBase.replace(/\/files\/?$/, "")}${imageurl}`;
  }

  const normalizedBase = imageBase.replace(/\/$/, "");
  const normalizedPath = imageurl.startsWith("/") ? imageurl : `/${imageurl}`;
  return `${normalizedBase}${normalizedPath}`;
}
