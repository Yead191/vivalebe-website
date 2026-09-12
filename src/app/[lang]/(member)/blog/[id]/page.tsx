import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { BlogDetailFeature } from "@/features/member/blog/detail";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/blog/[id]">): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Community Story",
    description: "Read this story from the Sigaleve community blog.",
    keywords: ["Sigaleve", "blog post", "community story"],
    openGraph: {
      title: "Community Story | Sigaleve",
      description: "Read this story from the Sigaleve community blog.",
      url: `/blog/${id}`,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: PageProps<"/[lang]/blog/[id]">) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return <BlogDetailFeature lang={lang} dict={dict} blogId={id} />;
}
