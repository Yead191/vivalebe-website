import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import DiseaseQnADetailsFeature from "@/features/member/disease-qa/details";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Health Question",
    description: "A community question and answers on Sigaleve Health Q&A.",
    keywords: ["Sigaleve", "health question", "community support"],
    openGraph: {
      title: "Health Question | Sigaleve",
      description: "A community question and answers on Sigaleve Health Q&A.",
      url: `/disease-qa/details/${id}`,
    },
  };
}

export default async function DiseaseQnADetailsPage({
  params,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: PageProps<any>) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return <DiseaseQnADetailsFeature lang={lang} dict={dict} postId={id} />;
}
