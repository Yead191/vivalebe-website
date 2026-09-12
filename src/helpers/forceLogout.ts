import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { defaultLocale, isLocale } from "@/i18n/config";
import { ONBOARDING_COOKIE } from "./onboardingCookie";

async function getRequestLocale(): Promise<string> {
  const h = await headers();
  const fromHeader = h.get("x-locale");
  if (fromHeader && isLocale(fromHeader)) return fromHeader;

  const referer = h.get("referer") ?? h.get("x-url") ?? "";
  if (referer) {
    try {
      const maybeLang = new URL(referer).pathname.split("/").filter(Boolean)[0];
      if (maybeLang && isLocale(maybeLang)) return maybeLang;
    } catch {
      // keep default
    }
  }

  return defaultLocale;
}

export async function clearAuthCookies(): Promise<void> {
  try {
    const store = await cookies();
    store.delete("accessToken");
    store.delete("refreshToken");
    store.delete(ONBOARDING_COOKIE);
  } catch {
    // Cookie mutation is not always allowed during RSC render
  }
}

export async function forceLogoutAndRedirectToLogin(): Promise<never> {
  await clearAuthCookies();
  const lang = await getRequestLocale();
  redirect(`/${lang}/auth/login`);
}
