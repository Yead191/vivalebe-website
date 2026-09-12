import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { HomeFeature } from "@/features/member/home";
import { parseHomeTab } from "@/features/member/home/tabs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Feed",
  description:
    "See new videos, moments, and connections on Sigaleve — the community where honest relationships begin.",
  keywords: [
    "Sigaleve",
    "home feed",
    "moments",
    "videos",
    "honest dating",
  ],
};

export default async function MyHomePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { lang } = await params;
  const { tab } = await searchParams;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return <HomeFeature lang={lang} dict={dict} activeTab={parseHomeTab(tab)} />;
}
