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
  isLiked?: boolean;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
};

export type ApiSuccessStory = {
  _id: string;
  relationshipStatus: string;
  title: string;
  description: string;
  media: string[];
  totalLikes: number;
  totalComments: number;
  isLiked?: boolean;
  userId: {
    _id: string;
    id?: string;
    name: string;
    profile?: string;
    displayName?: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type ApiSuccessStoryComment = {
  _id: string;
  successStoryId: string;
  comment: string;
  userId:
    | string
    | {
        _id: string;
        name: string;
        profile?: string;
        displayName?: string;
      };
  createdAt: string;
  updatedAt: string;
};
