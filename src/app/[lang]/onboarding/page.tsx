import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getOnboardingDictionary } from "@/i18n/onboarding-dictionary";
import OnboardingFeature from "@/features/auth/onboarding";

export default async function OnboardingPage({ params }: PageProps<"/[lang]/onboarding">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getOnboardingDictionary(lang);
  return <OnboardingFeature lang={lang} dict={dict} />;
}
