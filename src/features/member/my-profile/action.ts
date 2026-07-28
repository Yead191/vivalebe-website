"use server";

import { myFetch } from "@/helpers/myFetch";

export async function getPrivateAlbum() {
  try {
    const res = await myFetch("/private-albums", {
      method: "GET",
      cache: "no-store",
    });
    return res;
  } catch (error) {
    console.error("Error fetching private album:", error);
    return { success: false, data: null };
  }
}

export async function patchPrivateAlbum(id: string, data: any) {
  try {
    const res = await myFetch(`/private-albums/${id}`, {
      method: "PATCH",
      body: data,
    });
    return res;
  } catch (error) {
    console.error("Error updating private album:", error);
    return { success: false, message: "Error updating private album" };
  }
}
