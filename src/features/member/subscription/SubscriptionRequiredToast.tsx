"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { showSubscriptionRequiredToast } from "@/helpers/showSubscriptionRequiredToast";

export function SubscriptionRequiredToast() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (searchParams.get("required") !== "1") return;

    // Strip the flag immediately so Strict Mode remount won't fire again.
    const next = new URLSearchParams(searchParams.toString());
    next.delete("required");
    const query = next.toString();
    const cleanUrl = query ? `${pathname}?${query}` : pathname;
    window.history.replaceState(window.history.state, "", cleanUrl);

    showSubscriptionRequiredToast();
  }, [pathname, searchParams]);

  return null;
}
