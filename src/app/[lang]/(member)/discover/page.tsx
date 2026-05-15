import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { DiscoverFeature } from "@/features/member/discover";

export default async function DiscoverPage({
  params,
  searchParams,
}: PageProps<"/[lang]/discover">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const sp = await searchParams;
  const raw = sp.q;
  const query = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] ?? "" : "";
  const dict = await getDictionary(lang);
  return <DiscoverFeature lang={lang} dict={dict} query={query} />;
}
