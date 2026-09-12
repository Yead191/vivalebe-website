export function isAccessTokenExpired(token: string | undefined): boolean {
  if (!token) return true;

  const parts = token.split(".");
  if (parts.length < 2) return false;

  try {
    const payload = JSON.parse(decodeJwtSegment(parts[1])) as {
      exp?: number;
    };
    if (typeof payload.exp !== "number") return false;
    return payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

function decodeJwtSegment(segment: string): string {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return atob(padded);
}

export function isSessionExpiredApiError(
  status: number,
  json: { message?: unknown; error?: unknown; errorMessages?: unknown },
): boolean {
  if (status === 401) return true;

  const text = [json?.message, json?.error, json?.errorMessages]
    .flat()
    .filter((value) => typeof value === "string")
    .join(" ")
    .toLowerCase();

  return /jwt expired|token expired|invalid token|jwt malformed/.test(text);
}
