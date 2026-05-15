import "server-only";
import type { Comment } from "@/lib/types";

type Kind = "video" | "moment";

interface Likes {
  count: number;
  byCurrentUser: boolean;
}

const initialLikes: Record<string, number> = {
  "video:v_1": 12,
  "video:v_2": 4,
  "video:v_3": 7,
  "video:v_4": 22,
  "video:v_5": 3,
  "moment:m_1": 5,
  "moment:m_2": 4,
  "moment:m_3": 9,
  "moment:m_4": 1,
  "moment:m_5": 11,
};

const likeStore: Map<string, Likes> = new Map(
  Object.entries(initialLikes).map(([key, count]) => [key, { count, byCurrentUser: false }])
);

const commentStore: Map<string, Comment[]> = new Map();

function key(kind: Kind, id: string): string {
  return `${kind}:${id}`;
}

export function getLikes(kind: Kind, id: string): Likes {
  return likeStore.get(key(kind, id)) ?? { count: 0, byCurrentUser: false };
}

export function toggleLikeInStore(kind: Kind, id: string): Likes {
  const k = key(kind, id);
  const current = likeStore.get(k) ?? { count: 0, byCurrentUser: false };
  const next: Likes = current.byCurrentUser
    ? { count: Math.max(0, current.count - 1), byCurrentUser: false }
    : { count: current.count + 1, byCurrentUser: true };
  likeStore.set(k, next);
  return next;
}

export function getComments(kind: Kind, id: string, seed: Comment[] = []): Comment[] {
  const k = key(kind, id);
  if (!commentStore.has(k)) commentStore.set(k, [...seed]);
  return commentStore.get(k)!;
}

export function addCommentToStore(
  kind: Kind,
  id: string,
  comment: Comment,
  seed: Comment[] = []
): Comment[] {
  const list = getComments(kind, id, seed);
  list.push(comment);
  return list;
}
