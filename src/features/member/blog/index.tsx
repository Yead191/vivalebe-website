import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Comment } from "@/lib/types";
import { getCurrentUser } from "@/lib/mock/current-user";
import type { ApiBlog } from "./types";
import {
  buildAuthorsFromBlogs,
  mapApiBlogToPost,
} from "./mappers";
import { BlogPageClient } from "./BlogPageClient";

interface BlogFeatureProps {
  lang: Locale;
  dict: Dictionary;
  blogs: ApiBlog[];
  totalBlogs?: number;
}

export function BlogFeature({
  lang,
  dict,
  blogs,
  totalBlogs,
}: BlogFeatureProps) {
  const me = getCurrentUser();

  const mappedBlogs = blogs.map(mapApiBlogToPost);
  const authorsMap = buildAuthorsFromBlogs(blogs);

  const authorInfoMap: Record<
    string,
    { displayName: string; avatarSeed: string }
  > = Object.fromEntries(
    Object.values(authorsMap).map((u) => [
      u.id,
      { displayName: u.displayName, avatarSeed: u.avatarSeed },
    ]),
  );

  const likeMetaMap: Record<string, { count: number; liked: boolean }> = {};
  const commentCountMap: Record<string, number> = {};
  const commentMap: Record<string, Comment[]> = {};

  for (const blog of blogs) {
    likeMetaMap[blog._id] = { count: blog.totalLikes, liked: false };
    commentCountMap[blog._id] = blog.totalComments;
    commentMap[blog._id] = [];
  }

  const recentBlogs = [...mappedBlogs]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5)
    .map(({ id, title }) => ({ id, title }));

  return (
    <BlogPageClient
      lang={lang}
      dict={dict}
      blogs={mappedBlogs}
      authorsMap={authorsMap}
      authorInfoMap={authorInfoMap}
      likeMetaMap={likeMetaMap}
      commentMap={commentMap}
      commentCountMap={commentCountMap}
      currentUserAvatarSeed={me.avatarSeed}
      currentUserId={me.id}
      recentBlogs={recentBlogs}
      totalBlogs={totalBlogs ?? mappedBlogs.length}
    />
  );
}
