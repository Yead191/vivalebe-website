"use server";
import { catchServerError } from "@/helpers/catchServerError";

import { myFetch } from "@/helpers/myFetch";
import type { User } from "@/lib/types";

export type SwipeActionType = "like" | "reject";

export interface SwipeFeedResult {
  users: User[];
  pagination: {
    total: number;
    limit: number;
    page: number;
    totalPage: number;
  };
}

function mapSwipeUser(u: Record<string, unknown>): User {
  const profile = (u.profile as string) || "";
  const name = (u.name as string) || "User";
  const height = u.height != null ? String(u.height) : "";
  const weight = u.weight != null ? String(u.weight) : "";

  return {
    id: (u._id as string) || (u.id as string) || "",
    username: name,
    displayName: name,
    age: typeof u.age === "number" ? u.age : 0,
    gender: "M",
    city: "",
    state: "",
    country: (u.nationality as string) || "",
    image: profile,
    avatarSeed: profile || name,
    coverSeed: profile || "/image.png",
    verified: false,
    premium: false,
    online: false,
    willingToFly: false,
    headline: (u.bio as string) || "",
    bio: (u.bio as string) || "",
    ethnicity: "",
    height,
    bodyType: "",
    livingWith: "",
    relationshipStatus: (u.relationStatus as string) || "",
    religion: "",
    photos: profile ? [profile] : [],
    privatePhotosCount: 0,
    education: (u.education as string) || "",
    weight,
  };
}

export async function getSwipeFeed(
  page = 1,
  limit = 10,
): Promise<SwipeFeedResult> {
  try {
    const res = await myFetch(`/swipe?page=${page}&limit=${limit}`, {
      method: "GET",
      cache: "no-store",
      tags: ["swipe-feed"],
    });

    if (!res.success || !res.data) {
      return {
        users: [],
        pagination: { total: 0, limit, page, totalPage: 0 },
      };
    }

    const users = (Array.isArray(res.data) ? res.data : []).map(mapSwipeUser);

    return {
      users,
      pagination: {
        total: res.pagination?.total ?? users.length,
        limit: res.pagination?.limit ?? limit,
        page: res.pagination?.page ?? page,
        totalPage: res.pagination?.totalPage ?? 1,
      },
    };
  } catch (error) {
    return catchServerError(error, "Error fetching swipe feed:", {
      users: [],
      pagination: { total: 0, limit, page, totalPage: 0 },
    });
  }
}

export async function swipeAction(toUser: string, action: SwipeActionType) {
  try {
    const res = await myFetch("/swipe", {
      method: "POST",
      body: { toUser, action },
    });
    return res;
  } catch (error) {
    return catchServerError(error, "Error posting swipe:", { success: false, message: "Failed to swipe" });
  }
}
