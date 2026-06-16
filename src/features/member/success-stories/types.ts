import type { Comment } from "@/lib/types";

export type RelationshipStatus = "DATING" | "ENGAGED" | "OTHER";

export type SuccessStoriesSortKey =
  | "newest"
  | "media"
  | "popular"
  | "dating"
  | "engaged"
  | "other"
  | "mine";

export type SuccessStoryMedia = {
  id: string;
  url: string;
  type: "image" | "video";
  alt: string;
};

export type SuccessStory = {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    profileImage: string;
  };
  relationshipStatus: RelationshipStatus;
  title: string;
  story: string;
  media: SuccessStoryMedia[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
};
