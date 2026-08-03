"use server";
import { catchServerError } from "@/helpers/catchServerError";

import { myFetch } from "@/helpers/myFetch";
import type { User } from "@/lib/types";

function calcAge(dob?: string): number {
  if (!dob) return 0;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return 0;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age > 0 ? age : 0;
}

function mapGender(value?: string): User["gender"] {
  const v = (value || "").toUpperCase();
  if (v === "FEMALE" || v === "W" || v === "WOMAN") return "W";
  if (v === "COUPLE" || v === "C") return "C";
  return "M";
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const res = await myFetch(`/user/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.success || !res.data) return null;

    const data = res.data as Record<string, unknown>;
    const u = (
      Array.isArray(data)
        ? data[0]
        : data.user || data.toUser || data.matchedUser || data
    ) as Record<string, unknown> | null;

    if (!u || (!u._id && !u.id)) return null;

    const profile = String(u.profile || u.image || "");
    const name = String(u.name || u.displayName || u.username || "User");

    return {
      id: String(u._id || u.id),
      username: String(u.username || u.name || name),
      displayName: String(u.displayName || u.name || name),
      age:
        typeof u.age === "number"
          ? u.age
          : calcAge(typeof u.DOB === "string" ? u.DOB : undefined),
      gender: mapGender(typeof u.gender === "string" ? u.gender : undefined),
      city: String(u.state || u.city || ""),
      state: String(u.state || ""),
      country: String(u.country || u.nationality || ""),
      image: profile,
      avatarSeed: profile || name,
      coverSeed: profile || "/image.png",
      verified: !!(u.verified || u.isAdminVerified),
      premium: !!(u.premiumMembership || u.premium),
      online: false,
      willingToFly: false,
      headline: String(u.bio || ""),
      bio: String(u.bio || ""),
      ethnicity: "",
      height: u.height != null ? String(u.height) : "",
      bodyType: "",
      livingWith: String(u.livingWith || ""),
      relationshipStatus: String(u.relationStatus || ""),
      religion: "",
      photos: profile ? [profile] : [],
      privatePhotosCount: 0,
      education: String(u.education || ""),
      weight: u.weight != null ? String(u.weight) : "",
      isLiked: !!u.isLiked,
      isWinked: !!u.isWinked,
      winkId: typeof u.winkId === "string" ? u.winkId : undefined,
    } as User;
  } catch (error) {
    return catchServerError(error, "Error fetching user profile:", null);
  }
}
