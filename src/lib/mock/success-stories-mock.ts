import type { SuccessStory } from "../../features/member/success-stories/types";

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
      profileImage: "https://res.cloudinary.com/dknmebeee/image/upload/v1778908239/Screenshot_2026-05-15_154324_xcorgc.png",
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
        id: "m9",
        url: "https://img.magnific.com/free-photo/young-couple-together-walking-autumn-park_1303-26183.jpg",
        type: "image",
        alt: "Couple smiling together",
      },
      {
        id: "m3",
        url: "https://images.pexels.com/photos/31559041/pexels-photo-31559041.jpeg?cs=srgb&dl=pexels-seljansalim-31559041.jpg&fm=jpg",
        type: "image",
        alt: "Engagement celebration photo",
      },
      {
        id: "m3",
        url: "https://img.magnific.com/premium-photo/stylish-couple-walking-hugging-by-sea-lovely-hipster-couple-enjoying-time-together_217236-19621.jpg?semt=ais_hybrid&w=740&q=80",
        type: "image",
        alt: "Engagement celebration photo",
      },
      {
        id: "m11",
        url: "https://i.pinimg.com/736x/19/84/2d/19842db5743a6aa0bd8591b0c4bf2968.jpg",
        type: "image",
        alt: "Engagement celebration photo",
      },
      {
        id: "m3",
        url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
        type: "image",
        alt: "Engagement celebration photo",
      },

    ],
    likesCount: 124,
    commentsCount: 18,
    createdAt: "2026-06-16T10:30:00Z",
    updatedAt: "2026-06-16T10:30:00Z",
    comments: [
      { id: "s1-c1", authorId: "u_maya", text: "This is so beautifully told. Congratulations.", createdAt: "2026-06-16T12:00:00Z" },
      { id: "s1-c2", authorId: "u_olivia", text: "The photos feel warm and honest. Love this for you both.", createdAt: "2026-06-16T12:15:00Z" },
      { id: "s1-c3", authorId: "u_sofia", text: "A gorgeous journey from first message to engagement.", createdAt: "2026-06-16T12:40:00Z" },
    ],
  },
  {
    id: "6850123456789abcdef12346",
    user: {
      id: "6850abcdef12345678901235",
      name: "Miguel Santos",
      username: "miguelsantos",
      profileImage: "https://res.cloudinary.com/dknmebeee/image/upload/v1778908239/Screenshot_2026-05-15_154324_xcorgc.png",
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
        url: "https://res.cloudinary.com/dknmebeee/video/upload/v1781581320/Pov-_You_are_a_big_fan_of_Argentina_off_shoulder_t_shirt_from-__clothing__flair_Qualit_i7jihy.mp4",
        type: "video",
        alt: "Short date video",
      },
      {
        id: "m2",
        url: "https://img.magnific.com/free-photo/young-couple-together-walking-autumn-park_1303-26183.jpg",
        type: "image",
        alt: "Couple smiling together",
      },
    ],
    likesCount: 89,
    commentsCount: 9,
    createdAt: "2026-06-14T18:05:00Z",
    updatedAt: "2026-06-15T09:00:00Z",
    comments: [
      { id: "s2-c1", authorId: "u_lucas", text: "The coffee-date energy here is unmatched.", createdAt: "2026-06-14T19:00:00Z" },
      { id: "s2-c2", authorId: "u_camila", text: "That video makes it feel like we are right there with you.", createdAt: "2026-06-14T19:20:00Z" },
      { id: "s2-c3", authorId: "u_aurora", text: "Simple moments really do become the best memories.", createdAt: "2026-06-14T20:05:00Z" },
    ],
  },
  {
    id: "6850123456789abcdef12347",
    user: {
      id: "6850abcdef12345678901234",
      name: "Sarah Johnson",
      username: "sarahjohnson",
      profileImage: "https://res.cloudinary.com/dknmebeee/image/upload/v1778908239/Screenshot_2026-05-15_154324_xcorgc.png",
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
    comments: [
      { id: "s3-c1", authorId: "u_pedro", text: "This kind of honesty is what builds something real.", createdAt: "2026-06-10T10:00:00Z" },
      { id: "s3-c2", authorId: "u_beatriz", text: "Patient conversations are underrated. Beautiful story.", createdAt: "2026-06-10T10:45:00Z" },
      { id: "s3-c3", authorId: "u_tomas", text: "A thoughtful reminder that trust takes time.", createdAt: "2026-06-10T11:10:00Z" },
    ],
  },
  {
    id: "6850123456789abcdef12348",
    user: {
      id: "6850abcdef12345678901236",
      name: "Amina Bello",
      username: "aminabello",
      profileImage: "https://res.cloudinary.com/dknmebeee/image/upload/v1778908239/Screenshot_2026-05-15_154324_xcorgc.png",
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
    comments: [
      { id: "s4-c1", authorId: "u_helena", text: "Two cities, one future. That line alone is powerful.", createdAt: "2026-06-08T13:15:00Z" },
      { id: "s4-c2", authorId: "u_rafa", text: "The sunset proposal is cinematic in the best way.", createdAt: "2026-06-08T13:40:00Z" },
      { id: "s4-c3", authorId: "u_maya", text: "So intentional and tender. Congrats to you both.", createdAt: "2026-06-08T14:05:00Z" },
    ],
  },
];
