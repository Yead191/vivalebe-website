"use server";

import { myFetch } from "@/helpers/myFetch";

export async function getNotifications() {
  try {
    const res = await myFetch("/notifications", {
      method: "GET",
      cache: "no-store",
    });

    if (!res.success || !res.data) return [];

    return res.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}
