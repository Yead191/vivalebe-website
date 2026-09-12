import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import LoginFeature from "@/features/auth/login";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Log In",
    description:
        "Log in to Sigaleve to continue honest conversations, matches, and community stories.",
    keywords: ["Sigaleve", "login", "sign in", "honest dating"],
    robots: { index: false, follow: false },
};

interface PageProps {
    params: Promise<{ lang: string }>;
}

export default async function LoginPage({ params }: PageProps) {
    const { lang } = await params;
    if (!isLocale(lang)) notFound();
    const dict = await getDictionary(lang);

    return <LoginFeature lang={lang} dict={dict} />;
}