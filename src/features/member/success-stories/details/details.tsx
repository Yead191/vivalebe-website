import { notFound } from "next/navigation";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getCurrentUser } from "@/lib/mock/current-user";
import { getProfileAction } from "@/features/member/settings/action";
import { getSuccessStories } from "../action";
import { SuccessStoryDetailsClient } from "./details-client";

export default async function SuccessStoryDetailsFeature({
  lang,
  dict,
  storyId,
}: {
  lang: Locale;
  dict: Dictionary;
  storyId: string;
}) {
  const mockMe = getCurrentUser();
  const [storiesResult, profileResult] = await Promise.all([
    getSuccessStories(1, 100),
    getProfileAction(),
  ]);
  const story = storiesResult.stories.find((item) => item.id === storyId);
  if (!story) notFound();
  const profile = profileResult.success ? profileResult.data : undefined;
  const currentUser = {
    ...mockMe,
    id: profile?._id ?? profile?.id ?? mockMe.id,
    username: profile?.name ?? profile?.username ?? mockMe.username,
    avatarSeed: profile?.profile ?? profile?.image ?? mockMe.avatarSeed,
  };

  return (
    <SuccessStoryDetailsClient
      lang={lang}
      dict={dict}
      currentUser={currentUser}
      initialStory={story}
    />
  );
}
