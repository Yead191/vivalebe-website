"use server";

import { myFetch } from "@/helpers/myFetch";

export async function forgotPasswordAction(data: Record<string, any>) {
  const res = await myFetch("/auth/forgot-password", {
    method: "POST",
    body: data,
  });

  return res;
}

export async function resendOtpAction(data: Record<string, any>) {
  const res = await myFetch("/auth/resend-otp", {
    method: "POST",
    body: data,
  });

  return res;
}

export async function resetPasswordAction(data: Record<string, any>, token: string) {
  const res = await myFetch("/auth/reset-password", {
    method: "POST",
    body: data,
    token: token,
  });

  return res;
}

export async function verifyOtpAction(data: Record<string, any>) {
  const res = await myFetch("/auth/verify-email", {
    method: "POST",
    body: data,
  });

  return res;
}
