import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getBlogById } from "@/constants/mockBlogData";
import { getUserById, users } from "@/lib/mock/users";
import { getLikes, getComments } from "@/lib/mock/store";
import { getCurrentUser } from "@/lib/mock/current-user";
import { BlogDetailClient } from "./BlogDetailClient";

interface BlogDetailFeatureProps {
  lang: Locale;
  dict: Dictionary;
  blogId: string;
}

export function BlogDetailFeature({ lang, dict, blogId }: BlogDetailFeatureProps) {
  const blog = getBlogById(blogId);
  if (!blog) notFound();

  const author = getUserById(blog.authorId);
  if (!author) notFound();

  const me = getCurrentUser();
  const likes = getLikes("blog", blog.id);
  const comments = getComments("blog", blog.id, blog.comments);

  const authorsMap: Record<string, { displayName: string; avatarSeed: string }> =
    Object.fromEntries(
      users.map((u) => [u.id, { displayName: u.displayName, avatarSeed: u.avatarSeed }])
    );

  return (
    <BlogDetailClient
      lang={lang}
      dict={dict}
      blog={blog}
      author={author}
      authorsMap={authorsMap}
      likeCount={likes.count}
      liked={likes.byCurrentUser}
      comments={comments}
      currentUserAvatarSeed={me.avatarSeed}
    />
  );
}
