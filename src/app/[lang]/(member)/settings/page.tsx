import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import SettingsPageFeature from "@/features/member/settings";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function page({ params }: PageProps<any>) {
    const { lang } = await params;
    if (!isLocale(lang)) notFound();
    const dict = await getDictionary(lang);
    return <SettingsPageFeature lang={lang} dict={dict} />;
}
