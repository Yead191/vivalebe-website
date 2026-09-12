import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import MyProfileFeature from "@/features/member/my-profile";
import { getProfileAction } from "@/features/member/settings/action";
import type { Gender, User } from "@/lib/types";
import { hasRealImageSrc } from "@/lib/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile",
  description:
    "Manage your Sigaleve profile, photos, and the story you share with the community.",
  keywords: ["Sigaleve", "my profile", "edit profile"],
  robots: { index: false, follow: false },
};

function calcAge(dob?: string): number {
  if (!dob) return 0;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return 0;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age > 0 ? age : 0;
}

function mapGender(value: unknown): Gender {
  const v = String(value ?? "").toUpperCase();
  if (v === "W" || v === "FEMALE" || v === "WOMAN") return "W";
  if (v === "C" || v === "COUPLE") return "C";
  return "M";
}

export default async function MyProfilePage({
  params,
}: PageProps<"/[lang]/my-profile">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const profileRes = await getProfileAction();
  const userData = profileRes?.data || {};

  const name = userData.name || userData.displayName || userData.username || "";
  const profileImage =
    userData.profile || userData.image || userData.profileImage || "";
  const photo = hasRealImageSrc(profileImage) ? profileImage : "";

  const user: User = {
    id: userData._id || userData.id || "",
    username: userData.username || "",
    displayName: name,
    age: userData.DOB ? calcAge(userData.DOB) : Number(userData.age) || 0,
    gender: mapGender(userData.gender),
    city: userData.city || "",
    state: userData.state || "",
    country: userData.country || "",
    image: photo,
    avatarSeed: photo,
    coverSeed: photo,
    verified: Boolean(userData.isAdminVerified),
    premium: Boolean(userData.premiumMembership ?? userData.premium),
    online: false,
    willingToFly: false,
    headline: "",
    bio: "",
    ethnicity: "",
    height: "",
    bodyType: "",
    livingWith: "",
    relationshipStatus: "",
    religion: "",
    photos: photo ? [photo] : [],
    privatePhotosCount: 0,
  };

  return <MyProfileFeature lang={lang} dict={dict} user={user} />;
}
