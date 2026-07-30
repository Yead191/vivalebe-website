"use server";

import { myFetch } from "@/helpers/myFetch";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function submitOnboardingAction(data: Record<string, any>) {
  const res = await myFetch("/user/onboarding", {
    method: "PATCH",
    body: data,
  });

  return res;
}
