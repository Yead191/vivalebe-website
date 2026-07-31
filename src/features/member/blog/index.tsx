import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Comment, User } from "@/lib/types";
import { getCurrentUser } from "@/lib/mock/current-user";
import { myFetch } from "@/helpers/myFetch";
import type { ApiBlog, ApiBlogComment } from "./types";
import {
  buildAuthorsFromBlogs,
  buildAuthorsFromComments,
  mapApiBlogToPost,
  mapApiComment,
} from "./mappers";
import { BlogPageClient } from "./BlogPageClient";

interface BlogFeatureProps {
  lang: Locale;
  dict: Dictionary;
  blogs: ApiBlog[];
  totalBlogs?: number;
}

export async function BlogFeature({
  lang,
  dict,
  blogs,
  totalBlogs,
}: BlogFeatureProps) {
  const me = getCurrentUser();

  const [commentEntries, likedRes] = await Promise.all([
    Promise.all(
      blogs.map(async (blog) => {
        if (!blog.totalComments) {
          return [blog._id, [] as ApiBlogComment[]] as const;
        }
        const res = await myFetch<ApiBlogComment[]>(
          `/blog-comments/${blog._id}`,
          {
            cache: "no-store",
            tags: [`blog-comments-${blog._id}`],
          },
        );
        return [blog._id, res.data ?? []] as const;
      }),
    ),
    myFetch<{ blogId: { _id: string } | string }[]>("/blog-likes/my", {
      cache: "no-store",
      tags: ["blogs-liked"],
    }),
  ]);

  const likedIds = new Set(
    (likedRes.data ?? []).map((item) =>
      typeof item.blogId === "string" ? item.blogId : item.blogId._id,
    ),
  );

  const mappedBlogs = blogs.map(mapApiBlogToPost);
  const authorsMap: Record<string, User> = {
    ...buildAuthorsFromBlogs(blogs),
  };

  const likeMetaMap: Record<string, { count: number; liked: boolean }> = {};
  const commentCountMap: Record<string, number> = {};
  const commentMap: Record<string, Comment[]> = {};

  for (const blog of blogs) {
    likeMetaMap[blog._id] = {
      count: blog.totalLikes,
      liked: likedIds.has(blog._id),
    };
    commentCountMap[blog._id] = blog.totalComments;
  }

  for (const [blogId, apiComments] of commentEntries) {
    commentMap[blogId] = apiComments.map(mapApiComment);
    Object.assign(authorsMap, buildAuthorsFromComments(apiComments));
    commentCountMap[blogId] = Math.max(
      commentCountMap[blogId] ?? 0,
      apiComments.length,
    );
  }

  const authorInfoMap: Record<
    string,
    { displayName: string; avatarSeed: string }
  > = Object.fromEntries(
    Object.values(authorsMap).map((u) => [
      u.id,
      { displayName: u.displayName, avatarSeed: u.avatarSeed },
    ]),
  );

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
