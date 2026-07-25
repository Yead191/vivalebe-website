"use server";

import { myFetch } from "@/helpers/myFetch";

export async function verifyEmailAction(data: Record<string, any>) {
  const res = await myFetch("/auth/verify-email", {
    method: "POST",
    body: data,
  });

  return res;
}
