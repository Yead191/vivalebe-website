"use server";

import { myFetch } from "@/helpers/myFetch";
import { getImageUrl } from "@/helpers/getImageUrl";
import { revalidateTags } from "@/helpers/revalidateTags";
import type { BlogPost, Comment, User } from "@/lib/types";
import type { ApiBlog, ApiBlogComment } from "./types";
import {
  buildAuthorsFromBlogs,
  buildAuthorsFromComments,
  mapApiBlogToPost,
  mapApiComment,
} from "./mappers";

function commentAuthorsMap(comments: ApiBlogComment[]) {
  return Object.fromEntries(
    comments.map((c) => [
      c.userId._id,
      {
        displayName: c.userId.name,
        avatarSeed: c.userId.profile
          ? (getImageUrl(c.userId.profile) ?? c.userId._id)
          : c.userId._id,
      },
    ]),
  ) as Record<string, { displayName: string; avatarSeed: string }>;
}

export async function createBlogAction(formData: FormData) {
  const res = await myFetch<ApiBlog>("/blogs", {
    method: "POST",
    body: formData,
  });

  if (res.success) {
    await revalidateTags(["blogs"]);
  }

  return res;
}

export async function getMyBlogsAction() {
  const res = await myFetch<ApiBlog[]>("/blogs/my", {
    method: "GET",
    cache: "no-store",
    tags: ["blogs", "blogs-my"],
  });

  if (!res.success || !Array.isArray(res.data)) {
    return {
      success: false as const,
      message: res.message ?? res.error ?? "Failed to fetch my blogs",
      blogs: [] as BlogPost[],
      authorsMap: {} as Record<string, User>,
      authorInfoMap: {} as Record<
        string,
        { displayName: string; avatarSeed: string }
      >,
      likeMetaMap: {} as Record<string, { count: number; liked: boolean }>,
      commentMap: {} as Record<string, Comment[]>,
      commentCountMap: {} as Record<string, number>,
    };
  }

  const blogs = res.data;
  const commentEntries = await Promise.all(
    blogs.map(async (blog) => {
      if (!blog.totalComments) {
        return [blog._id, [] as ApiBlogComment[]] as const;
      }
      const commentsRes = await myFetch<ApiBlogComment[]>(
        `/blog-comments/${blog._id}`,
        {
          cache: "no-store",
          tags: [`blog-comments-${blog._id}`],
        },
      );
      return [blog._id, commentsRes.data ?? []] as const;
    }),
  );

  const mappedBlogs = blogs.map(mapApiBlogToPost);
  const authorsMap: Record<string, User> = {
    ...buildAuthorsFromBlogs(blogs),
  };
  const likeMetaMap: Record<string, { count: number; liked: boolean }> = {};
  const commentCountMap: Record<string, number> = {};
  const commentMap: Record<string, Comment[]> = {};

  for (const blog of blogs) {
    likeMetaMap[blog._id] = { count: blog.totalLikes, liked: false };
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

  return {
    success: true as const,
    message: res.message,
    blogs: mappedBlogs,
    authorsMap,
    authorInfoMap,
    likeMetaMap,
    commentMap,
    commentCountMap,
  };
}

export async function createBlogCommentAction(blogId: string, comment: string) {
  const trimmed = comment.trim();
  if (!trimmed) {
    return {
      success: false as const,
      message: "Comment is required",
      comments: [] as Comment[],
      authors: {} as Record<string, { displayName: string; avatarSeed: string }>,
    };
  }

  const res = await myFetch<ApiBlogComment>("/blog-comments", {
    method: "POST",
    body: { blogId, comment: trimmed },
  });

  if (!res.success) {
    return {
      success: false as const,
      message: res.message ?? res.error ?? "Failed to post comment",
      comments: [] as Comment[],
      authors: {} as Record<string, { displayName: string; avatarSeed: string }>,
    };
  }

  await revalidateTags(["blogs", `blog-comments-${blogId}`]);

  const commentsRes = await myFetch<ApiBlogComment[]>(
    `/blog-comments/${blogId}`,
    { cache: "no-store", tags: [`blog-comments-${blogId}`] },
  );
  const apiComments = commentsRes.data ?? [];

  return {
    success: true as const,
    message: res.message,
    comments: apiComments.map(mapApiComment),
    authors: commentAuthorsMap(apiComments),
  };
}
