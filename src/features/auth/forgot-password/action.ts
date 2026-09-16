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
