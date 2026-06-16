import type { SuccessStory } from "./types";

export const sortOptions = [
  "Newest",
  "Photos & Videos",
  "Most Popular",
  "Dating",
  "Engaged",
  "Other",
  "My Post",
] as const;

export const successStories: SuccessStory[] = [
  {
    id: "6850123456789abcdef12345",
    user: {
      id: "6850abcdef12345678901234",
      name: "Sarah Johnson",
      username: "sarahjohnson",
      profileImage: "https://example.com/uploads/users/sarah-johnson.jpg",
    },
    relationshipStatus: "ENGAGED",
    title: "From First Message to Forever",
    story:
      "We matched on the app and instantly connected. After months of getting to know each other, meeting in person, and building a strong relationship, we got engaged. We are excited to share our journey and begin the next chapter together.",
    media: [
      {
        id: "m1",
        url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
        type: "image",
        alt: "Engagement celebration photo",
      },
      {
        id: "m2",
        url: "https://images.unsplash.com/photo-1523438097201-512ae7d59b7f?auto=format&fit=crop&w=1200&q=80",
        type: "image",
        alt: "Couple smiling together",
      },
    ],
    likesCount: 124,
    commentsCount: 18,
    createdAt: "2026-06-16T10:30:00Z",
    updatedAt: "2026-06-16T10:30:00Z",
    comments: [],
  },
  {
    id: "6850123456789abcdef12346",
    user: {
      id: "6850abcdef12345678901235",
      name: "Miguel Santos",
      username: "miguelsantos",
      profileImage: "https://example.com/uploads/users/miguel-santos.jpg",
    },
    relationshipStatus: "DATING",
    title: "A Coffee Date That Changed Everything",
    story:
      "What started as a simple coffee chat became our favorite ritual. We learned how to show up for each other, laugh through the awkward moments, and make time for the little things. One year later, we are still dating and stronger than ever.",
    media: [
      {
        id: "m3",
        url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
        type: "image",
        alt: "Casual date photo",
      },
      {
        id: "m4",
        url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
        type: "video",
        alt: "Short date video",
      },
    ],
    likesCount: 89,
    commentsCount: 9,
    createdAt: "2026-06-14T18:05:00Z",
    updatedAt: "2026-06-15T09:00:00Z",
    comments: [],
  },
  {
    id: "6850123456789abcdef12347",
    user: {
      id: "6850abcdef12345678901234",
      name: "Sarah Johnson",
      username: "sarahjohnson",
      profileImage: "https://example.com/uploads/users/sarah-johnson.jpg",
    },
    relationshipStatus: "OTHER",
    title: "Building Trust One Conversation at a Time",
    story:
      "We had both been cautious about dating online, but the honest conversations made the difference. This story is about patience, trust, and how a meaningful connection can grow when both people stay genuine.",
    media: [],
    likesCount: 51,
    commentsCount: 6,
    createdAt: "2026-06-10T08:20:00Z",
    updatedAt: "2026-06-11T14:20:00Z",
    comments: [],
  },
  {
    id: "6850123456789abcdef12348",
    user: {
      id: "6850abcdef12345678901236",
      name: "Amina Bello",
      username: "aminabello",
      profileImage: "https://example.com/uploads/users/amina-bello.jpg",
    },
    relationshipStatus: "ENGAGED",
    title: "Two Cities, One Future",
    story:
      "We were living in different cities, but the distance only made us more intentional. After many calls, visits, and long drives, we got engaged during a sunset proposal that felt like the perfect ending to our first chapter.",
    media: [
      {
        id: "m5",
        url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
        type: "image",
        alt: "Sunset proposal scene",
      },
    ],
    likesCount: 201,
    commentsCount: 25,
    createdAt: "2026-06-08T12:45:00Z",
    updatedAt: "2026-06-16T04:25:00Z",
    comments: [],
  },
];
