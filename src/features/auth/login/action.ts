"use server";

import { myFetch } from "@/helpers/myFetch";
import { cookies } from "next/headers";
import { z } from "zod";

export async function loginAction(data: Record<string, any>) {
  const res = await myFetch("/auth/login", {
    method: "POST",
    body: data,
  });

  if (res.success && res.data) {
    const cookieStore = await cookies();
    cookieStore.set("accessToken", res.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    if (res.data.refreshToken) {
      cookieStore.set("refreshToken", res.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }
  }

  return res;
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  return { success: true };
}
