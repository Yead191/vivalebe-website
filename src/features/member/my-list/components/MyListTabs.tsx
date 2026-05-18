import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { TAB_BADGE_COUNTS } from "@/constants/mockMyListData";

const TABS: Array<{ value: string; labelKey: keyof Dictionary["nav"] }> = [
  { value: "likes-you", labelKey: "myListLikesYou" },
  { value: "viewed-you", labelKey: "myListViewedYou" },
  { value: "winked-at-you", labelKey: "myListWinkedAtYou" },
  { value: "mutual", labelKey: "myListMutualMatches" },
  { value: "you-likes", labelKey: "myListYouLikes" },
  { value: "private-album-access", labelKey: "myListPrivateAlbumAccess" },
  { value: "private-album-requests", labelKey: "myListPrivateAlbumRequest" },
];

interface MyListTabsProps {
  lang: Locale;
  dict: Dictionary;
  activeTab: string;
}

export function MyListTabs({ lang, dict, activeTab }: MyListTabsProps) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-0 border-b border-border">
      {TABS.map(({ value, labelKey }) => {
        const isActive = activeTab === value;
        const badge = TAB_BADGE_COUNTS[value];
        return (
          <Link
            key={value}
            href={`/${lang}/my-list?tab=${value}`}
            className={cn(
              "relative inline-flex items-center gap-1.5 pb-3 text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap transition-colors",
              isActive
                ? "text-foreground border-b-2 border-foreground -mb-px"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {dict.nav[labelKey]}
            {badge ? (
              <span className="inline-flex items-center justify-center min-w-[1.1rem] h-[1.1rem] px-1 text-[9px] font-bold rounded-full bg-brand text-white leading-none">
                {badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
