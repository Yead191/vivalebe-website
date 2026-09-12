import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import DiseaseQnAFeature from "@/features/member/disease-qa";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health Q&A",
  description:
    "Ask questions and learn from the Sigaleve community in a respectful Health Q&A space.",
  keywords: ["Sigaleve", "health Q&A", "community support"],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function page({ params }: PageProps<any>) {
    const { lang } = await params;
    if (!isLocale(lang)) notFound();
    const dict = await getDictionary(lang);
    return <DiseaseQnAFeature lang={lang} dict={dict} />;
}
