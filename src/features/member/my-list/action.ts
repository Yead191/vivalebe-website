"use server";

import { myFetch } from "@/helpers/myFetch";
import type { User } from "@/lib/types";

export async function getYouLikedUsers(): Promise<User[]> {
  try {
    const res = await myFetch("/swipe/you-liked", {
      method: "GET",
    });

    if (!res.success || !res.data) return [];

    return res.data.map((item: any) => {
      const to = item.toUser;
      return {
        id: to._id,
        username: to.name,
        displayName: to.name,
        age: 0,
        gender: "M",
        city: "",
        state: "",
        country: to.nationality || "",
        image: to.profile,
        avatarSeed: to.name,
        coverSeed: to.name,
        verified: false,
        premium: false,
        online: false,
        willingToFly: false,
        headline: to.bio || "",
        bio: to.bio || "",
        ethnicity: "",
        height: to.height ? String(to.height) : "",
        bodyType: "",
        livingWith: "",
        relationshipStatus: to.relationStatus || "",
        religion: "",
        photos: to.profile ? [to.profile] : [],
        privatePhotosCount: 0,
      } as User;
    });
  } catch (error) {
    console.error("Error fetching you-liked:", error);
    return [];
  }
}
