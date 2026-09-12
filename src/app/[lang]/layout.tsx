import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getSiteUrl } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  const site = getSiteUrl();
  return {
    alternates: {
      languages: {
        en: `${site}/en`,
        pt: `${site}/pt`,
      },
    },
    openGraph: {
      locale: locale === "pt" ? "pt_BR" : "en_US",
    },
  };
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LocaleRootLayout({
  children,
  params,
}: LayoutProps) {
  const { lang } = await params;
  
  if (!isLocale(lang)) {
    notFound();
  }

  return <>{children}</>;
}
