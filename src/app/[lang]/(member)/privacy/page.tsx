import type { Metadata } from "next";
import { RulePageView } from "@/components/shared/RulePageView";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read how Sigaleve collects, uses, and protects your personal information.",
  keywords: [
    "Sigaleve",
    "privacy policy",
    "data protection",
    "personal information",
  ],
};

export default function PrivacyPage() {
  return <RulePageView type="PRIVACY" title="Privacy Policy" />;
}
