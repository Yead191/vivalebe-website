"use server";

import { myFetch } from "@/helpers/myFetch";

export async function getSearchHistory() {
  const res = await myFetch("/search", {
    method: "GET",
    cache: "no-store",
  });
  return res;
}
