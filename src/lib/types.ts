export type Gender = "M" | "W" | "C";

export type InterestedIn = "Man" | "Woman" | "Couple";

export interface User {
  id: string;
  username: string;
  displayName: string;
  age: number;
  gender: Gender;
  city: string;
  state: string;
  country: string;
  image?: string
  avatarSeed: string;
  coverSeed: string;
  verified: boolean;
  premium: boolean;
  online: boolean;
  willingToFly: boolean;
  headline: string;
  bio: string;
  ethnicity: string;
  height: string;
  bodyType: string;
  livingWith: string;
  relationshipStatus: string;
  religion: string;
  photos: string[];
  privatePhotosCount: number;
}

export interface VideoPost {
  id: string;
  authorId: string;
  imageSeed: string;
  caption?: string;
  createdAt: string;
  video: string;
  comments: Comment[];
}

export interface MomentPost {
  id: string;
  authorId: string;
  text?: string;
  imageSeeds: string[];
  createdAt: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface ConnectionEvent {
  id: string;
  userId: string;
  kind: "viewed" | "liked" | "winked";
  at: string;
}

export type FeedSort = "newest" | "popular";
