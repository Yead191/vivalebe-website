import { RulePageView } from "@/components/shared/RulePageView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions - Viva Leve",
  description: "Terms and conditions for using Viva Leve",
};

export default function TermsPage() {
  return <RulePageView type="TERMS" title="Terms & Conditions" />;
}
