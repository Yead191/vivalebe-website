import type { Comment } from "@/lib/types";

export type DiseaseCategory =
  | "Herpes"
  | "Other STD(s)"
  | "Heart disease"
  | "Cancer"
  | "Obesity"
  | "Alzheimer's disease"
  | "Diabetes"
  | "Bacterial infections"
  | "Chronic respiratory diseases"
  | "Mental disorder";

export type DiseasePost = {
  id: string;
  authorId: string;
  title: string;
  body: string;
  disease: DiseaseCategory;
  createdAt: string;
  anonymous: boolean;
  likesCount: number;
  commentsCount: number;
  comments: DiseasePostComment[];
};

export type DiseasePostComment = Comment & {
  anonymous: boolean;
  likesCount: number;
};

