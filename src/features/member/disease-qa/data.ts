import type { DiseasePost } from "./types";

export const diseaseOptions = [
  "Herpes",
  "Other STD(s)",
  "Heart disease",
  "Cancer",
  "Obesity",
  "Alzheimer's disease",
  "Diabetes",
  "Bacterial infections",
  "Chronic respiratory diseases",
  "Mental disorder",
] as const;

export const diseaseQaPosts: DiseasePost[] = [
  {
    id: "dq_1",
    authorId: "u_lucas",
    title: "Anxiety about a new diagnosis",
    body: "I was recently diagnosed and I am trying to understand what to expect. What helped you feel calmer in the first few weeks?",
    disease: "Mental disorder",
    createdAt: "2026-06-14T11:00:00Z",
    anonymous: true,
    likesCount: 24,
    commentsCount: 3,
    comments: [
      { id: "dq1_c1", authorId: "u_maya", text: "Consistency helped me most. One day at a time.", createdAt: "2026-06-14T12:00:00Z", anonymous: false, likesCount: 8 },
      { id: "dq1_c2", authorId: "u_aurora", text: "I stayed off search engines and focused on verified sources.", createdAt: "2026-06-14T13:00:00Z", anonymous: true, likesCount: 5 },
    ],
  },
  {
    id: "dq_2",
    authorId: "u_maya",
    title: "Managing symptoms during busy workdays",
    body: "For people balancing treatment and work, how do you keep your energy up without overdoing it?",
    disease: "Diabetes",
    createdAt: "2026-06-13T09:20:00Z",
    anonymous: false,
    likesCount: 31,
    commentsCount: 4,
    comments: [
      { id: "dq2_c1", authorId: "u_camila", text: "Planning meals ahead saved me a lot of stress.", createdAt: "2026-06-13T10:10:00Z", anonymous: false, likesCount: 9 },
      { id: "dq2_c2", authorId: "u_pedro", text: "Short breaks and hydration made a bigger difference than I expected.", createdAt: "2026-06-13T10:40:00Z", anonymous: true, likesCount: 4 },
    ],
  },
  {
    id: "dq_3",
    authorId: "u_olivia",
    title: "What should I ask my specialist?",
    body: "I have my follow-up appointment soon. I want to make sure I ask the right questions and leave with a clear plan.",
    disease: "Other STD(s)",
    createdAt: "2026-06-12T15:10:00Z",
    anonymous: true,
    likesCount: 18,
    commentsCount: 2,
    comments: [
      { id: "dq3_c1", authorId: "u_helena", text: "Ask about treatment timing, side effects, and follow-up testing.", createdAt: "2026-06-12T16:02:00Z", anonymous: false, likesCount: 6 },
    ],
  },
];

