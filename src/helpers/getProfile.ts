"use server";

import { cookies } from "next/headers";
import { forceLogoutAndRedirectToLogin } from "./forceLogout";
import { isAccessTokenExpired, isSessionExpiredApiError } from "./tokenExpiry";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProfile = async (): Promise<any | null> => {
  const token = (await cookies()).get("accessToken")?.value;

  if (!token) return null;
  if (isAccessTokenExpired(token)) {
    await forceLogoutAndRedirectToLogin();
  }

  const res = await fetch(`${process.env.BASE_URL}/user/profile`, {
    next: {
      tags: ["user-profile"],
    },
    cache: "force-cache",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const json = await res.json();
  if (isSessionExpiredApiError(res.status, json)) {
    await forceLogoutAndRedirectToLogin();
  }

  return json?.data;
};

export default getProfile;
