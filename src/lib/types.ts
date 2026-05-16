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
  profile?: ProfileDetails;
}

export interface PhotoEntry {
  id: string;
  url: string;
  visibility: "public" | "private" | "custom";
  status?: "approved" | "pending";
}

export interface VideoEntry {
  id: string;
  url: string;
  thumbnail: string;
  durationSeconds: number;
  visibility: "public" | "private";
}

export interface MatchPreferences {
  gender: "" | "Woman" | "Man" | "Couple";
  ageMin: number;
  ageMax: number;
  distance: "Anywhere" | "Within my country";
  lookingFor: string;
  matchLivesWith: string;
}

export interface ProfileBasics {
  livingWith: string;
  positiveSince: string;
  gender: "" | "Man" | "Woman" | "Couple";
  willingToFly: "" | "Yes" | "No";
  willingToMeetSoon: "" | "Yes" | "No";
  location: string;
  height: string;
  weight: string;
  ethnicity: string;
  relationshipStatus: string;
  bodyType: string;
  eyeColor: string;
  hairColor: string;
}

export interface ProfileExtras {
  languages: string;
  education: string;
  occupation: string;
  smoking: string;
  drinking: string;
  haveChildren: string;
  wantChildren: string;
  astrologicalSign: string;
  annualIncome: string;
  politicalViews: string;
  religion: string;
  havePets: string;
  hobbies: string;
  favoriteMusic: string;
}

export interface ProfileDetails {
  photos: PhotoEntry[];
  videos: VideoEntry[];
  aboutMe: string;
  aboutMyMatch: string;
  preferences: MatchPreferences;
  bodyShapeStory: string;
  inspirationalQuotes: string;
  conditionExperience: string;
  myFavorites: string;
  recommendations: string;
  basics: ProfileBasics;
  extras: ProfileExtras;
  personality: string;
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
