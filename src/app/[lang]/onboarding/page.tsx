import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getOnboardingDictionary } from "@/i18n/onboarding-dictionary";
import OnboardingFeature from "@/features/auth/onboarding";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function OnboardingPage({ params }: PageProps<any>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getOnboardingDictionary(lang);
  return <OnboardingFeature lang={lang} dict={dict} />;
}
