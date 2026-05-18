"use server";

import { refresh } from "next/cache";
import { CURRENT_USER_ID } from "@/lib/mock/current-user";
import { videos } from "@/lib/mock/videos";
import { moments } from "@/lib/mock/moments";
import { mockBlogs } from "@/constants/mockBlogData";
import {
  toggleLikeInStore,
  addCommentToStore,
  getComments,
} from "@/lib/mock/store";

type Kind = "video" | "moment" | "blog";

function seedComments(kind: Kind, id: string) {
  if (kind === "video") return videos.find((v) => v.id === id)?.comments ?? [];
  if (kind === "moment") return moments.find((m) => m.id === id)?.comments ?? [];
  return mockBlogs.find((b) => b.id === id)?.comments ?? [];
}

export async function toggleLikeAction(kind: Kind, id: string) {
  const next = toggleLikeInStore(kind, id);
  refresh();
  return next;
}

export async function addCommentAction(kind: Kind, id: string, text: string) {
  const trimmed = text.trim();
  if (!trimmed) return getComments(kind, id, seedComments(kind, id));
  const updated = addCommentToStore(
    kind,
    id,
    {
      id: `c_${Date.now()}`,
      authorId: CURRENT_USER_ID,
      text: trimmed,
      createdAt: new Date().toISOString(),
    },
    seedComments(kind, id)
  );
  refresh();
  return updated;
}
