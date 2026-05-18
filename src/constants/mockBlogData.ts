import type { BlogPost } from "@/lib/types";

export const mockBlogs: BlogPost[] = [
  {
    id: "blog_1",
    authorId: "u_aurora",
    title: "Single and Ready to Mingle",
    content:
      "Trying to date and getting to know someone while living with H can be difficult because of disclosure and the possibility of being rejected. With this app it seems promising because disclosure is not an issue.\n\nMy question to you all is, what is your experience with dating using this app? Have you met anyone or exchanged numbers/socials? I've been here for about a month now and I'm curious to hear your stories.\n\nThe community here seems so warm and supportive. I just want to know if anyone has had real success connecting with someone. Every interaction I've had so far has been kind and mature — which honestly surprised me. I think this might actually work.",
    imageSeeds: ["blog-aurora-beach-sunset"],
    createdAt: "2026-05-17T16:00:00Z",
    tags: ["dating", "disclosure", "community"],
    comments: [
      {
        id: "bc_1_1",
        authorId: "u_pedro",
        text: "I've met a few people through here, it's a great community!",
        createdAt: "2026-05-17T17:00:00Z",
      },
      {
        id: "bc_1_2",
        authorId: "u_maya",
        text: "Same here! The disclosure part is definitely easier on this platform.",
        createdAt: "2026-05-17T18:30:00Z",
      },
    ],
  },
  {
    id: "blog_2",
    authorId: "u_camila",
    title: "Hey All",
    content:
      "I'm new here and just wanted to say hi to everyone. I've been nervous about joining a community like this but everyone seems so kind and understanding.\n\nI teach history and paint on weekends, and I'm hoping to find genuine connections here. A little about me — I live in Porto, love long conversations over coffee, and I'm just looking for someone who gets it.\n\nThis whole journey of living with HPV has taught me so much about self-acceptance, and I'm ready to open up and share that journey with someone special. If you're also new here, let's be new together!",
    imageSeeds: [],
    createdAt: "2026-05-16T11:30:00Z",
    tags: ["introduction", "new member"],
    comments: [
      {
        id: "bc_2_1",
        authorId: "u_helena",
        text: "Welcome! This place is truly special.",
        createdAt: "2026-05-16T12:00:00Z",
      },
      {
        id: "bc_2_2",
        authorId: "u_sofia",
        text: "So glad you're here, Camila! You'll love it.",
        createdAt: "2026-05-16T13:15:00Z",
      },
    ],
  },
  {
    id: "blog_3",
    authorId: "u_helena",
    title: "How often do you let out your emotions? How, where, and when?",
    content:
      "As a nurse, I've spent twenty years holding space for other people's pain. But who holds space for mine?\n\nI've been thinking a lot lately about emotional release and how we, as people living with a diagnosis that carries stigma, often bottle things up even more than the average person. I cry in the car. I journal at 11pm. I call my sister on Sundays. I go for long walks when everything feels too heavy.\n\nI'm curious — what are your outlets? Do you talk to a therapist? Paint? Run? I believe our emotional health is as important as our physical health, and I want to start that conversation here.\n\nThere's no wrong answer. The point is to have an answer.",
    imageSeeds: ["blog-helena-journal-morning"],
    createdAt: "2026-05-15T09:20:00Z",
    tags: ["mental health", "emotions", "wellbeing"],
    comments: [
      {
        id: "bc_3_1",
        authorId: "u_sofia",
        text: "I do yoga and meditate. It helps so much.",
        createdAt: "2026-05-15T10:00:00Z",
      },
      {
        id: "bc_3_2",
        authorId: "u_aurora",
        text: "Running is my therapy. I put on a playlist and just go.",
        createdAt: "2026-05-15T11:30:00Z",
      },
      {
        id: "bc_3_3",
        authorId: "u_rafa",
        text: "Diving, honestly. Being underwater resets everything.",
        createdAt: "2026-05-15T14:00:00Z",
      },
    ],
  },
  {
    id: "blog_4",
    authorId: "u_maya",
    title: "The Courage It Takes to Disclose",
    content:
      "I remember the first time I had to tell someone. My hands were shaking, my voice was tight, and I had rehearsed the words so many times they no longer sounded like mine.\n\nHe was kind. He held my hand and said it didn't change anything. But what I realized afterward wasn't relief — it was pride. Pride in myself for being honest. That moment of vulnerability was one of the bravest things I've ever done.\n\nSince then, I've had three more disclosures. Two went well. One didn't. But I've learned that rejection after honesty is survivable. What's not survivable is hiding who you are indefinitely.\n\nI'm writing this for anyone who's about to have that conversation. You can do this. Your honesty is your strength.",
    imageSeeds: ["blog-maya-city-light"],
    createdAt: "2026-05-14T15:45:00Z",
    tags: ["disclosure", "courage", "relationships"],
    comments: [
      {
        id: "bc_4_1",
        authorId: "u_beatriz",
        text: "This is so beautifully written. Thank you for sharing.",
        createdAt: "2026-05-14T16:30:00Z",
      },
      {
        id: "bc_4_2",
        authorId: "u_larissa",
        text: "I needed to read this today. Saving this post.",
        createdAt: "2026-05-14T18:00:00Z",
      },
    ],
  },
  {
    id: "blog_5",
    authorId: "u_beatriz",
    title: "Finding Love Again After Diagnosis",
    content:
      "When I got my diagnosis three years ago, I was convinced my love life was over. I was 36, recently divorced, and carrying a new secret that felt impossible to share.\n\nBut here I am, three years later, in a meaningful relationship with someone I met right here on this platform. It wasn't instant. It wasn't without fear. But it happened.\n\nWhat changed wasn't my diagnosis — it was my relationship with it. I stopped seeing it as something to hide and started seeing it as a filter for finding people with emotional maturity, empathy, and courage.\n\nThis community gave me that shift in perspective. I hope my story gives someone else hope today.",
    imageSeeds: ["blog-beatriz-garden-morning", "blog-beatriz-coffee-balcony"],
    createdAt: "2026-05-13T10:00:00Z",
    tags: ["love", "hope", "success story"],
    comments: [
      {
        id: "bc_5_1",
        authorId: "u_maya",
        text: "This made my day. Congratulations on finding love!",
        createdAt: "2026-05-13T11:00:00Z",
      },
      {
        id: "bc_5_2",
        authorId: "u_tomas",
        text: "Thank you for sharing this. Truly inspiring.",
        createdAt: "2026-05-13T12:30:00Z",
      },
    ],
  },
  {
    id: "blog_6",
    authorId: "u_sofia",
    title: "Healing Through Yoga and Mindfulness",
    content:
      "Two years ago, when I received my diagnosis, I turned to yoga not just as exercise, but as a way to reconnect with my body — a body I had started to feel betrayed by.\n\nThrough breath and movement, I slowly rebuilt trust with myself. I teach yoga now, and I see this pattern in so many of my students. The diagnosis becomes a turning point, not just medically, but spiritually. You realize how much energy you've wasted on shame that could go toward growth.\n\nIf anyone here is curious about starting a mindfulness practice, I'd be happy to share some beginner resources. A simple 10-minute morning routine can genuinely change how you carry yourself through the day.\n\nLet's heal together.",
    imageSeeds: ["blog-sofia-yoga-beach"],
    createdAt: "2026-05-12T07:30:00Z",
    tags: ["wellness", "yoga", "mindfulness", "healing"],
    comments: [],
  },
  {
    id: "blog_7",
    authorId: "u_pedro",
    title: "Dating While Traveling — My Experience",
    content:
      "I run a kitchen in Madrid but I travel for work and pleasure fairly often. Dating with a diagnosis while traveling adds an interesting layer — you're already in a vulnerable position as a visitor, and then you add the disclosure conversation on top of it.\n\nI've had it go well in Tokyo, awkwardly in Amsterdam, and beautifully in Lisbon where I met someone incredible for about three weeks.\n\nMy takeaway: the geography doesn't matter as much as the human in front of you. People everywhere are capable of empathy. And platforms like this one make it easier to find the right ones before you even get on the plane.\n\nIf you travel for work or fun and want to swap notes, I'm always happy to chat.",
    imageSeeds: ["blog-pedro-kitchen-travel"],
    createdAt: "2026-05-11T14:00:00Z",
    tags: ["travel", "dating", "experience"],
    comments: [
      {
        id: "bc_7_1",
        authorId: "u_rafa",
        text: "The Lisbon mention — were you near the waterfront by any chance?",
        createdAt: "2026-05-11T15:00:00Z",
      },
    ],
  },
  {
    id: "blog_8",
    authorId: "u_rafa",
    title: "My First Month Here — Honest Thoughts",
    content:
      "One month ago I made an account here half expecting to delete it after a week. I'm a marine biologist in Recife — I spend more time underwater than on apps.\n\nBut here I am, still here, and honestly surprised by how genuine this community feels. I've had real conversations. Not just 'hey' and ghosting, but actual thoughtful exchanges with people who understand without needing an explanation.\n\nI haven't gone on a date yet from here, but I've made what feel like actual friends. That alone has made it worth it.\n\nIf you're on the fence about joining or engaging — just do it. The water's warm.",
    imageSeeds: ["blog-rafa-reef-dive", "blog-rafa-beach-recife"],
    createdAt: "2026-05-10T08:00:00Z",
    tags: ["new member", "community", "honest review"],
    comments: [
      {
        id: "bc_8_1",
        authorId: "u_pedro",
        text: "Great read. Same experience on my end.",
        createdAt: "2026-05-10T09:30:00Z",
      },
      {
        id: "bc_8_2",
        authorId: "u_camila",
        text: "The water's warm — I love that metaphor!",
        createdAt: "2026-05-10T10:00:00Z",
      },
    ],
  },
];

export function getBlogById(id: string): BlogPost | undefined {
  return mockBlogs.find((b) => b.id === id);
}
