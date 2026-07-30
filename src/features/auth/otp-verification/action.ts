"use server";

import { myFetch } from "@/helpers/myFetch";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function verifyEmailAction(data: Record<string, any>) {
  const res = await myFetch("/auth/verify-email", {
    method: "POST",
    body: data,
  });

  return res;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function resendOtpAction(data: Record<string, any>) {
  const res = await myFetch("/auth/resend-otp", {
    method: "POST",
    body: data,
  });

  return res;
}
