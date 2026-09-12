export const ONBOARDING_COOKIE = "onboardingComplete";

export function isOnboardingIncompleteFlag(value: unknown): boolean {
  return value === false || value === "false";
}
