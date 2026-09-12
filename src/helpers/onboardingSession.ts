import { cookies } from "next/headers";
import { ONBOARDING_COOKIE } from "./onboardingCookie";

export { ONBOARDING_COOKIE, isOnboardingIncompleteFlag } from "./onboardingCookie";

export async function setOnboardingCompleteCookie(complete: boolean) {
  const store = await cookies();
  store.set(ONBOARDING_COOKIE, complete ? "true" : "false", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}
