"use server";

import { myFetch } from "@/helpers/myFetch";

export async function getNotifications() {
  try {
    const res = await myFetch("/notification", {
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

export async function markNotificationAsRead(id: string) {
  try {
    const res = await myFetch(`/notification/${id}`, {
      method: "PATCH",
      cache: "no-store",
    });
    return res;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false };
  }
}
