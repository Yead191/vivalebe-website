import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getCurrentUser, getCurrentViewedCount } from "@/lib/mock/current-user";
import { users, getUserById } from "@/lib/mock/users";
import { videos } from "@/lib/mock/videos";
import { moments } from "@/lib/mock/moments";
import { connections } from "@/lib/mock/connections";
import { getLikes, getComments } from "@/lib/mock/store";
import type { User } from "@/lib/types";
import { LeftSidebar } from "./LeftSidebar";
import { QuickSearch } from "./QuickSearch";
import { HomeTabs, type PostMeta } from "./HomeTabs";
import { RightSidebar } from "./RightSidebar";

interface HomeFeatureProps {
  lang: Locale;
  dict: Dictionary;
}

export function HomeFeature({ lang, dict }: HomeFeatureProps) {
  const me = getCurrentUser();
  const viewedCount = getCurrentViewedCount();

  const authors: Record<string, User> = Object.fromEntries(
    users.map((u) => [u.id, u])
  );

  const videoMeta: Record<string, PostMeta> = {};
  for (const v of videos) {
    const likes = getLikes("video", v.id);
    const comments = getComments("video", v.id, v.comments);
    videoMeta[v.id] = {
      likeCount: likes.count,
      liked: likes.byCurrentUser,
      comments,
      popularity: likes.count * 2 + comments.length,
    };
  }

  const momentMeta: Record<string, PostMeta> = {};
  for (const m of moments) {
    const likes = getLikes("moment", m.id);
    const comments = getComments("moment", m.id, m.comments);
    momentMeta[m.id] = {
      likeCount: likes.count,
      liked: likes.byCurrentUser,
      comments,
      popularity: likes.count * 2 + comments.length,
    };
  }

  const suggestions = users
    .filter((u) => u.id !== me.id)
    .slice(0, 4);

  const connectionEvents = connections.filter((c) => getUserById(c.userId));

  return (
    <div className="container py-6">
      <div className="grid gap-6 lg:gap-10 lg:grid-cols-[16rem_minmax(0,1fr)_16rem] xl:grid-cols-[11rem_minmax(0,1fr)_11rem]">
        <div className="hidden lg:block">
          <div className="sticky top-22">
            <LeftSidebar lang={lang} dict={dict} me={me} viewedCount={viewedCount} />
          </div>
        </div>

        <div className="min-w-0 space-y-5">
          <QuickSearch lang={lang} dict={dict} />
          <HomeTabs
            lang={lang}
            dict={dict}
            videos={videos}
            videoMeta={videoMeta}
            moments={moments}
            momentMeta={momentMeta}
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
