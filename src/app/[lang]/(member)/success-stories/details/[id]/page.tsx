import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import SuccessStoryDetailsFeature from "@/features/member/success-stories/details";

export default async function SuccessStoryDetailsPage({
    params,
}: PageProps<any>) {
    const { lang, id } = await params;

    if (!isLocale(lang)) notFound();

    const dict = await getDictionary(lang);

    return <SuccessStoryDetailsFeature lang={lang} dict={dict} storyId={id} />;
}
