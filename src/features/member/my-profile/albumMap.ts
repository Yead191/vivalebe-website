import { getImageUrl } from "@/helpers/getImageUrl";
import { hasRealImageSrc } from "@/lib/image";
import type { PhotoEntry, ProfileDetails, VideoEntry } from "@/lib/types";

export type PrivateAlbumUser = {
  _id?: string;
  id?: string;
  name?: string;
  profile?: string;
  bio?: string;
  education?: string;
  height?: number | string;
  nationality?: string;
  relationStatus?: string;
  weight?: number | string;
};

export type PrivateAlbumData = {
  _id?: string;
  id?: string;
  user?: PrivateAlbumUser;
  images?: unknown;
  media?: unknown;
  protectedImages?: unknown;
  aboutMe?: string;
  bodyShape?: string;
  motivateMe?: string;
  myCondition?: string;
  myHobbiesAndInterests?: unknown;
  myFavoriteMusic?: unknown;
  smoking?: string;
  drinking?: string;
  haveChildren?: string;
  wantChildren?: string;
  astrologicalSign?: string;
  annualIncome?: string;
  politicalViews?: string;
  religion?: string;
  havePets?: string;
  havepets?: string;
};

export type AlbumUserInfo = {
  bio: string;
  education: string;
  height: string;
  weight: string;
  nationality: string;
  relationStatus: string;
};

export function albumFromResponse(data: unknown): PrivateAlbumData | null {
  if (!data) return null;
  if (Array.isArray(data)) {
    const first = data[0];
    return first && typeof first === "object"
      ? (first as PrivateAlbumData)
      : null;
  }
  if (typeof data === "object") return data as PrivateAlbumData;
  return null;
}

function asText(value: unknown): string {
  if (value == null) return "";
  return String(value);
}

function pickText(value: unknown, fallback: string): string {
  return value == null ? fallback : String(value);
}

function asListText(value: unknown): string {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean)
      .join(", ");
  }
  return asText(value);
}

function asPathList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is string => typeof item === "string" && item.trim().length > 0,
  );
}

function toPhoto(
  path: string,
  id: string,
  visibility: PhotoEntry["visibility"],
): PhotoEntry | null {
  const url = getImageUrl(path) || path;
  if (!hasRealImageSrc(path) && !hasRealImageSrc(url)) return null;
  return { id, url, visibility, status: "approved" };
}

function toVideo(path: string, id: string): VideoEntry {
  const url = getImageUrl(path) || path;
  return {
    id,
    url,
    thumbnail: url,
    durationSeconds: 0,
    visibility: "private",
  };
}

export function emptyUserInfo(): AlbumUserInfo {
  return {
    bio: "",
    education: "",
    height: "",
    weight: "",
    nationality: "",
    relationStatus: "",
  };
}

export function mapAlbumUserInfo(user?: PrivateAlbumUser): AlbumUserInfo {
  if (!user) return emptyUserInfo();
  return {
    bio: asText(user.bio),
    education: asText(user.education),
    height: user.height == null || user.height === "" ? "" : String(user.height),
    weight: user.weight == null || user.weight === "" ? "" : String(user.weight),
    nationality: asText(user.nationality),
    relationStatus: asText(user.relationStatus),
  };
}

export function mapAlbumPhotos(album: PrivateAlbumData): PhotoEntry[] {
  const images = asPathList(album.images)
    .map((path, i) => toPhoto(path, `album_img_${i}`, "private"))
    .filter((photo): photo is PhotoEntry => photo !== null);
  const protectedImages = asPathList(album.protectedImages)
    .map((path, i) => toPhoto(path, `album_protected_${i}`, "custom"))
    .filter((photo): photo is PhotoEntry => photo !== null);
  return [...images, ...protectedImages];
}

export function mapAlbumVideos(album: PrivateAlbumData): VideoEntry[] {
  return asPathList(album.media).map((path, i) =>
    toVideo(path, `album_media_${i}`),
  );
}

export function applyAlbumToDetails(
  current: ProfileDetails,
  album: PrivateAlbumData,
): ProfileDetails {
  const userInfo = mapAlbumUserInfo(album.user);
  return {
    ...current,
    photos: mapAlbumPhotos(album),
    videos: mapAlbumVideos(album),
    aboutMe: asText(album.aboutMe),
    bodyShapeStory: asText(album.bodyShape),
    inspirationalQuotes: asText(album.motivateMe),
    conditionExperience: asText(album.myCondition),
    extras: {
      ...current.extras,
      education: userInfo.education,
      hobbies: asListText(album.myHobbiesAndInterests),
      favoriteMusic: asListText(album.myFavoriteMusic),
      smoking: pickText(album.smoking, current.extras.smoking),
      drinking: pickText(album.drinking, current.extras.drinking),
      haveChildren: pickText(album.haveChildren, current.extras.haveChildren),
      wantChildren: pickText(album.wantChildren, current.extras.wantChildren),
      astrologicalSign: pickText(
        album.astrologicalSign,
        current.extras.astrologicalSign,
      ),
      annualIncome: pickText(album.annualIncome, current.extras.annualIncome),
      politicalViews: pickText(
        album.politicalViews,
        current.extras.politicalViews,
      ),
      religion: pickText(album.religion, current.extras.religion),
      havePets: pickText(
        album.havePets ?? album.havepets,
        current.extras.havePets,
      ),
    },
    basics: {
      ...current.basics,
      height: userInfo.height,
      weight: userInfo.weight,
      relationshipStatus: userInfo.relationStatus,
      location: userInfo.nationality,
    },
  };
}

export function albumAvatarUrl(
  album: PrivateAlbumData,
  fallback: string,
): string {
  const profile = album.user?.profile;
  if (!profile) return fallback;
  const url = getImageUrl(profile) || profile;
  return hasRealImageSrc(profile) || hasRealImageSrc(url) ? url : fallback;
}

export function albumDisplayName(
  album: PrivateAlbumData,
  fallback: string,
): string {
  return album.user?.name?.trim() || fallback;
}

export function formatAlbumLabel(value: string): string {
  if (!value || value === "Not specified") return value;
  return value
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatMeasure(value: string, unit: string): string {
  if (!value) return "";
  if (/[a-z]/i.test(value)) return value;
  return `${value} ${unit}`;
}
