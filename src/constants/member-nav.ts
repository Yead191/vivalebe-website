import type { Dictionary } from "@/i18n/dictionaries";

export interface MemberNavChild {
  labelKey: keyof Dictionary["nav"];
  href: string;
  premiumLocked?: boolean;
}

export interface MemberNavItem {
  labelKey: keyof Dictionary["nav"];
  href: string;
  children?: MemberNavChild[];
}

export const memberNav: MemberNavItem[] = [
  { labelKey: "home", href: "/myHome" },
  {
    labelKey: "discover",
    href: "/discover",
    children: [
      { labelKey: "discoverUserName", href: "/discover?from=username" },
      { labelKey: "discoverSavedSearch", href: "/discover?from=saved", premiumLocked: true },
    ],
  },
  {
    labelKey: "community",
    href: "/flame",
    children: [
      { labelKey: "communityFlame", href: "/flame" },
      { labelKey: "communityBlog", href: "/blog" },
      { labelKey: "communityEvents", href: "/events" },
    ],
  },
  {
    labelKey: "myList",
    href: "/my-list?tab=likes-you",
    children: [
      { labelKey: "myListLikesYou", href: "/my-list?tab=likes-you" },
      { labelKey: "myListViewedYou", href: "/my-list?tab=viewed-you" },
      { labelKey: "myListWinkedAtYou", href: "/my-list?tab=winked-at-you" },
      { labelKey: "myListMutualMatches", href: "/my-list?tab=mutual" },
      { labelKey: "myListYouLikes", href: "/my-list?tab=you-likes" },
      { labelKey: "myListPrivateAlbumAccess", href: "/my-list?tab=private-album-access" },
      { labelKey: "myListPrivateAlbumRequest", href: "/my-list?tab=private-album-requests" },
    ],
  },
  { labelKey: "chat", href: "/chat" },
];
