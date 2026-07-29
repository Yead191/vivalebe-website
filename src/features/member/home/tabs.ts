export type HomeTab = "videos" | "moments" | "connections";

const HOME_TABS: HomeTab[] = ["videos", "moments", "connections"];

export function parseHomeTab(tab?: string | null): HomeTab {
  if (tab && HOME_TABS.includes(tab as HomeTab)) return tab as HomeTab;
  return "videos";
}
