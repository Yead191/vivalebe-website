"use server";

import { myFetch } from "@/helpers/myFetch";
import { getImageUrl } from "@/helpers/getImageUrl";
import { revalidateTags } from "@/helpers/revalidateTags";
import type { BlogPost, Comment, User } from "@/lib/types";
import type { ApiBlog, ApiBlogAuthor, ApiBlogComment } from "./types";
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

export async function toggleBlogLikeAction(blogId: string) {
  const res = await myFetch<{
    liked?: boolean;
    isLiked?: boolean;
    likeCount?: number;
    totalLikes?: number;
  }>(`/blog-likes/${blogId}`, {
    method: "POST",
  });

  if (res.success) {
    await revalidateTags(["blogs", "blogs-my"]);
  }

  return {
    success: res.success,
    message: res.message ?? res.error ?? undefined,
    data: res.data,
  };
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

type EmbeddedBlog = Omit<ApiBlog, "userId"> & {
  userId: string | ApiBlogAuthor;
};

interface MyBlogInteraction {
  blogId: EmbeddedBlog;
}

function normalizeEmbeddedBlog(blog: EmbeddedBlog): ApiBlog {
  const author =
    typeof blog.userId === "string"
      ? {
          _id: blog.userId,
          name: "User",
        }
      : blog.userId;

  return { ...blog, userId: author };
}

async function buildBlogInteractionPayload(
  embeddedBlogs: EmbeddedBlog[],
  liked: boolean,
) {
  const uniqueBlogs = Array.from(
    new Map(embeddedBlogs.map((blog) => [blog._id, blog])).values(),
  ).map(normalizeEmbeddedBlog);

  const commentEntries = await Promise.all(
    uniqueBlogs.map(async (blog) => {
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

  const authorsMap = buildAuthorsFromBlogs(uniqueBlogs);
  const likeMetaMap: Record<string, { count: number; liked: boolean }> = {};
  const commentCountMap: Record<string, number> = {};
  const commentMap: Record<string, Comment[]> = {};

  for (const blog of uniqueBlogs) {
    likeMetaMap[blog._id] = { count: blog.totalLikes, liked };
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
    Object.values(authorsMap).map((user) => [
      user.id,
      { displayName: user.displayName, avatarSeed: user.avatarSeed },
    ]),
  );

  return {
    blogs: uniqueBlogs.map(mapApiBlogToPost),
    authorsMap,
    authorInfoMap,
    likeMetaMap,
    commentMap,
    commentCountMap,
  };
}

export async function getMyLikedBlogsAction() {
  const res = await myFetch<MyBlogInteraction[]>("/blog-likes/my", {
    method: "GET",
    cache: "no-store",
    tags: ["blogs-liked"],
  });

  if (!res.success || !Array.isArray(res.data)) {
    return {
      success: false as const,
      message: res.message ?? res.error ?? "Failed to fetch liked blogs",
    };
  }

  return {
    success: true as const,
    message: res.message,
    ...(await buildBlogInteractionPayload(
      res.data.map((item) => item.blogId),
      true,
    )),
  };
}

export async function getMyCommentedBlogsAction() {
  const res = await myFetch<MyBlogInteraction[]>("/blog-comments/my", {
    method: "GET",
    cache: "no-store",
    tags: ["blogs-commented"],
  });

  if (!res.success || !Array.isArray(res.data)) {
    return {
      success: false as const,
      message: res.message ?? res.error ?? "Failed to fetch commented blogs",
    };
  }

  return {
    success: true as const,
    message: res.message,
    ...(await buildBlogInteractionPayload(
      res.data.map((item) => item.blogId),
      false,
    )),
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
