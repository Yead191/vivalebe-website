import { getUserById } from "./users";

export const CURRENT_USER_ID = "u_lucas";

export function getCurrentUser() {
  const user = getUserById(CURRENT_USER_ID);
  if (!user) throw new Error("Current mock user is missing");
  return user;
}

export function getCurrentViewedCount(): number {
  return 6;
}
