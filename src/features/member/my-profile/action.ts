"use server";
import { catchServerError } from "@/helpers/catchServerError";
import { myFetch } from "@/helpers/myFetch";
import { albumFromResponse } from "./albumMap";

function albumIdFrom(data: unknown): string | null {
  const album = albumFromResponse(data);
  if (!album) return null;
  return album._id || album.id || null;
}

function isAlbumMissing(res: { success?: boolean; message?: string; error?: string | null }) {
  if (res.success) return false;
  const text = [res.message, res.error].filter(Boolean).join(" ");
  return /private album not found/i.test(text);
}

export async function getPrivateAlbum() {
  try {
    const res = await myFetch("/private-albums", {
      method: "GET",
      cache: "no-store",
    });
    return res;
  } catch (error) {
    return catchServerError(error, "Error fetching private album:", {
      success: false,
      data: null,
      message: "Error fetching private album",
      error: "Error fetching private album",
    });
  }
}

export async function createPrivateAlbum(formData: FormData) {
  try {
    const res = await myFetch("/private-albums", {
      method: "POST",
      body: formData,
    });
    return res;
  } catch (error) {
    return catchServerError(error, "Error creating private album:", {
      success: false,
      data: null,
      message: "Error creating private album",
      error: "Error creating private album",
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function patchPrivateAlbum(id: string, data: FormData | Record<string, any>) {
  try {
    const res = await myFetch(`/private-albums/${id}`, {
      method: "PATCH",
      body: data,
    });
    return res;
  } catch (error) {
    return catchServerError(error, "Error updating private album:", {
      success: false,
      data: null,
      message: "Error updating private album",
      error: "Error updating private album",
    });
  }
}

export async function savePrivateAlbum(formData: FormData) {
  try {
    const existing = await getPrivateAlbum();
    const existingId = albumIdFrom(existing.data);

    if (existing.success && existingId) {
      return patchPrivateAlbum(existingId, formData);
    }

    if (!existing.success && !isAlbumMissing(existing) && existing.message) {
      return existing;
    }

    return createPrivateAlbum(formData);
  } catch (error) {
    return catchServerError(error, "Error saving private album:", {
      success: false,
      data: null,
      message: "Error saving private album",
      error: "Error saving private album",
    });
  }
}
