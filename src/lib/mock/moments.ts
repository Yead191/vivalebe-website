import type { MomentPost } from "@/lib/types";

export const moments: MomentPost[] = [
  {
    id: "m_1",
    authorId: "u_aurora",
    text: "Long weekend on the coast. Phone off, head clear.",
    imageSeeds: ["moment-aurora-1"],
    createdAt: "2026-05-13T16:00:00Z",
    comments: [
      { id: "mc_1", authorId: "u_pedro", text: "Looks peaceful.", createdAt: "2026-05-13T17:00:00Z" },
    ],
  },
  {
    id: "m_2",
    authorId: "u_beatriz",
    text: "uploaded 2 new photos",
    imageSeeds: ["moment-beatriz-1", "moment-beatriz-2"],
    createdAt: "2026-05-13T11:30:00Z",
    comments: [],
  },
  {
    id: "m_3",
    authorId: "u_camila",
    text: "First batch of the season — burnt orange and green oxide.",
    imageSeeds: ["moment-camila-1"],
    createdAt: "2026-05-12T09:45:00Z",
    comments: [],
  },
  {
    id: "m_4",
    authorId: "u_helena",
    text: "Quiet morning, second coffee, no plans.",
    imageSeeds: [],
    createdAt: "2026-05-11T08:20:00Z",
    comments: [],
  },
  {
    id: "m_5",
    authorId: "u_olivia",
    text: "Beach run. The water was cold and perfect.",
    imageSeeds: ["moment-olivia-1", "moment-olivia-2"],
    createdAt: "2026-05-10T07:00:00Z",
    comments: [],
  },
];
