import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getUserById } from "@/features/member/profile/action";
import { userFromProfilePayload } from "@/features/member/profile/mapUser";
import { ProfileFeature } from "@/features/member/profile";
import { ProfileNotFoundState } from "@/features/member/profile/ProfileNotFoundState";
import { getProfileAction } from "@/features/member/settings/action";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Member Profile",
    description: "View this member’s profile on Sigaleve.",
    keywords: ["Sigaleve", "member profile"],
    robots: { index: false, follow: false },
    openGraph: {
      title: "Member Profile | Sigaleve",
      description: "View this member’s profile on Sigaleve.",
      url: `/my-list/profile/${id}`,
    },
  };
}

export default async function MyListProfilePage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const localeLang = lang as Locale;

  const dict = await getDictionary(localeLang);
  const profileRes = await getProfileAction();
  const me = profileRes?.data;
  const meId = String(me?._id || me?.id || "");
  const isOwnProfile =
    Boolean(meId) &&
    (meId === id || String(me?.username || "") === id);
  const isPremium =
    isOwnProfile ||
    !!(me?.premiumMembership ?? me?.premium);

  const user =
    (await getUserById(id, { skipSubscriptionRedirect: isOwnProfile })) ||
    (isOwnProfile ? userFromProfilePayload(me) : null);

  if (!user) {
    return <ProfileNotFoundState lang={localeLang} dict={dict} username={id} />;
  }

  return (
    <ProfileFeature
      lang={localeLang}
      dict={dict}
      user={user}
      isPremium={isPremium}
    />
  );
}
