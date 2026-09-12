import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import RegisterFeature from "@/features/auth/register";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Account",
    description:
        "Join Sigaleve and meet people who value honesty, respect, and real connection.",
    keywords: ["Sigaleve", "sign up", "create account", "register"],
    robots: { index: false, follow: false },
};

interface PageProps {
    params: Promise<{ lang: string }>;
}

export default async function RegisterPage({ params }: PageProps) {
    const { lang } = await params;
    if (!isLocale(lang)) notFound();
    const dict = await getDictionary(lang);

    return <RegisterFeature lang={lang} dict={dict} />;
}