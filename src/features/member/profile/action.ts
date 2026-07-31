"use server";
import { catchServerError } from "@/helpers/catchServerError";

import { myFetch } from "@/helpers/myFetch";
import type { User } from "@/lib/types";

export async function getUserById(id: string): Promise<User | null> {
  try {
    const res = await myFetch(`/user/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.success || !res.data) return null;

    const u = Array.isArray(res.data) ? res.data[0] : (res.data?.user || res.data?.toUser || res.data?.matchedUser || res.data);
    
    // Debug to file
    const fs = require("fs");
    fs.writeFileSync("d:/Mijan/1. Development/10.vivalebe-website/debug-api-res.json", JSON.stringify(res, null, 2));
    
    // If we still can't find an id, maybe res.data is actually missing it or it's further nested
    console.log("Extracted user id:", u?._id || u?.id);
    
    if (!u || (!u._id && !u.id)) {
      console.log("Could not find user ID in response:", res.data);
      return null;
    }
    
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
    return catchServerError(error, "Error fetching user profile:", null);
  }
}
