import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { HomeFeature } from "@/features/member/home";

export default async function MyHomePage({ params }: PageProps<"/[lang]/myHome">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return <HomeFeature lang={lang} dict={dict} />;
}
