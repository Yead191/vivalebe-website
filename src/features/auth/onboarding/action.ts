"use server";

import { myFetch } from "@/helpers/myFetch";
import { setOnboardingCompleteCookie } from "@/helpers/onboardingSession";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function submitOnboardingAction(data: Record<string, any>) {
  const res = await myFetch("/user/onboarding", {
    method: "PATCH",
    body: data,
  });

  if (res.success) {
    await setOnboardingCompleteCookie(true);
  }

  return res;
}

export async function markOnboardingCompleteAction() {
  await setOnboardingCompleteCookie(true);
}
