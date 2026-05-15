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
      <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-md border border-white/30 bg-transparent px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/40">
        {current.toUpperCase()}
        <ChevronDown className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-32">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => switchTo(loc)}
            className={loc === current ? "font-semibold" : ""}
          >
            {localeLabels[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
