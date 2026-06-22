import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import OTPVerificationFeature from "@/features/auth/otp-verification";

interface PageProps {
    params: Promise<{ lang: string }>;
}

export default async function OTPVerificationPage({ params }: PageProps) {
    const { lang } = await params;
    if (!isLocale(lang)) notFound();
    const dict = await getDictionary(lang);

    return <OTPVerificationFeature lang={lang} dict={dict} />;
}