"use client";

import { useCallback, useEffect, useState } from "react";
import type { PhotoEntry, ProfileDetails, User, VideoEntry } from "@/lib/types";
import { hasRealImageSrc } from "@/lib/image";
import { handleClientSubscriptionError } from "@/helpers/handleClientSubscriptionError";
import type { Locale } from "@/i18n/config";
import { getPrivateAlbum } from "./action";
import {
  albumAvatarUrl,
  albumDisplayName,
  albumFromResponse,
  applyAlbumToDetails,
  emptyUserInfo,
  mapAlbumUserInfo,
  type AlbumUserInfo,
} from "./albumMap";

const storageKey = (userId: string) => `viveleve:my-profile:${userId}`;

function clearProfileLocalStorage(userId: string) {
  try {
    window.localStorage.removeItem(storageKey(userId));
  } catch {
    // ignore
  }
}

type Updater = (prev: ProfileDetails) => ProfileDetails;

export interface MyProfileApi {
  hydrated: boolean;
  albumId: string | null;
  displayName: string;
  avatarUrl: string;
  userInfo: AlbumUserInfo;
  details: ProfileDetails;
  updateDisplayName: (name: string) => void;
  updateAvatar: (url: string) => void;
  update: (updater: Updater) => void;
  applyAlbum: (data: unknown) => void;
  setAlbumId: (id: string) => void;
  addPhoto: (photo: PhotoEntry) => void;
  removePhoto: (id: string) => void;
  addVideo: (video: VideoEntry) => void;
  removeVideo: (id: string) => void;
  reset: () => void;
}

interface PersistedState {
  albumId: string | null;
  displayName: string;
  avatarUrl: string;
  userInfo: AlbumUserInfo;
  details: ProfileDetails;
}

function emptyDetails(fallbackPhotos: PhotoEntry[]): ProfileDetails {
  return {
    photos: fallbackPhotos,
    videos: [],
    aboutMe: "",
    aboutMyMatch: "",
    preferences: {
      gender: "",
      ageMin: 18,
      ageMax: 99,
      distance: "Anywhere",
      lookingFor: "",
      matchLivesWith: "",
    },
    bodyShapeStory: "",
    inspirationalQuotes: "",
    conditionExperience: "",
    myFavorites: "",
    recommendations: "",
    basics: {
      livingWith: "",
      positiveSince: "",
      gender: "",
      willingToFly: "",
      willingToMeetSoon: "",
      location: "",
      height: "",
      weight: "",
      ethnicity: "",
      relationshipStatus: "",
      bodyType: "",
      eyeColor: "",
      hairColor: "",
    },
    extras: {
      languages: "",
      education: "",
      occupation: "",
      smoking: "",
      drinking: "",
      haveChildren: "",
      wantChildren: "",
      astrologicalSign: "",
      annualIncome: "",
      politicalViews: "",
      religion: "",
      havePets: "",
      hobbies: "",
      favoriteMusic: "",
    },
    personality: "",
  };
}

function buildInitial(user: User): PersistedState {
  const avatar = hasRealImageSrc(user.image ?? user.avatarSeed)
    ? (user.image ?? user.avatarSeed)
    : "";

  return {
    albumId: null,
    displayName: user.displayName,
    avatarUrl: avatar,
    userInfo: emptyUserInfo(),
    details: emptyDetails([]),
  };
}

export function useMyProfile(user: User, lang: Locale): MyProfileApi {
  const [state, setState] = useState<PersistedState>(() => buildInitial(user));
  const [hydrated, setHydrated] = useState(false);

  const applyAlbum = useCallback((data: unknown) => {
    const album = albumFromResponse(data);
    if (!album) return;

    setState((prev) => ({
      albumId: album._id || album.id || prev.albumId,
      displayName: albumDisplayName(album, prev.displayName),
      avatarUrl: albumAvatarUrl(album, prev.avatarUrl),
      userInfo: mapAlbumUserInfo(album.user),
      details: applyAlbumToDetails(prev.details, album),
    }));
  }, []);

  useEffect(() => {
    clearProfileLocalStorage(user.id);

    const fetchData = async () => {
      try {
        const res = await getPrivateAlbum();
        if (handleClientSubscriptionError(res, lang)) return;
        if (res.success && res.data) applyAlbum(res.data);
      } catch (err) {
        console.error("Error fetching private albums data", err);
      } finally {
        setHydrated(true);
      }
    };

    fetchData();
  }, [applyAlbum, lang, user.id]);

  const update = useCallback((updater: Updater) => {
    setState((prev) => ({ ...prev, details: updater(prev.details) }));
  }, []);

  const updateDisplayName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, displayName: name }));
  }, []);

  const updateAvatar = useCallback((url: string) => {
    setState((prev) => ({ ...prev, avatarUrl: url }));
  }, []);

  const setAlbumId = useCallback((id: string) => {
    setState((prev) => ({ ...prev, albumId: id }));
  }, []);

  const addPhoto = useCallback((photo: PhotoEntry) => {
    setState((prev) => ({
      ...prev,
      details: { ...prev.details, photos: [...prev.details.photos, photo] },
    }));
  }, []);

  const removePhoto = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        photos: prev.details.photos.filter((p) => p.id !== id),
      },
    }));
  }, []);

  const addVideo = useCallback((video: VideoEntry) => {
    setState((prev) => ({
      ...prev,
      details: { ...prev.details, videos: [...prev.details.videos, video] },
    }));
  }, []);

  const removeVideo = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        videos: prev.details.videos.filter((v) => v.id !== id),
      },
    }));
  }, []);

  const reset = useCallback(() => {
    setState(buildInitial(user));
    clearProfileLocalStorage(user.id);
  }, [user]);

  return {
    hydrated,
    albumId: state.albumId,
    displayName: state.displayName,
    avatarUrl: state.avatarUrl,
    userInfo: state.userInfo,
    details: state.details,
    updateDisplayName,
    updateAvatar,
    applyAlbum,
    setAlbumId,
    update,
    addPhoto,
    removePhoto,
    addVideo,
    removeVideo,
    reset,
  };
}
