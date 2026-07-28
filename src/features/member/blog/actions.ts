"use server";

import { myFetch } from "@/helpers/myFetch";
import { getImageUrl } from "@/helpers/getImageUrl";
import { revalidateTags } from "@/helpers/revalidateTags";
import type { Comment } from "@/lib/types";
import type { ApiBlog, ApiBlogComment } from "./types";
import { mapApiComment } from "./mappers";

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
