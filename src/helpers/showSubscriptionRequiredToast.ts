"use client";

import { toast } from "sonner";
import {
  SUBSCRIBE_REQUIRED_MESSAGE,
  SUBSCRIBE_REQUIRED_TOAST_ID,
} from "@/helpers/subscriptionRequired";

let lastShownAt = 0;

/** Shows a single subscription toast (module + id dedupe). */
export function showSubscriptionRequiredToast() {
  const now = Date.now();
  if (now - lastShownAt < 4000) return;
  lastShownAt = now;

  toast.error(SUBSCRIBE_REQUIRED_MESSAGE, {
    id: SUBSCRIBE_REQUIRED_TOAST_ID,
    duration: 4500,
  });
}
