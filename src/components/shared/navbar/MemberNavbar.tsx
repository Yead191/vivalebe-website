"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Lock, Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
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

interface MemberNavbarProps {
  lang: Locale;
  dict: Dictionary;
  currentUser: {
    username: string;
    displayName: string;
    avatarSeed: string;
  };
}

export function MemberNavbar({ lang, dict, currentUser }: MemberNavbarProps) {
  const pathname = usePathname();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
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
    <header className="sticky top-0 z-40 bg-brand text-white">
      <div className="container flex h-16 items-center gap-4">
        <Link
          href={`/${lang}/myHome`}
          className="shrink-0 select-none"
          aria-label="Viva Leve home"
        >
          <Image
            src="/logo.png"
            alt="Viva Leve"
            width={160}
            height={48}
            className="h-9 w-auto object-contain"
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
            username={currentUser.username}
            displayName={currentUser.displayName}
            avatarSeed={currentUser.avatarSeed}
          />
          <LangSwitcher />
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="inline-flex size-9 lg:hidden items-center justify-center rounded-md text-white hover:bg-white/10"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <SheetHeader className="border-b px-5 py-4">
                <SheetTitle>{dict.nav.home}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col p-2">
                {memberNav.map((item) => (
                  <MobileNavItem
                    key={item.labelKey}
                    item={item}
                    lang={lang}
                    dict={dict}
                    onNavigate={() => setDrawerOpen(false)}
                  />
                ))}
              </div>
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
        <span className="pointer-events-none absolute -bottom-px left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-white" />
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

interface MobileNavItemProps {
  item: MemberNavItem;
  lang: Locale;
  dict: Dictionary;
  onNavigate: () => void;
}

function MobileNavItem({ item, lang, dict, onNavigate }: MobileNavItemProps) {
  const [open, setOpen] = useState(false);
  const label = dict.nav[item.labelKey];
  const hasChildren = (item.children?.length ?? 0) > 0;

  if (!hasChildren) {
    return (
      <Link
        href={`/${lang}${item.href}`}
        onClick={onNavigate}
        className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
      >
        {label}
      </Link>
    );
  }

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
      >
        <span>{label}</span>
        {open ? <X className="size-4" /> : <ChevronRight className="size-4" />}
      </button>
      {open ? (
        <div className="ml-3 flex flex-col border-l border-border pl-2">
          {item.children!.map((child) => {
            const childLabel = dict.nav[child.labelKey];
            if (child.premiumLocked) {
              return (
                <span
                  key={child.labelKey}
                  className="flex items-center justify-between gap-2 px-3 py-2 text-sm text-muted-foreground"
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
                onClick={onNavigate}
                className="rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                {childLabel}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
