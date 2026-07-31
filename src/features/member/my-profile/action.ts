"use server";
import { catchServerError } from "@/helpers/catchServerError";

import { myFetch } from "@/helpers/myFetch";

export async function getPrivateAlbum() {
  try {
    const res = await myFetch("/private-albums", {
      method: "GET",
      cache: "no-store",
    });
    return res;
  } catch (error) {
    return catchServerError(error, "Error fetching private album:", { success: false, data: null });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function patchPrivateAlbum(id: string, data: any) {
  try {
    const res = await myFetch(`/private-albums/${id}`, {
      method: "PATCH",
      body: data,
    });
    return res;
  } catch (error) {
    return catchServerError(error, "Error updating private album:", { success: false, message: "Error updating private album" });
  }
}
