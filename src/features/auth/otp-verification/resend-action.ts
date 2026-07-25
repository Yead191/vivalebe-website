"use server";

import { myFetch } from "@/helpers/myFetch";

export async function resendOtpAction(data: Record<string, any>) {
  const res = await myFetch("/auth/resend-otp", {
    method: "POST",
    body: data,
  });

  return res;
}
