import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/mock/current-user";
import MyProfileFeature from "@/features/member/my-profile";

export default async function MyProfilePage({
  params,
}: PageProps<"/[lang]/my-profile">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const user = getCurrentUser();

  return <MyProfileFeature lang={lang} dict={dict} user={user} />;
}
