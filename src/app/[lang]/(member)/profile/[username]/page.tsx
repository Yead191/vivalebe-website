import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getUserByUsername } from "@/lib/mock/users";
import { ProfileFeature } from "@/features/member/profile";

export default async function ProfilePage({
  params,
}: PageProps<"/[lang]/profile/[username]">) {
  const { lang, username } = await params;
  if (!isLocale(lang)) notFound();
  const user = getUserByUsername(username);
  if (!user) notFound();
  const dict = await getDictionary(lang);
  return <ProfileFeature lang={lang} dict={dict} user={user} />;
}
