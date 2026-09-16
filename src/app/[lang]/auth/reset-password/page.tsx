import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import ResetPasswordFeature from "@/features/auth/reset-password";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Choose a new Sigaleve password after verifying your email code.",
  keywords: ["Sigaleve", "reset password", "new password"],
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function ResetPasswordPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return <ResetPasswordFeature lang={lang} dict={dict} />;
}
