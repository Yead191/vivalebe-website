"use server";

import { myFetch } from "@/helpers/myFetch";

export async function changePasswordAction(data: Record<string, any>) {
  const res = await myFetch("/auth/change-password", {
    method: "POST",
    body: data,
  });

  return res;
}
