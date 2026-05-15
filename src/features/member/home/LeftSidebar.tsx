import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { User } from "@/lib/types";
import { avatarUrl } from "@/lib/image";

interface SidebarLink {
  labelKey: keyof Dictionary["myHome"];
  href: string;
}

const connectionLinks: SidebarLink[] = [
  { labelKey: "linkChats", href: "/chat" },
  { labelKey: "linkLikesYou", href: "/my-list/likes-you" },
  { labelKey: "linkWinkedAtYou", href: "/my-list/winked-at-you" },
  { labelKey: "linkViewedYou", href: "/my-list/viewed-you" },
];

const specialLinks: SidebarLink[] = [
  { labelKey: "linkFlame", href: "/flame" },
  { labelKey: "linkMemberBlog", href: "/community/blog" },
  { labelKey: "linkSuccessStories", href: "/community/success-stories" },
  { labelKey: "linkDiseaseQA", href: "/community/qa" },
];

interface LeftSidebarProps {
  lang: Locale;
  dict: Dictionary;
  me: User;
  viewedCount: number;
}

export function LeftSidebar({ lang, dict, me, viewedCount }: LeftSidebarProps) {
  return (
    <aside className="space-y-5">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Link
          href={`/${lang}/profile/${me.username}`}
          className="block aspect-[4/5] w-full overflow-hidden bg-muted"
        >
          <Image
            src={avatarUrl(me.avatarSeed, 480)}
            alt={me.displayName}
            width={480}
            height={600}
            className="size-full object-cover transition-transform hover:scale-105"
            unoptimized
          />
        </Link>
      </div>

      <div className="px-1 text-sm">
        <Link
          href={`/${lang}/settings/photo-verification`}
          className="block text-foreground hover:text-brand transition-colors"
        >
          {dict.myHome.getPhotoVerified}
        </Link>
        <p className="mt-1 text-muted-foreground">
          {dict.myHome.viewedTimes.replace("{count}", String(viewedCount))}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="px-1 text-xs font-semibold tracking-wider text-foreground">
          {dict.myHome.sectionConnections}
        </h3>
        <ul className="space-y-1.5">
          {connectionLinks.map((l) => (
            <li key={l.labelKey}>
              <Link
                href={`/${lang}${l.href}`}
                className="block px-1 text-sm text-muted-foreground hover:text-brand transition-colors"
              >
                {dict.myHome[l.labelKey]}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="px-1 text-xs font-semibold tracking-wider text-foreground">
          {dict.myHome.sectionSpecial}
        </h3>
        <ul className="space-y-1.5">
          {specialLinks.map((l) => (
            <li key={l.labelKey}>
              <Link
                href={`/${lang}${l.href}`}
                className="block px-1 text-sm text-muted-foreground hover:text-brand transition-colors"
              >
                {dict.myHome[l.labelKey]}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
