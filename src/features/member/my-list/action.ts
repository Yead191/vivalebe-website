"use server";

import { myFetch } from "@/helpers/myFetch";
import type { User } from "@/lib/types";

export async function getYouLikedUsers(): Promise<User[]> {
  try {
    const res = await myFetch("/swipe/you-liked", {
      method: "GET",
      cache: "no-store",
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
        avatarSeed: to.profile || to.name || "user",
        coverSeed: to.profile || "/image.png",
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
        winkId: item.winkId || item._id, // _id might be the swipe id, but just in case
        isWinked: !!(
          item.isWink ||
          item.isWinked ||
          item.winked ||
          to.isWink ||
          to.isWinked ||
          to.winked
        ),
        isLiked: true,
      } as User;
    });
  } catch (error) {
    console.error("Error fetching you-liked:", error);
    return [];
  }
}

export async function getLikesYouUsers(): Promise<User[]> {
  try {
    const res = await myFetch("/swipe/likes-you", {
      method: "GET",
      cache: "no-store",
    });

    if (!res.success || !res.data) return [];

    return res.data.map((item: any) => {
      const from = item.fromUser;
      return {
        id: from._id,
        username: from.name,
        displayName: from.name,
        age: 0,
        gender: "M",
        city: "",
        state: "",
        country: from.nationality || "",
        image: from.profile,
        avatarSeed: from.profile || from.name || "user",
        coverSeed: from.profile || "/image.png",
        verified: false,
        premium: false,
        online: false,
        willingToFly: false,
        headline: from.bio || "",
        bio: from.bio || "",
        ethnicity: "",
        height: from.height ? String(from.height) : "",
        bodyType: "",
        livingWith: "",
        relationshipStatus: from.relationStatus || "",
        religion: "",
        photos: from.profile ? [from.profile] : [],
        privatePhotosCount: 0,
      } as User;
    });
  } catch (error) {
    console.error("Error fetching likes-you:", error);
    return [];
  }
}

export async function getViewedYouUsers(): Promise<User[]> {
  try {
    const res = await myFetch("/view-me", {
      method: "GET",
      cache: "no-store",
    });

    if (!res.success || !res.data) return [];

    return res.data.map((item: any) => {
      const u = item.viewedUser;
      return {
        id: u._id,
        username: u.name,
        displayName: u.name,
        age: 0,
        gender: "M",
        city: "",
        state: "",
        country: u.nationality || "",
        image: u.profile,
        avatarSeed: u.profile || u.name || "user",
        coverSeed: u.profile || "/image.png",
        verified: false,
        premium: false,
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
        photos: u.profile ? [u.profile] : [],
        privatePhotosCount: 0,
      } as User;
    });
  } catch (error) {
    console.error("Error fetching view-me:", error);
    return [];
  }
}

export interface MatchSearchFilters {
  lookingFor?: string;
  country?: string;
  state?: string;
  ageFrom?: number | string;
  ageTo?: number | string;
  name?: string;
  displayName?: string;
}

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

function buildMatchesUrl(filters?: MatchSearchFilters | string): string {
  const params = new URLSearchParams();

  if (typeof filters === "string") {
    if (filters.trim()) params.set("name", filters.trim());
  } else if (filters) {
    if (filters.lookingFor) params.set("lookingFor", filters.lookingFor);
    if (filters.country) params.set("country", filters.country);
    if (filters.state) params.set("state", filters.state);
    if (filters.ageFrom != null && filters.ageFrom !== "") {
      params.set("ageFrom", String(filters.ageFrom));
    }
    if (filters.ageTo != null && filters.ageTo !== "") {
      params.set("ageTo", String(filters.ageTo));
    }
    if (filters.name) params.set("name", filters.name);
    if (filters.displayName) params.set("displayName", filters.displayName);
  }

  const qs = params.toString();
  return qs ? `/user/matches?${qs}` : "/user/matches";
}

function mapMatchUser(item: any): User {
  const u =
    item.matchedUser || item.user || item.toUser || item.fromUser || item;
  const profile = u.profile || u.image || "";
  const name = u.name || u.displayName || u.username || "User";

  return {
    id: u._id || u.id,
    username: u.name || u.username || name,
    displayName: u.displayName || u.name || name,
    age: calcAge(u.DOB),
    gender: mapGender(u.gender),
    city: u.state || "",
    state: u.state || "",
    country: u.country || u.nationality || "",
    image: profile,
    avatarSeed: profile || name,
    coverSeed: profile || "/image.png",
    verified: !!(u.verified || u.isAdminVerified),
    premium: !!(u.premiumMembership || u.premium),
    online: false,
    willingToFly: false,
    headline: u.bio || "",
    bio: u.bio || "",
    ethnicity: "",
    height: u.height != null ? String(u.height) : "",
    bodyType: "",
    livingWith: u.livingWith || "",
    relationshipStatus: u.relationStatus || "",
    religion: "",
    photos: profile ? [profile] : [],
    privatePhotosCount: 0,
    education: u.education || "",
    weight: u.weight != null ? String(u.weight) : "",
    isWinked: !!(
      item.isWink ||
      item.isWinked ||
      item.winked ||
      u.isWink ||
      u.isWinked ||
      u.winked
    ),
    isLiked: !!(item.isLiked || item.liked || u.isLiked || u.liked),
  } as User;
}

export async function getMutualMatches(
  searchQuery?: MatchSearchFilters | string,
): Promise<User[]> {
  try {
    const res = await myFetch(buildMatchesUrl(searchQuery), {
      method: "GET",
      cache: "no-store",
    });

    if (!res.success || !res.data) return [];

    return res.data.map((item: any) => {
      const u =
        item.matchedUser || item.user || item.toUser || item.fromUser || item;
      return {
        id: u._id || u.id,
        username: u.name || u.username,
        displayName: u.name || u.displayName,
        age: 0,
        gender: "M",
        city: "",
        state: "",
        country: u.nationality || "",
        image: u.profile || u.image || "",
        avatarSeed: u.profile || u.image || u.name || u.displayName || "user",
        coverSeed: u.profile || u.image || "/image.png",
        verified: false,
        premium: false,
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
        isWinked: !!(
          item.isWink ||
          item.isWinked ||
          item.winked ||
          u.isWink ||
          u.isWinked ||
          u.winked
        ),
        isLiked: true, // Mutual matches implies you liked them
      } as User;
    });
  } catch (error) {
    console.error("Error fetching mutual matches:", error);
    return [];
  }
}

export async function getWinks(): Promise<User[]> {
  try {
    const res = await myFetch("/winks", {
      method: "GET",
      cache: "no-store",
    });

    if (!res.success || !res.data) return [];

    return res.data.map((item: any) => {
      // Based on user feedback, show the receiverId
      const u = item.receiverId || item.fromUser || item.user || item;
      return {
        id: u._id || u.id,
        username: u.name || u.username,
        displayName: u.name || u.displayName,
        age: 0,
        gender: "M",
        city: "",
        state: "",
        country: u.nationality || "",
        image: u.profile || u.image || "",
        avatarSeed: u.profile || u.image || u.name || u.displayName || "user",
        coverSeed: u.profile || u.image || "/image.png",
        verified: false,
        premium: false,
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
        winkId: item._id || item.id,
        isWinked: item.isWinked || item.isMatch || false,
      } as User;
    });
  } catch (error) {
    console.error("Error fetching winks:", error);
    return [];
  }
}

export async function createChatRoom(userId: string) {
  try {
    const res = await myFetch(`/chat/${userId}`, {
      method: "POST",
      body: { chatType: "single" },
    });
    return res;
  } catch (error) {
    console.error("Error creating chat room:", error);
    return { success: false, data: null };
  }
}

export async function sendWink(receiverId: string) {
  try {
    const res = await myFetch("/winks", {
      method: "POST",
      body: { receiverId },
    });
    return res;
  } catch (error) {
    console.error("Error sending wink:", error);
    return { success: false, message: "Failed to send wink" };
  }
}

export async function acceptWink(winkId: string) {
  try {
    const res = await myFetch(`/winks/${winkId}`, {
      method: "PATCH",
      body: { isMatch: true },
    });

    // If PATCH fails due to method, try PUT
    if (
      !res.success &&
      res.message?.toLowerCase().includes("method not allowed")
    ) {
      return await myFetch(`/winks/${winkId}`, {
        method: "PUT",
        body: { isMatch: true },
      });
    }

    return res;
  } catch (error) {
    console.error("Error accepting wink:", error);
    return { success: false, message: "Failed to accept wink" };
  }
}

export async function getPrivateAlbumRequests(): Promise<User[]> {
  try {
    const res = await myFetch("/private-file-access", {
      method: "GET",
      cache: "no-store",
    });

    if (!res.success || !res.data) return [];

    return res.data.map((item: any) => {
      // The user wants to show `providedUserId` in the list
      const u = item.providedUserId;
      return {
        id: u._id || u.id,
        username: u.name || u.username,
        displayName: u.name || u.displayName,
        age: 0,
        gender: "M",
        city: "",
        state: "",
        country: u.nationality || "",
        image: u.profile || u.image || "",
        avatarSeed: u.profile || u.image || u.name || u.displayName || "user",
        coverSeed: u.profile || u.image || "/image.png",
        verified: false,
        premium: false,
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
        privateAlbumRequestId: item._id,
      } as User;
    });
  } catch (error) {
    console.error("Error fetching private album requests:", error);
    return [];
  }
}

export async function respondToPrivateAlbumRequest(
  requestId: string,
  isAccessGranted: boolean,
) {
  try {
    const res = await myFetch(`/private-file-access/${requestId}`, {
      method: "PATCH",
      body: {
        isAccessGranted,
      },
    });
    return res;
  } catch (error) {
    console.error("Error responding to private album request:", error);
    return { success: false, message: "Failed to respond" };
  }
}

export async function getPrivateAlbumAccess(): Promise<User[]> {
  try {
    const res = await myFetch("/private-file-access/granted", {
      method: "GET",
      cache: "no-store",
    });

    if (!res.success || !res.data) return [];

    return res.data.map((item: any) => {
      // The person who provided the access or the person who requested it
      const u = item.providedUserId || item.requestedUserId;
      return {
        id: u._id || u.id,
        username: u.name || u.username,
        displayName: u.name || u.displayName,
        age: 0,
        gender: "M",
        city: "",
        state: "",
        country: u.nationality || "",
        image: u.profile || u.image || "",
        avatarSeed: u.profile || u.image || u.name || u.displayName || "user",
        coverSeed: u.profile || u.image || "/image.png",
        verified: false,
        premium: false,
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
        privateAlbumRequestId: item._id,
      } as User;
    });
  } catch (error) {
    console.error("Error fetching private album access:", error);
    return [];
  }
}

export async function swipeUser(
  toUser: string,
  action: "like" | "dislike" = "like",
) {
  try {
    const res = await myFetch("/swipe", {
      method: "POST",
      body: {
        toUser,
        action,
      },
    });
    return res;
  } catch (error) {
    console.error("Error swiping user:", error);
    return { success: false, message: "Failed to swipe" };
  }
}

export async function blockUser(blockedUserId: string) {
  try {
    const res = await myFetch("/block", {
      method: "POST",
      body: {
        blockedUserId,
      },
    });
    return res;
  } catch (error) {
    console.error("Error blocking user:", error);
    return { success: false, message: "Failed to block user" };
  }
}

export async function hideUser(userId: string) {
  try {
    const res = await myFetch("/block/hide", {
      method: "POST",
      body: {
        userId,
      },
    });
    return res;
  } catch (error) {
    console.error("Error hiding user:", error);
    return { success: false, message: "Failed to hide user" };
  }
}
