"use client";

import { ImageWithFallback as Image } from "@/components/shared/ImageWithFallback";
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
import { logoutAction } from "@/features/auth/login/action";

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
          className="size-8 rounded-full object-cover ring-2 ring-white/20 transition-transform group-hover:scale-105"
          unoptimized
        />
        <span className="text-xs font-semibold tracking-wide hidden sm:inline group-hover:text-white">
          {displayName}
        </span>
        <ChevronDown className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 p-2 rounded-2xl border-none shadow-2xl bg-white/95 backdrop-blur-xl"
      >
        <div className="px-2 py-2.5 mb-2 bg-neutral-50/80 rounded-xl border border-neutral-100 flex items-center gap-3 shadow-inner">
          <Image
            src={avatarUrl(avatarSeed, 64)}
            alt={displayName}
            width={32}
            height={32}
            className="size-10 rounded-full object-cover ring-2 ring-white shadow-sm"
            unoptimized
          />
          <div className="flex flex-col truncate">
            <span className="text-sm font-bold text-neutral-800 truncate">
              {displayName}
            </span>
            <span className="text-xs font-medium text-neutral-400 truncate">
              @{username}
            </span>
          </div>
        </div>

        <DropdownMenuSeparator className="my-1 bg-neutral-100" />

        <DropdownMenuItem
          onClick={() => router.push(`/${lang}/my-profile`)}
          className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-600 hover:text-[#429CA8] hover:bg-[#429CA8]/10 transition-all mb-1"
        >
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push(`/${lang}/settings`)}
          className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-600 hover:text-[#429CA8] hover:bg-[#429CA8]/10 transition-all mb-1"
        >
          {dict.nav.profileMenuSettings}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-neutral-100" />

        <DropdownMenuItem
          onClick={async () => {
            await logoutAction();
            router.push(`/${lang}/auth/login`);
          }}
          className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50 focus:text-red-700 transition-all mt-1"
        >
          {dict.nav.profileMenuSignOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
