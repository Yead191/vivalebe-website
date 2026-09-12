import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getUserByUsername } from "@/lib/mock/users";
import { ProfileFeature } from "@/features/member/profile";
import { ProfileNotFoundState } from "@/features/member/profile/ProfileNotFoundState";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/profile/[username]">): Promise<Metadata> {
  const { username } = await params;
  const user = getUserByUsername(username);
  const title = user?.displayName || username;
  return {
    title,
    description: `View ${title}'s profile on Sigaleve.`,
    keywords: ["Sigaleve", "member profile", title],
    openGraph: {
      title: `${title} | Sigaleve`,
      description: `View ${title}'s profile on Sigaleve.`,
      url: `/profile/${username}`,
    },
  };
}

export default async function ProfilePage({
  params,
}: PageProps<"/[lang]/profile/[username]">) {
  const { lang, username } = await params;
  if (!isLocale(lang)) notFound();

  const user = getUserByUsername(username);
  const dict = await getDictionary(lang);

  if (!user) {
    return <ProfileNotFoundState lang={lang} dict={dict} username={username} />;
  }

  return <ProfileFeature lang={lang} dict={dict} user={user} />;
}
