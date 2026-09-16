"use server";

import { myFetch } from "@/helpers/myFetch";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function resetPasswordAction(
  data: Record<string, any>,
  token: string,
) {
  const res = await myFetch("/auth/reset-password", {
    method: "POST",
    body: data,
    headers: {
      Authorization: token,
    },
  });

  return res;
}
