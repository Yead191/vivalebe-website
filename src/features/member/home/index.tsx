import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getCurrentUser, getCurrentViewedCount } from "@/lib/mock/current-user";
import { getUserById } from "@/lib/mock/users";
import { connections } from "@/lib/mock/connections";
import type { User } from "@/lib/types";
import { LeftSidebar } from "./LeftSidebar";
import { QuickSearch } from "./QuickSearch";
import { HomeTabs } from "./HomeTabs";
import type { HomeTab } from "./tabs";
import { RightSidebar } from "./RightSidebar";
import { getFeed } from "./action";
import { getMutualMatches } from "@/features/member/my-list/action";
import { getProfileAction } from "@/features/member/settings/action";

interface HomeFeatureProps {
  lang: Locale;
  dict: Dictionary;
  activeTab?: HomeTab;
}

export async function HomeFeature({
  lang,
  dict,
  activeTab = "videos",
}: HomeFeatureProps) {
  const mockMe = getCurrentUser();
  const viewedCount = getCurrentViewedCount();

  let me = mockMe;
  try {
    const profileRes = await getProfileAction();
    if (profileRes?.success && profileRes?.data) {
      const p = profileRes.data;
      me = {
        ...mockMe,
        id: p._id || p.id || mockMe.id,
        username: p.name || p.username || mockMe.username,
        displayName: p.name || p.displayName || mockMe.displayName,
        avatarSeed: p.profile || p.image || mockMe.avatarSeed,
        coverSeed: p.profile || p.image || mockMe.coverSeed,
      };
    }
  } catch (error) {
    console.error("Error fetching profile in home:", error);
  }

  const [videoFeed, imageFeed, suggestionsRaw] = await Promise.all([
    getFeed("VIDEO", 1, 20),
    getFeed("IMAGE", 1, 20),
    getMutualMatches(),
  ]);

  const authors: Record<string, User> = {
    ...videoFeed.authors,
    ...imageFeed.authors,
    [me.id]: me,
  };

  const suggestions = suggestionsRaw
    .filter((u) => u.id !== me.id)
    .slice(0, 4);

  const connectionEvents = connections.filter((c) => getUserById(c.userId));

  return (
    <div className="container py-6">
      <div className="grid gap-6 lg:gap-10 lg:grid-cols-[16rem_minmax(0,1fr)_16rem] xl:grid-cols-[11rem_minmax(0,1fr)_11rem]">
        <div className="hidden lg:block">
          <div className="sticky top-22">
            <LeftSidebar
              lang={lang}
              dict={dict}
              me={me}
              viewedCount={viewedCount}
            />
          </div>
        </div>

        <div className="min-w-0 space-y-5">
          <QuickSearch lang={lang} dict={dict} />
          <HomeTabs
            lang={lang}
            dict={dict}
            activeTab={activeTab}
            videos={videoFeed.videos}
            videoMeta={videoFeed.videoMeta}
            videoHasNextPage={videoFeed.pagination.hasNextPage}
            moments={imageFeed.moments}
            momentMeta={imageFeed.momentMeta}
            momentHasNextPage={imageFeed.pagination.hasNextPage}
            connections={connectionEvents}
            authors={authors}
            currentUserAvatarSeed={me.avatarSeed}
          />
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-22">
            <RightSidebar lang={lang} dict={dict} suggestions={suggestions} />
          </div>
        </div>
      </div>
    </div>
  );
}
