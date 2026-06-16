import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getUserByUsername } from "@/lib/mock/users";
import { ProfileFeature } from "@/features/member/profile";
import { ProfileNotFoundState } from "@/features/member/profile/ProfileNotFoundState";

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
