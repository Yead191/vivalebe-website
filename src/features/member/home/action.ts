"use server";

import { getImageUrl } from "@/helpers/getImageUrl";
import { myFetch } from "@/helpers/myFetch";
import { revalidateTags } from "@/helpers/revalidateTags";
import type { Comment, MomentPost, User, VideoPost } from "@/lib/types";

export type FeedType = "VIDEO" | "IMAGE" | "ALL";

export interface PostMeta {
  likeCount: number;
  liked: boolean;
  comments: Comment[];
  popularity: number;
}

export interface FeedResult {
  videos: VideoPost[];
  moments: MomentPost[];
  videoMeta: Record<string, PostMeta>;
  momentMeta: Record<string, PostMeta>;
  authors: Record<string, User>;
}

function resolveMedia(url?: string | null): string {
  if (!url) return "";
  return getImageUrl(url) ?? url;
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

  const meta: PostMeta = {
    likeCount,
    liked: false,
    comments: [],
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

export async function getFeed(type: FeedType = "ALL"): Promise<FeedResult> {
  const url = type === "ALL" ? "/feed/" : `/feed/?type=${type}`;
  const res = await myFetch(url, {
    method: "GET",
    cache: "no-store",
    tags: ["feed", `feed-${type}`],
  });

  const videos: VideoPost[] = [];
  const moments: MomentPost[] = [];
  const videoMeta: Record<string, PostMeta> = {};
  const momentMeta: Record<string, PostMeta> = {};
  const authors: Record<string, User> = {};

  if (!res.success || !Array.isArray(res.data)) {
    return { videos, moments, videoMeta, momentMeta, authors };
  }

  for (const raw of res.data) {
    if (!raw || typeof raw !== "object") continue;
    const mapped = mapFeedItem(raw as Record<string, unknown>);
    if (mapped.author) authors[mapped.author.id] = mapped.author;

    if (mapped.type === "VIDEO" && mapped.video) {
      videos.push(mapped.video);
      videoMeta[mapped.video.id] = mapped.meta;
    }

    if (mapped.type === "IMAGE" && mapped.moment) {
      moments.push(mapped.moment);
      momentMeta[mapped.moment.id] = mapped.meta;
    }
  }

  return { videos, moments, videoMeta, momentMeta, authors };
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
