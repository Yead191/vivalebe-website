import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sigaleve",
  description:
    "See new videos, moments, and connections on Sigaleve — the community where honest relationships begin.",
  keywords: [
    "Sigaleve",
    "home feed",
    "moments",
    "videos",
    "connections",
    "honest relationships",
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

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  redirect(`/${lang}/myHome`);
}