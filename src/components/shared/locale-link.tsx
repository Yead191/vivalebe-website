import Link, { type LinkProps } from "next/link";
import type { ComponentProps } from "react";
import type { Locale } from "@/i18n/config";

type Props = Omit<ComponentProps<typeof Link>, "href"> &
  Pick<LinkProps, "scroll" | "prefetch" | "replace"> & {
    href: string;
    lang: Locale;
  };

export function LocaleLink({ href, lang, ...rest }: Props) {
  const path = href.startsWith("/") ? href : `/${href}`;
  return <Link href={`/${lang}${path}`} {...rest} />;
}
