import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { defaultLocale, isLocale } from "@/i18n/config";
import { isSubscriptionRequiredError } from "./subscriptionRequired";

export { isSubscriptionRequiredError } from "./subscriptionRequired";

async function resolveLocaleFromHeaders(): Promise<string> {
  const h = await headers();
  const referer = h.get("referer") ?? h.get("x-url") ?? "";

  if (!referer) return defaultLocale;

  try {
    const pathname = new URL(referer).pathname;
    const maybeLang = pathname.split("/").filter(Boolean)[0];
    if (maybeLang && isLocale(maybeLang)) return maybeLang;
  } catch {
    // keep default
  }

  return defaultLocale;
}

async function isAlreadyOnSubscription(): Promise<boolean> {
  const h = await headers();
  const referer = h.get("referer") ?? h.get("x-url") ?? "";
  if (!referer) return false;

  try {
    return new URL(referer).pathname.includes("/subscription");
  } catch {
    return false;
  }
}

/** Redirects to /[lang]/subscription when API says subscription is required. */
export async function redirectToSubscriptionIfNeeded(payload: {
  message?: string | null;
  error?: string | null;
  errorMessages?: unknown;
}): Promise<void> {
  if (!isSubscriptionRequiredError(payload)) return;
  if (await isAlreadyOnSubscription()) return;

  const lang = await resolveLocaleFromHeaders();
  redirect(`/${lang}/subscription?required=1`);
}
