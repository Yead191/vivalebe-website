import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { HomeFeature } from "@/features/member/home";
import { parseHomeTab } from "@/features/member/home/tabs";

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
