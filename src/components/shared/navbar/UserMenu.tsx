"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { avatarUrl } from "@/lib/image";

interface UserMenuProps {
  lang: Locale;
  dict: Dictionary;
  username: string;
  displayName: string;
  avatarSeed: string;
}

export function UserMenu({
  lang,
  dict,
  username,
  displayName,
  avatarSeed,
}: UserMenuProps) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full pr-2 pl-1 py-1 text-white/95 hover:bg-white/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/40">
        <Image
          src={avatarUrl(avatarSeed, 64)}
          alt={displayName}
          width={32}
          height={32}
          className="size-8 rounded-full object-cover ring-2 ring-white/20"
          unoptimized
        />
        <span className="text-xs font-semibold tracking-wide hidden sm:inline">
          {displayName}
        </span>
        <ChevronDown className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => router.push(`/${lang}/my-profile`)}>
          {displayName}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(`/${lang}/settings`)}>
          {dict.nav.profileMenuSettings}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/${lang}/auth/login`)}>
          {dict.nav.profileMenuSignOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
