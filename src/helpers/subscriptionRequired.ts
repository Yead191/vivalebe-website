export const SUBSCRIBE_REQUIRED_MESSAGE =
  "Please subscribe first to access this feature";

export const SUBSCRIBE_REQUIRED_TOAST_ID = "subscription-required";

const SUBSCRIBE_ERROR_PATTERN =
  /please subscribe first to access this feature/i;

export function isSubscriptionRequiredError(payload: {
  message?: string | null;
  error?: string | null;
  errorMessages?: unknown;
}): boolean {
  const texts: string[] = [];

  if (typeof payload.message === "string") texts.push(payload.message);
  if (typeof payload.error === "string") texts.push(payload.error);

  if (Array.isArray(payload.errorMessages)) {
    for (const item of payload.errorMessages) {
      if (typeof item === "string") texts.push(item);
      else if (item && typeof item === "object" && "message" in item) {
        const msg = (item as { message?: unknown }).message;
        if (typeof msg === "string") texts.push(msg);
      }
    }
  } else if (typeof payload.errorMessages === "string") {
    texts.push(payload.errorMessages);
  }

  return texts.some((text) => SUBSCRIBE_ERROR_PATTERN.test(text));
}
