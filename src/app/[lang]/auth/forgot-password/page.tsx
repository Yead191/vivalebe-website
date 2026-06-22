import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import ForgotPasswordFeature from "@/features/auth/forgot-password";

interface PageProps {
    params: Promise<{ lang: string }>;
}

export default async function ForgotPasswordPage({ params }: PageProps) {
    const { lang } = await params;
    if (!isLocale(lang)) notFound();
    const dict = await getDictionary(lang);

    return <ForgotPasswordFeature lang={lang} dict={dict} />;
}