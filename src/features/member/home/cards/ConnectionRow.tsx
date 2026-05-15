import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { ConnectionEvent, User } from "@/lib/types";
import { avatarUrl } from "@/lib/image";

interface ConnectionRowProps {
  lang: Locale;
  dict: Dictionary;
  event: ConnectionEvent;
  user: User;
}

export function ConnectionRow({ lang, dict, event, user }: ConnectionRowProps) {
  const verb =
    event.kind === "viewed"
      ? dict.myHome.viewedYourProfile
      : event.kind === "liked"
        ? dict.myHome.linkLikesYou
        : dict.myHome.linkWinkedAtYou;
  return (
    <Link
      href={`/${lang}/profile/${user.username}`}
      className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted/50 transition-colors"
    >
      <Image
        src={avatarUrl(user.avatarSeed, 80)}
        alt={user.displayName}
        width={40}
        height={40}
        className="size-10 rounded-full object-cover"
        unoptimized
      />
      <span className="flex-1 text-sm text-foreground">{verb}</span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </Link>
  );
}
