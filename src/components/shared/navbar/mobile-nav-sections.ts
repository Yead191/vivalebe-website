import type { Dictionary } from "@/i18n/dictionaries";

export type MobileNavLink = {
  href: string;
  label: string;
  locked?: boolean;
};

export type MobileNavSection = {
  title?: string;
  links: MobileNavLink[];
};

export function getMobileNavShortcuts(dict: Dictionary): MobileNavLink[] {
  return [
    { href: "/myHome", label: dict.nav.home },
    { href: "/discover", label: dict.nav.discover },
    { href: "/flame", label: dict.nav.communityFlame },
    { href: "/my-list?tab=likes-you", label: dict.nav.myListLikesYou },
  ];
}

export function getMobileNavSections(dict: Dictionary): MobileNavSection[] {
  return [
    {
      links: [
        { href: "/discover?from=username", label: dict.nav.discoverUserName },
        { href: "/chat", label: dict.nav.chat },
      ],
    },
    {
      title: dict.nav.myList,
      links: [
        { href: "/my-list?tab=viewed-you", label: dict.nav.myListViewedYou },
        { href: "/my-list?tab=winked-at-you", label: dict.nav.myListWinkedAtYou },
        { href: "/my-list?tab=mutual", label: dict.nav.myListMutualMatches },
        { href: "/my-list?tab=you-likes", label: dict.nav.myListYouLikes },
        {
          href: "/my-list?tab=private-album-access",
          label: dict.nav.myListPrivateAlbumAccess,
        },
        {
          href: "/my-list?tab=private-album-requests",
          label: dict.nav.myListPrivateAlbumRequest,
        },
      ],
    },
    {
      title: dict.nav.community,
      links: [
        { href: "/blog", label: dict.nav.communityBlog },
        { href: "/events", label: dict.nav.communityEvents },
        { href: "/success-stories", label: dict.myHome.linkSuccessStories },
      ],
    },
    {
      title: dict.nav.sectionOther,
      links: [
        { href: "/my-profile", label: dict.nav.myProfile },
        { href: "/settings", label: dict.nav.profileMenuSettings },
        { href: "/subscription", label: dict.footer.productPricing },
        { href: "/about", label: dict.footer.companyAbout },
      ],
    },
  ];
}
