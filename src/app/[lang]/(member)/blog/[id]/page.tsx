import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { BlogDetailFeature } from "@/features/member/blog/detail";

export default async function BlogDetailPage({ params }: PageProps<"/[lang]/blog/[id]">) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return <BlogDetailFeature lang={lang} dict={dict} blogId={id} />;
}
