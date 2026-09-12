import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { MyListFeature } from "@/features/member/my-list";
import { DEFAULT_TAB } from "@/constants/mockMyListData";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My List",
  description:
    "Review likes, winks, and people who viewed you on Sigaleve.",
  keywords: ["Sigaleve", "likes", "winks", "viewed you"],
  robots: { index: false, follow: false },
};

export default async function MyListPage({
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
  return <MyListFeature lang={lang} dict={dict} activeTab={tab ?? DEFAULT_TAB} />;
}
