import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/mock/current-user";
import { myFetch } from "@/helpers/myFetch";
import type { ApiBlog, ApiBlogComment } from "./types";
import {
  buildAuthorsFromBlogs,
  buildAuthorsFromComments,
  mapApiBlogToPost,
  mapApiComment,
} from "./mappers";
import { BlogDetailClient } from "./BlogDetailClient";

interface BlogDetailFeatureProps {
  lang: Locale;
  dict: Dictionary;
  blogId: string;
}

export async function BlogDetailFeature({
  lang,
  dict,
  blogId,
}: BlogDetailFeatureProps) {
  const [blogsRes, commentsRes] = await Promise.all([
    myFetch<ApiBlog[]>("/blogs", { cache: "no-store", tags: ["blogs"] }),
    myFetch<ApiBlogComment[]>(`/blog-comments/${blogId}`, {
      cache: "no-store",
      tags: [`blog-comments-${blogId}`],
    }),
  ]);

  const apiBlog = (blogsRes.data ?? []).find((b) => b._id === blogId);
  if (!apiBlog) notFound();

  const blog = mapApiBlogToPost(apiBlog);
  const authorsMap = {
    ...buildAuthorsFromBlogs([apiBlog]),
    ...buildAuthorsFromComments(commentsRes.data ?? []),
  };
  const author = authorsMap[apiBlog.userId._id];
  if (!author) notFound();

  const comments = (commentsRes.data ?? []).map(mapApiComment);
  const me = getCurrentUser();

  const authorInfoMap: Record<
    string,
    { displayName: string; avatarSeed: string }
  > = Object.fromEntries(
    Object.values(authorsMap).map((u) => [
      u.id,
      { displayName: u.displayName, avatarSeed: u.avatarSeed },
    ]),
  );

  return (
    <BlogDetailClient
      lang={lang}
      dict={dict}
      blog={blog}
      author={author}
      authorsMap={authorInfoMap}
      likeCount={apiBlog.totalLikes}
      liked={false}
      comments={comments}
      currentUserAvatarSeed={me.avatarSeed}
    />
  );
}
