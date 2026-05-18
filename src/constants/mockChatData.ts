export const mockCurrentUser = {
  _id: "user_me",
  name: "Current User",
  image: "https://res.cloudinary.com/dknmebeee/image/upload/v1778908262/IMG_20260321_094922_ohirae.jpg",
  role: "MEMBER"
};

export const mockUsers = {
  user_1: { _id: "user_1", name: "Alice Johnson", image: "https://res.cloudinary.com/dknmebeee/image/upload/v1778908239/Screenshot_2026-05-15_154324_xcorgc.png", status: "active" },
  user_2: { _id: "user_2", name: "Bob Smith", image: "https://res.cloudinary.com/dknmebeee/image/upload/v1778908239/Screenshot_2026-05-15_154324_xcorgc.png", status: "active" },
  user_3: { _id: "user_3", name: "Charlie Brown", image: "https://res.cloudinary.com/dknmebeee/image/upload/v1778908239/Screenshot_2026-05-15_154324_xcorgc.png", status: "active" },
  user_4: { _id: "user_4", name: "Diana Prince", image: "https://res.cloudinary.com/dknmebeee/image/upload/v1778908239/Screenshot_2026-05-15_154324_xcorgc.png", status: "active" }
};

export const mockChatRooms = [
  {
    _id: "room_1",
    type: "direct",
    participants: [mockCurrentUser, mockUsers.user_1],
    lastMessage: {
      text: "Hey, are we still on for tomorrow?",
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    unreadMessages: 2,
  },
  {
    _id: "room_2",
    type: "direct",
    participants: [mockCurrentUser, mockUsers.user_2],
    lastMessage: {
      text: "Thanks for the help earlier!",
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    unreadMessages: 0,
  }
];

export const mockGroupRooms = [
  {
    _id: "group_1",
    type: "group",
    name: "General Public Group",
    image: "/user.png", // could be a group icon
    participants: [mockCurrentUser, mockUsers.user_1, mockUsers.user_2, mockUsers.user_3],
    lastMessage: {
      text: "Welcome everyone to the new group!",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    unreadMessages: 5,
  },
  {
    _id: "group_2",
    type: "group",
    name: "Project Planning",
    image: "/user.png",
    participants: [mockCurrentUser, mockUsers.user_1, mockUsers.user_4],
    lastMessage: {
      text: "Let's sync up on the roadmap.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    unreadMessages: 0,
  }
];

export const mockMessages: Record<string, any[]> = {
  room_1: [
    {
      _id: "msg_1_1",
      sender: mockUsers.user_1._id,
      text: "Hey there!",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      _id: "msg_1_2",
      sender: mockCurrentUser._id,
      text: "Hi Alice, how are you?",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
    },
    {
      _id: "msg_1_3",
      sender: mockUsers.user_1._id,
      text: "I'm good! Hey, are we still on for tomorrow?",
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    }
  ],
  room_2: [
    {
      _id: "msg_2_1",
      sender: mockUsers.user_2._id,
      text: "Could you send me the latest file?",
      createdAt: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    },
    {
      _id: "msg_2_2",
      sender: mockCurrentUser._id,
      text: "Sure, here it is.",
      createdAt: new Date(Date.now() - 1000 * 60 * 62).toISOString(),
    },
    {
      _id: "msg_2_3",
      sender: mockUsers.user_2._id,
      text: "Thanks for the help earlier!",
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    }
  ],
  group_1: [
    {
      _id: "msg_g1_1",
      sender: mockUsers.user_3._id,
      text: "Hello all!",
      createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    },
    {
      _id: "msg_g1_2",
      sender: mockUsers.user_1._id,
      text: "Welcome everyone to the new group!",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    }
  ],
  group_2: [
    {
      _id: "msg_g2_1",
      sender: mockUsers.user_4._id,
      text: "When are we meeting?",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
      _id: "msg_g2_2",
      sender: mockUsers.user_1._id,
      text: "Let's sync up on the roadmap.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    }
  ]
};
