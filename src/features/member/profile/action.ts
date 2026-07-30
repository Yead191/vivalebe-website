"use server";

import { myFetch } from "@/helpers/myFetch";
import type { User } from "@/lib/types";

export async function getUserById(id: string): Promise<User | null> {
  try {
    const res = await myFetch(`/user/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.success || !res.data) return null;

    const u = res.data;
    return {
      id: u._id || u.id,
      username: u.name || u.username || "",
      displayName: u.name || u.displayName || "",
      age: 0,
      gender: u.gender || "M",
      city: "",
      state: "",
      country: u.nationality || "",
      image: u.profile || u.image || "",
      avatarSeed: u.profile || u.image || u.name || u.displayName || "user",
      coverSeed: u.profile || u.image || "/image.png",
      verified: !!u.verified,
      premium: !!u.premiumMembership,
      online: false,
      willingToFly: false,
      headline: u.bio || "",
      bio: u.bio || "",
      ethnicity: "",
      height: u.height ? String(u.height) : "",
      bodyType: "",
      livingWith: "",
      relationshipStatus: u.relationStatus || "",
      religion: "",
      photos: u.profile || u.image ? [u.profile || u.image] : [],
      privatePhotosCount: 0,
      isLiked: !!u.isLiked,
      isWinked: !!u.isWinked,
      winkId: u.winkId || undefined,
    } as User;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}
