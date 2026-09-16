const RESET_TOKEN_KEY = "resetToken";

export function saveResetToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RESET_TOKEN_KEY, token);
}

export function getResetToken() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(RESET_TOKEN_KEY) || "";
}

export function clearResetToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(RESET_TOKEN_KEY);
}

export function resetTokenFromOtpData(data: unknown): string {
  if (typeof data === "string" && data.trim()) return data.trim();
  if (!data || typeof data !== "object") return "";
  const record = data as { token?: unknown; accessToken?: unknown };
  if (typeof record.token === "string" && record.token.trim()) {
    return record.token.trim();
  }
  if (typeof record.accessToken === "string" && record.accessToken.trim()) {
    return record.accessToken.trim();
  }
  return "";
}
