import { getImageUrl } from "@/helpers/getImageUrl";
import type { BlogPost, Comment, User } from "@/lib/types";
import type {
  ApiBlog,
  ApiBlogAuthor,
  ApiBlogComment,
  ApiBlogCommentAuthor,
} from "./types";

function resolveMediaUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  return getImageUrl(url);
}

function toUser(input: {
  id: string;
  name: string;
  profile?: string;
  country?: string;
  state?: string;
}): User {
  const profile = resolveMediaUrl(input.profile);

  return {
    id: input.id,
    username: input.id,
    displayName: input.name,
    age: 0,
    gender: "M",
    city: input.state ?? "",
    state: input.state ?? "",
    country: input.country ?? "",
    image: profile,
    avatarSeed: profile ?? input.id,
    coverSeed: input.id,
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

export function mapApiBlogToPost(blog: ApiBlog): BlogPost {
  const imageUrl = resolveMediaUrl(blog.imageUrl);

  return {
    id: blog._id,
    authorId: blog.userId._id,
    title: blog.title,
    content: blog.description,
    imageSeeds: imageUrl ? [imageUrl] : [],
    createdAt: blog.createdAt,
    tags: blog.tags ?? [],
    comments: [],
  };
}

export function mapApiBlogAuthor(author: ApiBlogAuthor): User {
  return toUser({
    id: author._id,
    name: author.name,
    profile: author.profile,
    country: author.country,
    state: author.state,
  });
}

export function mapApiComment(comment: ApiBlogComment): Comment {
  return {
    id: comment._id,
    authorId: comment.userId._id,
    text: comment.comment,
    createdAt: comment.createdAt,
  };
}

export function mapApiCommentAuthor(author: ApiBlogCommentAuthor): User {
  return toUser({
    id: author._id,
    name: author.name,
    profile: author.profile,
  });
}

export function buildAuthorsFromBlogs(blogs: ApiBlog[]): Record<string, User> {
  const map: Record<string, User> = {};
  for (const blog of blogs) {
    map[blog.userId._id] = mapApiBlogAuthor(blog.userId);
  }
  return map;
}

export function buildAuthorsFromComments(
  comments: ApiBlogComment[],
): Record<string, User> {
  const map: Record<string, User> = {};
  for (const comment of comments) {
    map[comment.userId._id] = mapApiCommentAuthor(comment.userId);
  }
  return map;
}
