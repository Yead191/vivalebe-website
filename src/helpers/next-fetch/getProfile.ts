"use server";

import { cookies } from "next/headers";

const getProfile = async (): Promise<any | null> => {
  const token = (await cookies()).get("accessToken")?.value;

  if (!token) return null;
  const res = await fetch(`${process.env.BASE_URL}/user/profile`, {
    next: {
      tags: ["user-profile"],
    },
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const { data } = await res?.json();

  return data;
};

export default getProfile;
