"use server";

import { getImageUrl } from "@/helpers/getImageUrl";
import { myFetch } from "@/helpers/myFetch";
import { revalidateTags } from "@/helpers/revalidateTags";
import type { Comment, ConnectionEvent, MomentPost, User, VideoPost } from "@/lib/types";

export type FeedType = "VIDEO" | "IMAGE" | "ALL";

export interface ApiPostCommentAuthor {
  _id: string;
  name: string;
  email?: string;
  profile?: string;
}

export interface ApiPostComment {
  _id: string;
  userId: ApiPostCommentAuthor;
  postId: string;
  comment: string;
  isPublish?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostMeta {
  likeCount: number;
  liked: boolean;
  comments: Comment[];
  commentCount: number;
  popularity: number;
}

export interface FeedPagination {
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export interface FeedResult {
  videos: VideoPost[];
  moments: MomentPost[];
  videoMeta: Record<string, PostMeta>;
  momentMeta: Record<string, PostMeta>;
  authors: Record<string, User>;
  pagination: FeedPagination;
}

function resolveMedia(url?: string | null): string {
  if (!url) return "";
  return getImageUrl(url) ?? url;
}

function mapApiComment(c: ApiPostComment): Comment {
  return {
    id: c._id,
    authorId: c.userId._id,
    text: c.comment,
    createdAt: c.createdAt,
  };
}

function mapCommentAuthor(author: ApiPostCommentAuthor): User {
  const profile = resolveMedia(author.profile);
  return {
    id: author._id,
    username: author.name,
    displayName: author.name,
    age: 0,
    gender: "M",
    city: "",
    state: "",
    country: "",
    image: profile,
    avatarSeed: profile || author._id || author.name,
    coverSeed: profile || "/image.png",
    verified: false,
    premium: false,
    online: false,
    willingToFly: false,
    headline: "",
    bio: "",
    ethnicity: "",
    height: "",
    bodyType: "",
    livingWith: "",
    relationshipStatus: "",
    religion: "",
    photos: profile ? [profile] : [],
    privatePhotosCount: 0,
  };
}

function commentAuthorsMini(comments: ApiPostComment[]) {
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

function mapAuthor(author: Record<string, unknown>): User {
  const id = String(author._id ?? author.id ?? "");
  const name = String(author.displayName ?? author.name ?? "User");
  const profile = resolveMedia(
    typeof author.profile === "string" ? author.profile : undefined,
  );

  return {
    id,
    username: String(author.name ?? name),
    displayName: name,
    age: 0,
    gender: "M",
    city: "",
    state: "",
    country: String(author.nationality ?? author.country ?? ""),
    image: profile,
    avatarSeed: profile || id || name,
    coverSeed: profile || "/image.png",
    verified: false,
    premium: false,
    online: false,
    willingToFly: false,
    headline: "",
    bio: "",
    ethnicity: "",
    height: "",
    bodyType: "",
    livingWith: "",
    relationshipStatus: "",
    religion: "",
    photos: profile ? [profile] : [],
    privatePhotosCount: 0,
  };
}

function mapFeedItem(item: Record<string, unknown>): {
  type: "VIDEO" | "IMAGE" | null;
  video?: VideoPost;
  moment?: MomentPost;
  meta: PostMeta;
  author: User | null;
} {
  const post =
    item.post && typeof item.post === "object"
      ? (item.post as Record<string, unknown>)
      : item;
  const authorRaw =
    item.author && typeof item.author === "object"
      ? (item.author as Record<string, unknown>)
      : null;

  const type =
    post.type === "VIDEO" || post.type === "IMAGE"
      ? (post.type as "VIDEO" | "IMAGE")
      : null;

  const content = Array.isArray(post.content)
    ? post.content
        .filter((c): c is string => typeof c === "string")
        .map(resolveMedia)
        .filter(Boolean)
    : [];

  const id = String(post._id ?? post.id ?? item._id ?? "");
  const authorId = authorRaw
    ? String(authorRaw._id ?? authorRaw.id ?? "")
    : String(post.user ?? "");
  const createdAt = String(
    post.createdAt ?? item.createdAt ?? new Date().toISOString(),
  );
  const description =
    typeof post.description === "string" ? post.description : "";
  const likeCount = typeof post.likeCount === "number" ? post.likeCount : 0;
  const commentCount =
    typeof post.commentCount === "number" ? post.commentCount : 0;
  const liked = post.isLiked === true;

  const meta: PostMeta = {
    likeCount,
    liked,
    comments: [],
    commentCount,
    popularity: likeCount * 2 + commentCount,
  };

  const author = authorRaw ? mapAuthor(authorRaw) : null;

  if (type === "VIDEO") {
    return {
      type,
      author,
      meta,
      video: {
        id,
        authorId: author?.id || authorId,
        imageSeed: author?.avatarSeed || content[0] || id,
        caption: description,
        createdAt,
        video: content[0] || "",
        comments: [],
      },
    };
  }

  if (type === "IMAGE") {
    return {
      type,
      author,
      meta,
      moment: {
        id,
        authorId: author?.id || authorId,
        text: description,
        imageSeeds: content.length > 0 ? content : [],
        createdAt,
        comments: [],
      },
    };
  }

  return { type: null, author, meta };
}

export async function getPostComments(postId: string): Promise<{
  comments: Comment[];
  commentCount: number;
  authors: Record<string, User>;
}> {
  try {
    const res = await myFetch<ApiPostComment[]>(`/comments/${postId}`, {
      method: "GET",
      cache: "no-store",
      tags: [`post-comments-${postId}`],
    });

    if (!res.success || !Array.isArray(res.data)) {
      return { comments: [], commentCount: 0, authors: {} };
    }

    const authors: Record<string, User> = {};
    for (const c of res.data) {
      if (c.userId?._id) {
        authors[c.userId._id] = mapCommentAuthor(c.userId);
      }
    }

    return {
      comments: res.data.map(mapApiComment),
      commentCount: res.pagination?.total ?? res.data.length,
      authors,
    };
  } catch (error) {
    console.error("Error fetching post comments:", error);
    return { comments: [], commentCount: 0, authors: {} };
  }
}

export async function createPostCommentAction(postId: string, comment: string) {
  const trimmed = comment.trim();
  if (!trimmed) {
    return {
      success: false as const,
      message: "Comment is required",
      comments: [] as Comment[],
      authors: {} as Record<string, { displayName: string; avatarSeed: string }>,
    };
  }

  const res = await myFetch<ApiPostComment>("/comments", {
    method: "POST",
    body: { comment: trimmed, postId },
  });

  if (!res.success) {
    return {
      success: false as const,
      message: res.message ?? res.error ?? "Failed to post comment",
      comments: [] as Comment[],
      authors: {} as Record<string, { displayName: string; avatarSeed: string }>,
    };
  }

  await revalidateTags(["feed", `post-comments-${postId}`]);

  const commentsRes = await myFetch<ApiPostComment[]>(`/comments/${postId}`, {
    cache: "no-store",
    tags: [`post-comments-${postId}`],
  });
  const apiComments = commentsRes.data ?? [];

  return {
    success: true as const,
    message: res.message,
    comments: apiComments.map(mapApiComment),
    authors: commentAuthorsMini(apiComments),
  };
}

export async function getFeed(
  type: FeedType = "ALL",
  page = 1,
  limit = 20,
): Promise<FeedResult> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (type !== "ALL") params.set("type", type);

  const res = await myFetch(`/feed/?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
    tags: ["feed", `feed-${type}`],
  });

  const emptyPagination: FeedPagination = {
    page,
    limit,
    hasNextPage: false,
  };

  const videos: VideoPost[] = [];
  const moments: MomentPost[] = [];
  const videoMeta: Record<string, PostMeta> = {};
  const momentMeta: Record<string, PostMeta> = {};
  const authors: Record<string, User> = {};

  if (!res.success || !Array.isArray(res.data)) {
    return {
      videos,
      moments,
      videoMeta,
      momentMeta,
      authors,
      pagination: emptyPagination,
    };
  }

  const postIds: string[] = [];

  for (const raw of res.data) {
    if (!raw || typeof raw !== "object") continue;
    const mapped = mapFeedItem(raw as Record<string, unknown>);
    if (mapped.author) authors[mapped.author.id] = mapped.author;

    if (mapped.type === "VIDEO" && mapped.video) {
      videos.push(mapped.video);
      videoMeta[mapped.video.id] = mapped.meta;
      if (mapped.meta.commentCount > 0) postIds.push(mapped.video.id);
    }

    if (mapped.type === "IMAGE" && mapped.moment) {
      moments.push(mapped.moment);
      momentMeta[mapped.moment.id] = mapped.meta;
      if (mapped.meta.commentCount > 0) postIds.push(mapped.moment.id);
    }
  }

  const commentEntries = await Promise.all(
    postIds.map(async (postId) => {
      const result = await getPostComments(postId);
      return [postId, result] as const;
    }),
  );

  for (const [postId, result] of commentEntries) {
    Object.assign(authors, result.authors);

    if (videoMeta[postId]) {
      videoMeta[postId] = {
        ...videoMeta[postId],
        comments: result.comments,
        commentCount: Math.max(
          videoMeta[postId].commentCount,
          result.commentCount,
        ),
        popularity:
          videoMeta[postId].likeCount * 2 +
          Math.max(videoMeta[postId].commentCount, result.commentCount),
      };
    }

    if (momentMeta[postId]) {
      momentMeta[postId] = {
        ...momentMeta[postId],
        comments: result.comments,
        commentCount: Math.max(
          momentMeta[postId].commentCount,
          result.commentCount,
        ),
        popularity:
          momentMeta[postId].likeCount * 2 +
          Math.max(momentMeta[postId].commentCount, result.commentCount),
      };
    }
  }

  return {
    videos,
    moments,
    videoMeta,
    momentMeta,
    authors,
    pagination: {
      page: res.pagination?.page ?? page,
      limit: res.pagination?.limit ?? limit,
      hasNextPage: res.pagination?.hasNextPage ?? false,
    },
  };
}

export async function togglePostLikeAction(postId: string) {
  try {
    const res = await myFetch("/likes", {
      method: "POST",
      body: { postId },
    });

    if (res.success) {
      await revalidateTags(["feed", "feed-VIDEO", "feed-IMAGE", "feed-ALL"]);
    }

    return {
      success: res.success,
      message: res.message ?? res.error ?? undefined,
      data: res.data as
        | { liked?: boolean; isLiked?: boolean; likeCount?: number }
        | undefined,
    };
  } catch (error) {
    console.error("Error toggling post like:", error);
    return {
      success: false,
      message: "Failed to update like",
      data: undefined,
    };
  }
}

export async function getRecentViewMe(page = 1, limit = 10): Promise<{
  connections: ConnectionEvent[];
  authors: Record<string, User>;
  total: number;
}> {
  try {
    const res = await myFetch(`/view-me?page=${page}&limit=${limit}`, {
      method: "GET",
      cache: "no-store",
      tags: ["view-me"],
    });

    if (!res.success || !Array.isArray(res.data)) {
      return { connections: [], authors: {}, total: 0 };
    }

    const connections: ConnectionEvent[] = [];
    const authors: Record<string, User> = {};

    for (const item of res.data) {
      if (!item || typeof item !== "object") continue;
      const raw = item as Record<string, unknown>;

      // Prefer populated viewer object; fall back to viewedUser (API shape used elsewhere)
      const viewerRaw =
        raw.user && typeof raw.user === "object"
          ? (raw.user as Record<string, unknown>)
          : raw.viewedUser && typeof raw.viewedUser === "object"
            ? (raw.viewedUser as Record<string, unknown>)
            : null;

      if (!viewerRaw) continue;

      const id = String(viewerRaw._id ?? viewerRaw.id ?? "");
      if (!id) continue;

      const name = String(viewerRaw.name ?? viewerRaw.displayName ?? "User");
      const profile = resolveMedia(
        typeof viewerRaw.profile === "string" ? viewerRaw.profile : undefined,
      );

      authors[id] = {
        id,
        username: name,
        displayName: name,
        age: 0,
        gender: "M",
        city: "",
        state: "",
        country: String(viewerRaw.nationality ?? ""),
        image: profile,
        avatarSeed: profile || id || name,
        coverSeed: profile || "/image.png",
        verified: false,
        premium: false,
        online: false,
        willingToFly: false,
        headline: "",
        bio: "",
        ethnicity: "",
        height: viewerRaw.height != null ? String(viewerRaw.height) : "",
        bodyType: "",
        livingWith: "",
        relationshipStatus: "",
        religion: "",
        photos: profile ? [profile] : [],
        privatePhotosCount: 0,
        education:
          typeof viewerRaw.education === "string"
            ? viewerRaw.education
            : undefined,
        weight: viewerRaw.weight != null ? String(viewerRaw.weight) : undefined,
      };

      connections.push({
        id: String(raw._id ?? `${id}-${raw.createdAt ?? ""}`),
        userId: id,
        kind: "viewed",
        at: String(raw.createdAt ?? raw.updatedAt ?? new Date().toISOString()),
      });
    }

    return {
      connections,
      authors,
      total: res.pagination?.total ?? connections.length,
    };
  } catch (error) {
    console.error("Error fetching view-me:", error);
    return { connections: [], authors: {}, total: 0 };
  }
}

export async function createPostAction(formData: FormData) {
  const res = await myFetch("/posts", {
    method: "POST",
    body: formData,
  });

  if (res.success) {
    await revalidateTags(["feed", "feed-VIDEO", "feed-IMAGE", "feed-ALL"]);
  }

  return res;
}

export async function updatePostAction(id: string, formData: FormData) {
  const res = await myFetch(`/posts/${id}`, {
    method: "PATCH",
    body: formData,
  });

  if (res.success) {
    await revalidateTags(["feed", "feed-VIDEO", "feed-IMAGE", "feed-ALL"]);
  }

  return res;
}

export async function reportPost(formData: FormData) {
  try {
    const res = await myFetch("/post-report", {
      method: "POST",
      body: formData, // passing FormData directly
    });
    return res;
  } catch (error) {
    console.error("Error reporting post:", error);
    return { success: false, message: "Failed to report" };
  }
}
