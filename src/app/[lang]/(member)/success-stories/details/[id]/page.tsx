import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import SuccessStoryDetailsFeature from "@/features/member/success-stories/details/details";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Success Story",
    description: "Read how this Sigaleve connection became a real story.",
    keywords: ["Sigaleve", "success story", "love story"],
    openGraph: {
      title: "Success Story | Sigaleve",
      description: "Read how this Sigaleve connection became a real story.",
      url: `/success-stories/details/${id}`,
    },
  };
}

export default async function SuccessStoryDetailsPage({
    params,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: PageProps<any>) {
    const { lang, id } = await params;

    if (!isLocale(lang)) notFound();

    const dict = await getDictionary(lang);

    return <SuccessStoryDetailsFeature lang={lang} dict={dict} storyId={id} />;
}
