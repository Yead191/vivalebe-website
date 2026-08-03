"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { locales, localeLabels, isLocale, type Locale } from "@/i18n/config";

export function LangSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ lang: string }>();
  const current: Locale = isLocale(params.lang) ? params.lang : locales[0];

  const switchTo = (next: Locale) => {
    if (next === current) return;
    const stripped = pathname.replace(new RegExp(`^/${current}(?=/|$)`), "");
    router.push(`/${next}${stripped || ""}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-black/20 hover:bg-black/30 backdrop-blur-sm px-3.5 py-1.5 text-xs font-bold tracking-wider text-white transition-all outline-none focus-visible:ring-2 focus-visible:ring-white/40 border border-white/10 hover:border-white/20 hover:scale-105">
        {current.toUpperCase()}
        <ChevronDown className="size-3.5 opacity-80" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-36 p-2 rounded-2xl border-none shadow-2xl bg-white/95 backdrop-blur-xl"
      >
        <div className="px-2 py-1.5 mb-1">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            Language
          </span>
        </div>
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => switchTo(loc)}
            className={`cursor-pointer rounded-xl px-3 py-2.5 text-sm font-semibold transition-all mb-0.5 ${
              loc === current
                ? "bg-[#429CA8] text-white hover:bg-[#357d87] focus:bg-[#357d87] focus:text-white shadow-sm"
                : "text-neutral-600 hover:text-[#429CA8] hover:bg-[#429CA8]/10 focus:text-[#429CA8] focus:bg-[#429CA8]/10"
            }`}
          >
            {localeLabels[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
