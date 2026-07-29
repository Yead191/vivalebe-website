import { RulePageView } from "@/components/shared/RulePageView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Viva Leve",
  description: "Privacy Policy of Viva Leve",
};

export default function PrivacyPage() {
  return <RulePageView type="PRIVACY" title="Privacy Policy" />;
}
