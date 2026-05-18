import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { BlogFeature } from "@/features/member/blog";

export default async function BlogRootPage({ params }: PageProps<"/[lang]/blog">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return <BlogFeature lang={lang} dict={dict} />;
}
