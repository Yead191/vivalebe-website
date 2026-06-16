import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { diseaseQaPosts } from "./data";
import { DiseaseQaDetailsClient } from "./details-client";
import { notFound } from "next/navigation";

export default function DiseaseQnADetailsFeature({
  lang,
  dict,
  postId,
}: {
  lang: Locale;
  dict: Dictionary;
  postId: string;
}) {
  const post = diseaseQaPosts.find((item) => item.id === postId);
  if (!post) notFound();
  return <DiseaseQaDetailsClient lang={lang} dict={dict} post={post} />;
}
