"use server";

import { myFetch } from "@/helpers/myFetch";

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

export async function updateProfileAction(formData: FormData) {
  const res = await myFetch("/user", {
    method: "PATCH",
    body: formData,
  });

  return res;
}
