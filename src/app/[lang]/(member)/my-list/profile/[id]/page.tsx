import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getUserById } from "@/features/member/profile/action";
import { ProfileFeature } from "@/features/member/profile";
import { ProfileNotFoundState } from "@/features/member/profile/ProfileNotFoundState";
import { getProfileAction } from "@/features/member/settings/action";

export default async function MyListProfilePage({
  params,
}: PageProps<"/[lang]/my-list/profile/[id]">) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();

  const user = await getUserById(id);
  const dict = await getDictionary(lang);
  const profileRes = await getProfileAction();
  const isPremium = !!profileRes?.data?.premiumMembership;

  if (!user) {
    return <ProfileNotFoundState lang={lang} dict={dict} username={id} />;
  }

  return (
    <ProfileFeature lang={lang} dict={dict} user={user} isPremium={isPremium} />
  );
}
