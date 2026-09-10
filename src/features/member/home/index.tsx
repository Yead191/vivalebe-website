import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Gender, User } from "@/lib/types";
import { unstable_rethrow } from "next/navigation";
import { LeftSidebar } from "./LeftSidebar";
import { QuickSearch } from "./QuickSearch";
import { HomeTabs } from "./HomeTabs";
import type { HomeTab } from "./tabs";
import { RightSidebar } from "./RightSidebar";
import { getFeed, getRecentViewMe } from "./action";
import { getMutualMatches } from "@/features/member/my-list/action";
import { getProfileAction } from "@/features/member/settings/action";

interface HomeFeatureProps {
  lang: Locale;
  dict: Dictionary;
  activeTab?: HomeTab;
}

function mapGender(value: unknown): Gender {
  const v = String(value ?? "").toUpperCase();
  if (v === "W" || v === "FEMALE" || v === "WOMAN") return "W";
  if (v === "C" || v === "COUPLE") return "C";
  return "M";
}

function userFromProfile(p: Record<string, unknown> | null | undefined): User {
  const id = String(p?._id || p?.id || "");
  const photo = String(p?.profile || p?.image || p?.profileImage || "");
  return {
    id,
    username: String(p?.username || p?.name || ""),
    displayName: String(p?.name || p?.displayName || ""),
    age: Number(p?.age) || 0,
    gender: mapGender(p?.gender),
    city: String(p?.city || ""),
    state: String(p?.state || ""),
    country: String(p?.country || ""),
    avatarSeed: photo,
    coverSeed: photo,
    verified: Boolean(p?.isAdminVerified),
    premium: Boolean(p?.premiumMembership ?? p?.premium),
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
    photos: [],
    privatePhotosCount: 0,
  };
}

export async function HomeFeature({
  lang,
  dict,
  activeTab = "videos",
}: HomeFeatureProps) {
  let me = userFromProfile(null);
  let viewedCount = 0;

  try {
    const profileRes = await getProfileAction();
    if (profileRes?.success && profileRes?.data) {
      me = userFromProfile(profileRes.data);
    }
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error fetching profile in home:", error);
  }

  const [videoFeed, imageFeed, suggestionsRaw, viewMe] = await Promise.all([
    getFeed("VIDEO", 1, 20),
    getFeed("IMAGE", 1, 20),
    getMutualMatches(),
    getRecentViewMe(1, 20),
  ]);

  const authors: Record<string, User> = {
    ...videoFeed.authors,
    ...imageFeed.authors,
    ...viewMe.authors,
  };
  if (me.id) authors[me.id] = me;

  if (viewMe.total > 0) viewedCount = viewMe.total;

  const suggestions = suggestionsRaw.filter((u) => u.id !== me.id);

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
            connections={viewMe.connections}
            authors={authors}
            currentUserAvatarSeed={me.avatarSeed}
            isPremium={me.premium}
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
