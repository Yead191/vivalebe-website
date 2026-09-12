import SuccessStoriesFeature from '@/features/member/success-stories';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Success Stories",
  description:
    "Real couples and friendships that started with honesty on Sigaleve.",
  keywords: ["Sigaleve", "success stories", "couples", "love stories"],
};
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { notFound } from 'next/navigation';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function MySuccessStoriesPage({ params }: PageProps<any>) {
    const { lang } = await params;
    if (!isLocale(lang)) notFound();
    const dict = await getDictionary(lang);
    return <SuccessStoriesFeature lang={lang} dict={dict} />;
}
