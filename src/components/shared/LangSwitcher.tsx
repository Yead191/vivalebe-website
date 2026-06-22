"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Globe, Check } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const locales = ["en", "pt"] as const;
const localeLabels: Record<(typeof locales)[number], string> = {
    en: "English",
    pt: "Português",
};

export function LangSwitcher() {
    const pathname = usePathname();
    const router = useRouter();

    const segments = pathname.split("/");
    const currentLang = (segments[1] || "en") as (typeof locales)[number];

    const switchTo = (nextLang: string) => {
        if (nextLang === currentLang) return;

        segments[1] = nextLang;
        const newPath = segments.join("/");
        router.push(newPath);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="group inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-xs hover:border-[#429CA8]/40 hover:bg-white transition-all cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-[#429CA8]/30">
                <Globe className="size-3.5 text-[#429CA8] transition-transform duration-300 group-hover:rotate-12" />
                <span className="uppercase tracking-wider">{currentLang}</span>
                <ChevronDown className="size-3 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="min-w-36 rounded-2xl p-1.5 shadow-xl border border-neutral-200/70 bg-white/95 backdrop-blur-md animate-in fade-in-50 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
            >
                {locales.map((loc) => {
                    const isActive = loc === currentLang;
                    return (
                        <DropdownMenuItem
                            key={loc}
                            onClick={() => switchTo(loc)}
                            className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${isActive
                                ? "bg-[#429CA8]/10 text-[#429CA8] font-bold focus:bg-[#429CA8]/15 focus:text-[#429CA8]"
                                : "text-neutral-600 hover:bg-neutral-50 focus:bg-neutral-50 focus:text-neutral-900"
                                }`}
                        >
                            <span>{localeLabels[loc]}</span>
                            {isActive && <Check className="size-3.5 stroke-3" />}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}