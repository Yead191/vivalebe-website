"use client";

import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { User } from "@/lib/types";
import { ProfileImage } from "@/components/shared/ProfileImage";

interface SidebarLink {
  labelKey: keyof Dictionary["myHome"];
  href: string;
}

const connectionLinks: SidebarLink[] = [
  { labelKey: "linkChats", href: "/chat" },
  { labelKey: "linkLikesYou", href: "/my-list?tab=likes-you" },
  { labelKey: "linkWinkedAtYou", href: "/my-list?tab=winked-at-you" },
  { labelKey: "linkViewedYou", href: "/my-list?tab=viewed-you" },
];

const specialLinks: SidebarLink[] = [
  { labelKey: "linkFlame", href: "/flame" },
  { labelKey: "linkMemberBlog", href: "/blog" },
  { labelKey: "linkEvents", href: "/events" },
  { labelKey: "linkSuccessStories", href: "/success-stories" },
  // { labelKey: "linkDiseaseQA", href: "/disease-qa" },
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
        <div className="relative aspect-4/5 w-full overflow-hidden bg-muted">
          <ProfileImage
            seed={me.avatarSeed}
            alt={me.displayName || "Profile"}
            width={480}
            height={600}
            className="size-full object-cover"
            iconClassName="size-16"
          />
          {/* <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Camera className="size-8 text-white mb-2" />
            <span className="text-white text-xs font-medium px-4 text-center">
              {dict.myHome.changeProfilePicture}
            </span>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          /> */}
        </div>
      </div>

      <div className="px-1 text-sm">
        {/* <Link
          href={`/${lang}/settings/photo-verification`}
          className="block text-foreground hover:text-brand transition-colors"
        >
          {dict.myHome.getPhotoVerified}
        </Link> */}
        {viewedCount > 0 ? (
          <p className="text-muted-foreground">
            {dict.myHome.viewedTimes.replace("{count}", String(viewedCount))}
          </p>
        ) : null}
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
