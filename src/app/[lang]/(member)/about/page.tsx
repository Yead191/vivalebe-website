import { RulePageView } from "@/components/shared/RulePageView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Viva Leve",
  description: "About Viva Leve",
};

export default function AboutPage() {
  return <RulePageView type="ABOUT" title="About Us" />;
}
