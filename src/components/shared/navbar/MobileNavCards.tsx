"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";
import type { MobileNavLink, MobileNavSection } from "./mobile-nav-sections";

export type { MobileNavLink, MobileNavSection } from "./mobile-nav-sections";

interface MobileNavCardsProps {
  lang: Locale;
  shortcuts?: MobileNavLink[];
  sections?: MobileNavSection[];
  onNavigate?: () => void;
  className?: string;
}

function useIsNavActive(lang: Locale) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (href: string) => {
    const stripped = pathname.replace(new RegExp(`^/${lang}`), "") || "/";
    const [target, query] = href.split("?");
    if (target === "/myHome") return stripped === "/myHome";
    if (stripped !== target && !stripped.startsWith(`${target}/`)) return false;
    if (!query) return true;
    const expected = new URLSearchParams(query);
    for (const [key, value] of expected.entries()) {
      if (searchParams.get(key) !== value) return false;
    }
    return true;
  };
}

function SectionCard({
  lang,
  link,
  onNavigate,
}: {
  lang: Locale;
  link: MobileNavLink;
  onNavigate?: () => void;
}) {
  if (link.locked) {
    return (
      <span className="flex items-center justify-between rounded-xl bg-white px-4 py-3.5 text-sm font-medium text-muted-foreground shadow-[0_1px_3px_rgba(15,23,42,0.08)] ring-1 ring-black/5">
        {link.label}
        <Lock className="size-3.5" />
      </span>
    );
  }

  return (
    <Link
      href={`/${lang}${link.href}`}
      onClick={onNavigate}
      className="block rounded-xl bg-white px-4 py-3.5 text-sm font-medium text-neutral-800 shadow-[0_1px_3px_rgba(15,23,42,0.08)] ring-1 ring-black/5 transition-colors hover:text-brand"
    >
      {link.label}
    </Link>
  );
}

export function MobileNavCards({
  lang,
  shortcuts = [],
  sections = [],
  onNavigate,
  className,
}: MobileNavCardsProps) {
  const isActive = useIsNavActive(lang);

  return (
    <nav
      className={cn(sections.length > 0 ? "space-y-6" : undefined, className)}
      aria-label="Mobile navigation"
    >
      {shortcuts.length > 0 ? (
        <ul className="flex flex-wrap items-end gap-x-5">
          {shortcuts.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={`${link.href}-${link.label}`} className="w-fit shrink-0">
                {link.locked ? (
                  <span className="inline-flex w-fit items-center border-b-2 border-transparent py-1.5 text-sm font-medium text-muted-foreground">
                    {link.label}
                    <Lock className="ml-1 size-3.5" />
                  </span>
                ) : (
                  <Link
                    href={`/${lang}${link.href}`}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex w-fit items-center border-b-2 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "border-brand text-brand"
                        : "border-transparent text-neutral-800 hover:text-brand",
                    )}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}

      {sections.map((section, index) => (
        <div key={section.title ?? `section-${index}`}>
          {section.title ? (
            <h3 className="mb-2.5 px-1 text-[13px] font-bold uppercase tracking-wide text-[#e11d48]">
              {section.title}
            </h3>
          ) : null}
          <ul className="space-y-2.5">
            {section.links.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <SectionCard lang={lang} link={link} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
