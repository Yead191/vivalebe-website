import type { Metadata } from "next";
import { RulePageView } from "@/components/shared/RulePageView";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms that keep Sigaleve safe, respectful, and fair for every member.",
  keywords: [
    "Sigaleve",
    "terms and conditions",
    "community rules",
    "user agreement",
  ],
};

export default function TermsPage() {
  return <RulePageView type="TERMS" title="Terms & Conditions" />;
}
