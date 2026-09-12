import type { Metadata } from "next";
import { RulePageView } from "@/components/shared/RulePageView";

export const metadata: Metadata = {
  title: "About Us - Sigaleve",
  description:
    "Learn why Sigaleve exists: honest dating, safer community, and connections that start with truth.",
  keywords: [
    "Sigaleve",
    "about Sigaleve",
    "honest dating",
    "our story",
    "mission",
    "vision",
    "values",
    "culture",
    "community",
    "platform",
    "product",
    "service",
    "company",
    "team",
    "team members",
    "team member",
    "team member profile",
    "team member profile page",
  ],
};

export default function AboutPage() {
  return <RulePageView type="ABOUT" title="About Us" />;
}
