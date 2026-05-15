import type { VideoPost } from "@/lib/types";

export const videos: VideoPost[] = [
  {
    id: "v_1",
    authorId: "u_maya",
    imageSeed: "video-maya-1",
    caption: "Sunday afternoon at the studio.",
    createdAt: "2026-05-12T10:14:00Z",
    comments: [
      { id: "c_1", authorId: "u_lucas", text: "Looking great!", createdAt: "2026-05-12T11:30:00Z" },
    ],
  },
  {
    id: "v_2",
    authorId: "u_camila",
    imageSeed: "video-camila-1",
    caption: "First spring walk of the year.",
    createdAt: "2026-05-11T08:00:00Z",
    comments: [],
  },
  {
    id: "v_3",
    authorId: "u_aurora",
    imageSeed: "video-aurora-1",
    caption: "Morning at the beach before the lineup got crowded.",
    createdAt: "2026-05-10T07:25:00Z",
    comments: [],
  },
  {
    id: "v_4",
    authorId: "u_olivia",
    imageSeed: "video-olivia-1",
    caption: "Sunset, no filter.",
    createdAt: "2026-05-09T18:55:00Z",
    comments: [],
  },
  {
    id: "v_5",
    authorId: "u_sofia",
    imageSeed: "video-sofia-1",
    caption: "End of class. Quiet studio.",
    createdAt: "2026-05-08T19:10:00Z",
    comments: [],
  },
];
