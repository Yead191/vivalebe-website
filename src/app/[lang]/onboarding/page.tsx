import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getOnboardingDictionary } from "@/i18n/onboarding-dictionary";
import OnboardingFeature from "@/features/auth/onboarding";
import { AlreadyOnboardedRedirect } from "@/features/auth/onboarding/AlreadyOnboardedRedirect";
import { getProfileAction } from "@/features/member/settings/action";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Your Profile",
  description:
    "Finish your Sigaleve profile so the right people can find the real you.",
  keywords: ["Sigaleve", "onboarding", "complete profile"],
  robots: { index: false, follow: false },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function OnboardingPage({ params }: PageProps<any>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const profileRes = await getProfileAction();
  if (profileRes?.data?.onboardingComplete === true) {
    return <AlreadyOnboardedRedirect lang={lang} />;
  }

  const dict = await getOnboardingDictionary(lang);
  return <OnboardingFeature lang={lang} dict={dict} />;
}
