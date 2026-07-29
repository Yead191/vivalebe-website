import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/mock/current-user";
import MyProfileFeature from "@/features/member/my-profile";
import { getProfileAction } from "@/features/member/settings/action";
import type { User } from "@/lib/types";

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

export default async function MyProfilePage({
  params,
}: PageProps<"/[lang]/my-profile">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  
  // Use real user data instead of mock
  const profileRes = await getProfileAction();
  const userData = profileRes?.data || {};
  const mockUser = getCurrentUser(); // fallback for types

  const name = userData.name || userData.displayName || userData.username || "User";
  const profileImage =
    userData.profile ||
    userData.image ||
    userData.profileImage ||
    userData.avatarSeed ||
    mockUser.avatarSeed;

  const user: User = {
    ...mockUser,
    id: userData._id || userData.id || mockUser.id,
    username: userData.username || mockUser.username,
    displayName: name,
    age: userData.DOB ? calcAge(userData.DOB) : (userData.age || mockUser.age),
    image: profileImage,
    avatarSeed: profileImage,
    coverSeed: profileImage,
    photos: profileImage && profileImage !== "default" ? [profileImage] : [],
  };

  return <MyProfileFeature lang={lang} dict={dict} user={user} />;
}
