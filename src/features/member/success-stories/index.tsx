import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/mock/current-user";
import { getProfileAction } from "@/features/member/settings/action";
import { getSuccessStories } from "./action";
import { SuccessStoriesPageClient } from "./SuccessStoriesPageClient";

export default async function SuccessStoriesFeature({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const mockMe = getCurrentUser();
  const [storiesResult, profileResult] = await Promise.all([
    getSuccessStories(),
    getProfileAction(),
  ]);
  const profile = profileResult.success ? profileResult.data : undefined;
  const me = {
    id: profile?._id ?? profile?.id ?? mockMe.id,
    username: profile?.name ?? profile?.username ?? mockMe.username,
    avatarSeed: profile?.profile ?? profile?.image ?? mockMe.avatarSeed,
  };

  return (
    <SuccessStoriesPageClient
      lang={lang}
      dict={dict}
      currentUser={{
        id: me.id,
        username: me.username,
        avatarSeed: me.avatarSeed,
      }}
      initialStories={storiesResult.stories}
    />
  );
}
