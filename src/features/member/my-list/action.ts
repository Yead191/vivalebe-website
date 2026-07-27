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

export async function getMutualMatches(searchQuery?: string): Promise<User[]> {
  try {
    let url = "/user/matches";
    if (searchQuery) {
      url += `?name=${encodeURIComponent(searchQuery)}`;
    }
    const res = await myFetch(url, {
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
      const u = item.fromUser || item.user || item;
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
