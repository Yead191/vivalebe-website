import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import LoginFeature from "@/features/auth/login";

export default async function LoginPage({ params }: PageProps<"/[lang]/auth/login">) {
    const { lang } = await params;
    if (!isLocale(lang)) notFound();
    const dict = await getDictionary(lang);
    return <LoginFeature lang={lang} dict={dict} />;
}
