import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { BlogFeature } from "@/features/member/blog";
import { myFetch } from "@/helpers/myFetch";
import type { ApiBlog } from "@/features/member/blog/types";

export default async function BlogRootPage({
  params,
}: PageProps<"/[lang]/blog">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const res = await myFetch<ApiBlog[]>("/blogs", {
    cache: "no-store",
    tags: ["blogs"],
  });

  return (
    <BlogFeature
      lang={lang}
      dict={dict}
      blogs={res.data ?? []}
      totalBlogs={res.data?.length ?? 0}
    />
  );
}
