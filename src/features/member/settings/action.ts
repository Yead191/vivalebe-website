"use server";

import { myFetch } from "@/helpers/myFetch";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function changePasswordAction(data: Record<string, any>) {
  const res = await myFetch("/auth/change-password", {
    method: "POST",
    body: data,
  });

  return res;
}

export async function getProfileAction() {
  const res = await myFetch("/user/profile", {
    method: "GET",
    cache: "no-store",
  });

  return res;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateProfileAction(data: FormData | Record<string, any>) {
  let body: any = data;
  if (!(data instanceof FormData) && typeof data === "object" && data !== null) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { protectedImages, ...cleanData } = data;
    body = cleanData;
  }

  const res = await myFetch("/user", {
    method: "PATCH",
    body,
  });

  return res;
}

export async function verifyProfileAction(formData: FormData) {
  const res = await myFetch("/user/verify", {
    method: "PATCH",
    body: formData,
  });

  return res;
}

export async function getHiddenMembers() {
  const res = await myFetch("/block/hide", {
    method: "GET",
    cache: "no-store",
  });
  return res;
}

export async function getBlockedMembers() {
  const res = await myFetch("/block", {
    method: "GET",
    cache: "no-store",
  });
  return res;
}

export async function unhideUser(id: string) {
  const res = await myFetch(`/block/hide/${id}`, {
    method: "DELETE",
  });
  return res;
}

export async function unblockUser(id: string) {
  const res = await myFetch(`/block/${id}`, {
    method: "DELETE",
  });
  return res;
}
