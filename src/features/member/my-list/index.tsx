import type { User } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { users } from "@/lib/mock/users";
import { getCurrentUser } from "@/lib/mock/current-user";
import {
  TAB_USER_IDS,
  DEFAULT_TAB,
  isValidTab,
} from "@/constants/mockMyListData";
import { MyListClient } from "./MyListClient";

interface MyListFeatureProps {
  lang: Locale;
  dict: Dictionary;
  activeTab: string;
}

import {
  getYouLikedUsers,
  getLikesYouUsers,
  getViewedYouUsers,
  getMutualMatches,
  getWinks,
  getPrivateAlbumRequests,
  getPrivateAlbumAccess,
} from "./action";

export async function MyListFeature({
  lang,
  dict,
  activeTab,
}: MyListFeatureProps) {
  const me = getCurrentUser();
  const tab = isValidTab(activeTab) ? activeTab : DEFAULT_TAB;

  let tabUsers: User[] = [];

  if (tab === "you-likes") {
    tabUsers = await getYouLikedUsers();
  } else if (tab === "likes-you") {
    tabUsers = await getLikesYouUsers();
  } else if (tab === "viewed-you") {
    tabUsers = await getViewedYouUsers();
  } else if (tab === "mutual") {
    tabUsers = await getMutualMatches();
  } else if (tab === "winked-at-you") {
    tabUsers = await getWinks();
  } else if (tab === "private-album-requests") {
    tabUsers = await getPrivateAlbumRequests();
  } else if (tab === "private-album-access") {
    tabUsers = await getPrivateAlbumAccess();
  } else {
    const ids = (TAB_USER_IDS as Record<string, string[]>)[tab] || [];
    tabUsers = ids
      .map((id: string) => users.find((u) => u.id === id))
      .filter(
        (u): u is NonNullable<typeof u> => u !== undefined && u.id !== me.id,
      );
  }

  return (
    <MyListClient lang={lang} dict={dict} activeTab={tab} users={tabUsers} />
  );
}
