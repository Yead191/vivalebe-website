"use server";
import { catchServerError } from "@/helpers/catchServerError";
import { myFetch } from "@/helpers/myFetch";
import { userFromProfilePayload } from "./mapUser";
import type { User } from "@/lib/types";

export async function getUserById(
  id: string,
  options?: { skipSubscriptionRedirect?: boolean },
): Promise<User | null> {
  try {
    const res = await myFetch(`/user/${id}`, {
      method: "GET",
      cache: "no-store",
      skipSubscriptionRedirect: options?.skipSubscriptionRedirect,
    });

    if (!res.success || !res.data) return null;
    return userFromProfilePayload(res.data);
  } catch (error) {
    return catchServerError(error, "Error fetching user profile:", null);
  }
}
