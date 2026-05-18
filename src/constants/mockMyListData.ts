export const DEFAULT_TAB = "likes-you";

export const VALID_TABS = [
  "likes-you",
  "viewed-you",
  "winked-at-you",
  "mutual",
  "you-likes",
  "private-album-access",
  "private-album-requests",
] as const;

export type MyListTab = (typeof VALID_TABS)[number];

export function isValidTab(tab: string): tab is MyListTab {
  return (VALID_TABS as readonly string[]).includes(tab);
}

export const TAB_USER_IDS: Record<MyListTab, string[]> = {
  "likes-you": ["u_maya", "u_beatriz", "u_olivia", "u_camila"],
  "viewed-you": ["u_camila", "u_sofia", "u_helena", "u_larissa", "u_aurora"],
  "winked-at-you": ["u_maya", "u_sofia", "u_aurora"],
  "mutual": ["u_beatriz", "u_olivia"],
  "you-likes": ["u_aurora", "u_camila", "u_beatriz", "u_olivia", "u_maya"],
  "private-album-access": ["u_maya", "u_larissa"],
  "private-album-requests": ["u_sofia", "u_helena", "u_camila"],
};

export const TAB_BADGE_COUNTS: Record<string, number> = {
  "viewed-you": 4,
  "likes-you": 2,
};
