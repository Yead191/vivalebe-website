import { getDictionary } from "@/i18n/dictionaries";
import onboardingEn from "./messages/onboarding.en";
import onboardingPt from "./messages/onboarding.pt";
import type { Locale } from "./config";

const onboarding = {
  en: onboardingEn,
  pt: onboardingPt,
} as const;

export async function getOnboardingDictionary(locale: Locale) {
  const dict = await getDictionary(locale);
  return {
    ...dict,
    onboarding: onboarding[locale],
  };
}
