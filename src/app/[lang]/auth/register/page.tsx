import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import RegisterFeature from "@/features/auth/register";

interface PageProps {
    params: Promise<{ lang: string }>;
}

export default async function RegisterPage({ params }: PageProps) {
    const { lang } = await params;
    if (!isLocale(lang)) notFound();
    const dict = await getDictionary(lang);

    return <RegisterFeature lang={lang} dict={dict} />;
}