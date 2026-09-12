"use client";

import { useEffect } from "react";
import { markOnboardingCompleteAction } from "./action";

export function AlreadyOnboardedRedirect({ lang }: { lang: string }) {
  useEffect(() => {
    markOnboardingCompleteAction().then(() => {
      window.location.replace(`/${lang}/myHome`);
    });
  }, [lang]);

  return null;
}
