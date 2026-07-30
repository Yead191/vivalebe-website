"use server";

import { myFetch } from "@/helpers/myFetch";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function forgotPasswordAction(data: Record<string, any>) {
  const res = await myFetch("/auth/forgot-password", {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function resetPasswordAction(data: Record<string, any>, token: string) {
  const res = await myFetch("/auth/reset-password", {
    method: "POST",
    body: data,
    token: token,
  });

  return res;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function verifyOtpAction(data: Record<string, any>) {
  const res = await myFetch("/auth/verify-email", {
    method: "POST",
    body: data,
  });

  return res;
}
