"use server";

import { myFetch } from "@/helpers/myFetch";

export async function submitOnboardingAction(data: Record<string, any>) {
  const res = await myFetch("/user/onboarding", {
    method: "PATCH",
    body: data,
  });

  return res;
}
