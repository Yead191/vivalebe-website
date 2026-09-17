"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { ImageWithFallback as Image } from "@/components/shared/ImageWithFallback";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Lock, Menu, SlidersHorizontal, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { memberNav, type MemberNavItem } from "@/constants/member-nav";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { LangSwitcher } from "./LangSwitcher";
import { NotificationsBell } from "./NotificationsBell";
import { UserMenu } from "./UserMenu";
import {
  getMobileNavSections,
  getMobileNavShortcuts,
} from "./mobile-nav-sections";
import { MobileNavCards } from "./MobileNavCards";
import { QuickSearch } from "@/features/member/home/QuickSearch";

interface MemberNavbarProps {
  lang: Locale;
  dict: Dictionary;
  currentUser: {
    email: string;
    username: string;
    displayName: string;
    avatarSeed: string;
    isAdminVerified: boolean;
    verifiedStatus: string;
  };
}

export function MemberNavbar({ lang, dict, currentUser }: MemberNavbarProps) {
  const pathname = usePathname();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrawerOpen(false);
    setSearchOpen(false);
    setOpenKey(null);
  }, [pathname]);

  const handleEnter = (key: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpenKey(key);
  };
  const handleLeave = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenKey(null), 120);
  };

  const isActive = (href: string) => {
    const stripped = pathname.replace(new RegExp(`^/${lang}`), "") || "/";
    const target = href.split("?")[0];
    if (target === "/myHome") return stripped === "/myHome";
    return stripped === target || stripped.startsWith(`${target}/`);
  };

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-brand text-white">
        <div className="container flex h-16 items-center gap-4">
        <Link
          href={`/${lang}/myHome`}
          className="shrink-0 select-none"
          aria-label="Viva Leve home"
        >
          <Image
            src="/logo.png"
            alt="Viva Leve"
            width={320}
            height={180}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden lg:flex flex-1 items-center justify-center gap-1">
          {memberNav.map((item) => (
            <DesktopNavItem
              key={item.labelKey}
              item={item}
              lang={lang}
              dict={dict}
              isOpen={openKey === item.labelKey}
              isActive={isActive(item.href)}
              onEnter={() => handleEnter(item.labelKey)}
              onLeave={handleLeave}
            />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <NotificationsBell />
          <UserMenu
            lang={lang}
            dict={dict}
            email={currentUser.email}
            username={currentUser.username}
            displayName={currentUser.displayName}
            avatarSeed={currentUser.avatarSeed}
            isAdminVerified={currentUser.isAdminVerified}
            verifiedStatus={currentUser.verifiedStatus}
          />
          <LangSwitcher />
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="inline-flex size-9 lg:hidden items-center justify-center rounded-md text-white hover:bg-white/10"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              showCloseButton={false}
              className="h-dvh w-[70%] gap-0 overflow-y-auto border-0 bg-[#f4f5f7] p-0 data-[side=right]:w-[70%] data-[side=right]:sm:max-w-none"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between bg-[#f4f5f7] px-4 py-3">
                <span className="inline-flex size-9" />
                <SheetTitle className="sr-only">{dict.nav.home}</SheetTitle>
                <Image
                  src="/logo.png"
                  alt="Sigaleve"
                  width={160}
                  height={48}
                  className="h-8 w-auto object-contain"
                />
                <SheetClose
                  aria-label="Close menu"
                  className="inline-flex size-9 items-center justify-center rounded-md text-neutral-700 hover:bg-black/5"
                >
                  <X className="size-5" />
                </SheetClose>
              </div>
              <div className="px-4 pb-10 pt-2">
                <Suspense fallback={null}>
                  <MobileNavCards
                    lang={lang}
                    sections={getMobileNavSections(dict)}
                    onNavigate={() => setDrawerOpen(false)}
                  />
                </Suspense>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        </div>
      </div>
      <div className="bg-background lg:hidden">
        <div className="container flex items-center justify-between gap-2">
          <Suspense fallback={null}>
            <MobileNavCards
              lang={lang}
              shortcuts={getMobileNavShortcuts(dict)}
            />
          </Suspense>
          <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
            <SheetTrigger
              aria-label={dict.myHome.quickSubmit}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-neutral-700 hover:bg-black/5"
            >
              <SlidersHorizontal className="size-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[85%] gap-4 overflow-y-auto p-4 data-[side=right]:w-[85%] data-[side=right]:sm:max-w-none"
            >
              <SheetTitle>{dict.myHome.quickSubmit}</SheetTitle>
              <QuickSearch
                lang={lang}
                dict={dict}
                compact
                onSearched={() => setSearchOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

interface DesktopNavItemProps {
  item: MemberNavItem;
  lang: Locale;
  dict: Dictionary;
  isOpen: boolean;
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
}

function DesktopNavItem({
  item,
  lang,
  dict,
  isOpen,
  isActive,
  onEnter,
  onLeave,
}: DesktopNavItemProps) {
  const label = dict.nav[item.labelKey];
  const hasChildren = (item.children?.length ?? 0) > 0;

  return (
    <div
      className="relative"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      <Link
        href={`/${lang}${item.href}`}
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium tracking-wide transition-colors outline-none focus-visible:bg-white/10",
          isActive ? "text-white" : "text-white/85 hover:text-white"
        )}
      >
        {label}
        {hasChildren ? <ChevronDown className="size-3.5 opacity-80" /> : null}
      </Link>
      {isActive ? (
        <span className="pointer-events-none absolute -bottom-px left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-white" />
      ) : null}

      {hasChildren && isOpen ? (
        <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2">
          <div className="min-w-56 rounded-lg border border-border bg-popover py-2 text-popover-foreground shadow-xl">
            {item.children!.map((child) => {
              const childLabel = dict.nav[child.labelKey];
              if (child.premiumLocked) {
                return (
                  <span
                    key={child.labelKey}
                    title={dict.nav.premiumLocked}
                    className="flex cursor-not-allowed items-center justify-between gap-2 px-4 py-2 text-sm text-muted-foreground"
                  >
                    {childLabel}
                    <Lock className="size-3.5" />
                  </span>
                );
              }
              return (
                <Link
                  key={child.labelKey}
                  href={`/${lang}${child.href}`}
                  className="flex items-center justify-between gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted"
                >
                  {childLabel}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
