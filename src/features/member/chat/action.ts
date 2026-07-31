"use server";
import { catchServerError } from "@/helpers/catchServerError";

import { myFetch } from "@/helpers/myFetch";
import { getProfileAction } from "@/features/member/settings/action";

export async function getChatList() {
  try {
    const [profileRes, chatRes] = await Promise.all([
      getProfileAction(),
      myFetch("/chat/", { method: "GET", cache: "no-store" }),
    ]);

    const currentUserId = profileRes?.data?._id || profileRes?.data?.id || "";

    const chats = chatRes?.success && chatRes?.data ? chatRes.data : [];

    return { currentUserId, chats };
  } catch (error) {
    return catchServerError(error, "Error fetching chat list:", { currentUserId: "", chats: [] });
  }
}
