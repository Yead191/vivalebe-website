import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Comment, User } from "@/lib/types";
import { mockBlogs } from "@/constants/mockBlogData";
import { users } from "@/lib/mock/users";
import { getLikes, getComments } from "@/lib/mock/store";
import { getCurrentUser } from "@/lib/mock/current-user";
import { BlogPageClient } from "./BlogPageClient";

interface BlogFeatureProps {
  lang: Locale;
  dict: Dictionary;
}

export function BlogFeature({ lang, dict }: BlogFeatureProps) {
  const me = getCurrentUser();

  const authorsMap: Record<string, User> = Object.fromEntries(
    users.map((u) => [u.id, u])
  );

  const authorInfoMap: Record<string, { displayName: string; avatarSeed: string }> =
    Object.fromEntries(
      users.map((u) => [u.id, { displayName: u.displayName, avatarSeed: u.avatarSeed }])
    );

  const likeMetaMap: Record<string, { count: number; liked: boolean }> = {};
  const commentMap: Record<string, Comment[]> = {};

  for (const blog of mockBlogs) {
    const likes = getLikes("blog", blog.id);
    const comments = getComments("blog", blog.id, blog.comments);
    likeMetaMap[blog.id] = { count: likes.count, liked: likes.byCurrentUser };
    commentMap[blog.id] = comments;
  }

  const recentBlogs = [...mockBlogs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(({ id, title }) => ({ id, title }));

  return (
    <BlogPageClient
      lang={lang}
      dict={dict}
      blogs={mockBlogs}
      authorsMap={authorsMap}
      authorInfoMap={authorInfoMap}
      likeMetaMap={likeMetaMap}
      commentMap={commentMap}
      currentUserAvatarSeed={me.avatarSeed}
      currentUserId={me.id}
      recentBlogs={recentBlogs}
      totalBlogs={6945}
    />
  );
}
