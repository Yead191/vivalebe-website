"use server";

import { myFetch } from "@/helpers/myFetch";
import { getImageUrl } from "@/helpers/getImageUrl";
import { revalidateTags } from "@/helpers/revalidateTags";
import type { Comment } from "@/lib/types";
import type {
  ApiSuccessStory,
  ApiSuccessStoryComment,
  RelationshipStatus,
  SuccessStory,
  SuccessStoryMedia,
} from "./types";

function normalizeRelationshipStatus(value: string): RelationshipStatus {
  const normalized = value.toUpperCase();
  if (normalized === "ENGAGED") return "ENGAGED";
  if (normalized === "OTHER") return "OTHER";
  return "DATING";
}

function mediaType(url: string): SuccessStoryMedia["type"] {
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url) ? "video" : "image";
}

function mapApiComment(comment: ApiSuccessStoryComment): Comment {
  const populatedUser =
    typeof comment.userId === "string" ? undefined : comment.userId;
  const authorId =
    typeof comment.userId === "string" ? comment.userId : comment.userId._id;
  const authorName =
    populatedUser?.displayName || populatedUser?.name || "Community member";

  return {
    id: comment._id,
    authorId,
    text: comment.comment,
    createdAt: comment.createdAt,
    author: populatedUser
      ? {
          name: authorName,
          username: populatedUser.name || authorId,
          image:
            getImageUrl(populatedUser.profile) ??
            populatedUser.profile ??
            authorId,
        }
      : undefined,
  };
}

function mapApiSuccessStory(story: ApiSuccessStory): SuccessStory {
  const userId = story.userId._id || story.userId.id || "";
  const name = story.userId.displayName || story.userId.name || "User";

  return {
    id: story._id,
    user: {
      id: userId,
      name,
      username: story.userId.name || userId,
      profileImage:
        getImageUrl(story.userId.profile) ?? story.userId.profile ?? userId,
    },
    relationshipStatus: normalizeRelationshipStatus(story.relationshipStatus),
    title: story.title,
    story: story.description,
    media: (story.media ?? []).map((url, index) => ({
      id: `${story._id}-media-${index}`,
      url: getImageUrl(url) ?? url,
      type: mediaType(url),
      alt: story.title,
    })),
    likesCount: story.totalLikes ?? 0,
    isLiked: story.isLiked === true,
    commentsCount: story.totalComments ?? 0,
    createdAt: story.createdAt,
    updatedAt: story.updatedAt,
    comments: [],
  };
}

export async function getSuccessStories(page = 1, limit = 10) {
  const res = await myFetch<ApiSuccessStory[]>(
    `/success-story?page=${page}&limit=${limit}`,
    {
      method: "GET",
      cache: "no-store",
      tags: ["success-stories"],
    },
  );

  const stories = Array.isArray(res.data)
    ? res.data.map(mapApiSuccessStory)
    : [];
  const commentsEntries = await Promise.all(
    stories.map(async (story) => {
      if (!story.commentsCount) return [story.id, [] as Comment[]] as const;
      const commentsResult = await getSuccessStoryComments(story.id);
      return [story.id, commentsResult.comments] as const;
    }),
  );
  const commentsMap = new Map(commentsEntries);

  return {
    success: res.success,
    message: res.message ?? res.error ?? undefined,
    stories: stories.map((story) => ({
      ...story,
      comments: commentsMap.get(story.id) ?? [],
    })),
    pagination: {
      total: res.pagination?.total ?? res.data?.length ?? 0,
      page: res.pagination?.page ?? page,
      limit: res.pagination?.limit ?? limit,
      totalPage: res.pagination?.totalPage ?? 1,
    },
  };
}

export async function getSuccessStoryComments(successStoryId: string) {
  const res = await myFetch<ApiSuccessStoryComment[]>(
    `/success-story-comment/${successStoryId}`,
    {
      method: "GET",
      cache: "no-store",
      tags: [`success-story-comments-${successStoryId}`],
    },
  );

  return {
    success: res.success,
    message: res.message ?? res.error ?? undefined,
    comments: Array.isArray(res.data) ? res.data.map(mapApiComment) : [],
  };
}

export async function toggleSuccessStoryLikeAction(successStoryId: string) {
  const res = await myFetch<{
    liked?: boolean;
    isLiked?: boolean;
    totalLikes?: number;
    likesCount?: number;
  }>("/success-story-like", {
    method: "POST",
    body: { successStoryId },
  });

  if (res.success) {
    await revalidateTags(["success-stories"]);
  }

  return {
    success: res.success,
    message: res.message ?? res.error ?? undefined,
    data: res.data,
  };
}

export async function createSuccessStoryCommentAction(
  successStoryId: string,
  comment: string,
) {
  const trimmed = comment.trim();
  if (!trimmed) {
    return {
      success: false as const,
      message: "Comment is required",
      comments: [] as Comment[],
    };
  }

  const res = await myFetch<ApiSuccessStoryComment>("/success-story-comment", {
    method: "POST",
    body: { successStoryId, comment: trimmed },
  });

  if (!res.success) {
    const errorMessage = `${res.message ?? ""} ${res.error ?? ""}`;
    const isDuplicateComment =
      errorMessage.includes("E11000") ||
      errorMessage.includes("successStoryId_1_userId_1") ||
      errorMessage.toLowerCase().includes("duplicate key");

    return {
      success: false as const,
      message: isDuplicateComment
        ? "You have already commented on this success story."
        : "We couldn't post your comment. Please try again.",
      comments: [] as Comment[],
    };
  }

  await revalidateTags([
    "success-stories",
    `success-story-comments-${successStoryId}`,
  ]);
  const commentsResult = await getSuccessStoryComments(successStoryId);

  return {
    success: true as const,
    message: res.message,
    comments: commentsResult.comments,
  };
}

export async function createSuccessStoryAction(formData: FormData) {
  const res = await myFetch<ApiSuccessStory>("/success-story", {
    method: "POST",
    body: formData,
  });

  if (res.success) {
    await revalidateTags(["success-stories"]);
  }

  return {
    success: res.success,
    message: res.message ?? res.error ?? undefined,
    story: res.data ? mapApiSuccessStory(res.data) : undefined,
  };
}

export async function updateSuccessStoryAction(
  storyId: string,
  formData: FormData,
) {
  const res = await myFetch<ApiSuccessStory>(`/success-story/${storyId}`, {
    method: "PATCH",
    body: formData,
  });

  if (res.success) {
    await revalidateTags(["success-stories"]);
  }

  return {
    success: res.success,
    message: res.message ?? res.error ?? undefined,
    story: res.data ? mapApiSuccessStory(res.data) : undefined,
  };
}
