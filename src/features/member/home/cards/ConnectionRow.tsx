import { ImageWithFallback as Image } from "@/components/shared/ImageWithFallback";
import Link from "next/link";
import { Lock } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { ConnectionEvent, User } from "@/lib/types";
import { avatarUrl } from "@/lib/image";
import { cn } from "@/lib/utils";

interface ConnectionRowProps {
  lang: Locale;
  dict: Dictionary;
  event: ConnectionEvent;
  user: User;
  isPremium: boolean;
}

export function ConnectionRow({
  lang,
  dict,
  event,
  user,
  isPremium,
}: ConnectionRowProps) {
  const verb =
    event.kind === "viewed"
      ? dict.myHome.viewedYourProfile
      : event.kind === "liked"
        ? dict.myHome.linkLikesYou
        : dict.myHome.linkWinkedAtYou;

  const content = (
    <>
      <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
        <Image
          src={avatarUrl(user.avatarSeed, 80)}
          alt={isPremium ? user.displayName : ""}
          width={40}
          height={40}
          className={cn(
            "size-10 rounded-full object-cover",
            !isPremium && "scale-110 blur-[3px]",
          )}
          unoptimized
        />
        {!isPremium ? (
          <span className="absolute inset-0 rounded-full bg-background/20" />
        ) : null}
      </div>

      <span className="flex-1 text-sm text-foreground">
        <span
          className={cn(
            "font-semibold uppercase tracking-wide",
            !isPremium && "inline-block blur-[3px] select-none",
          )}
        >
          {user.displayName}
        </span>{" "}
        {verb}
      </span>

      {!isPremium ? (
        <Lock className="size-4 shrink-0 text-muted-foreground" />
      ) : null}
    </>
  );

  if (isPremium) {
    return (
      <Link
        href={`/${lang}/my-list/profile/${user.id}`}
        className="flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/50"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-md px-2 py-2 bg-muted/50 cursor-not-allowed">
      {content}
    </div>
  );
}
