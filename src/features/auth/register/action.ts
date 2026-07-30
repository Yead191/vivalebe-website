"use server";

import { myFetch } from "@/helpers/myFetch";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function registerAction(data: Record<string, any>) {
  const res = await myFetch("/user", {
    method: "POST",
    body: data,
  });

  return res;
}
