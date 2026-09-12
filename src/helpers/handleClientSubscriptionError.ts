"use client";

import { isSubscriptionRequiredError } from "./subscriptionRequired";
import { showSubscriptionRequiredToast } from "./showSubscriptionRequiredToast";

export function handleClientSubscriptionError(
  payload: {
    message?: string | null;
    error?: string | null;
    errorMessages?: unknown;
  },
  lang: string,
): boolean {
  if (!isSubscriptionRequiredError(payload)) return false;
  showSubscriptionRequiredToast();
  window.location.assign(`/${lang}/subscription?required=1`);
  return true;
}
