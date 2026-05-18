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

export function MyListFeature({ lang, dict, activeTab }: MyListFeatureProps) {
  const me = getCurrentUser();
  const tab = isValidTab(activeTab) ? activeTab : DEFAULT_TAB;
  const ids = TAB_USER_IDS[tab];

  const tabUsers = ids
    .map((id) => users.find((u) => u.id === id))
    .filter((u): u is NonNullable<typeof u> => u !== undefined && u.id !== me.id);

  return (
    <MyListClient
      lang={lang}
      dict={dict}
      activeTab={tab}
      users={tabUsers}
    />
  );
}
