"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  PhotoEntry,
  ProfileDetails,
  User,
  VideoEntry,
} from "@/lib/types";

const storageKey = (userId: string) => `viveleve:my-profile:${userId}`;

type Updater = (prev: ProfileDetails) => ProfileDetails;

export interface MyProfileApi {
  hydrated: boolean;
  displayName: string;
  avatarUrl: string;
  details: ProfileDetails;
  updateDisplayName: (name: string) => void;
  updateAvatar: (url: string) => void;
  update: (updater: Updater) => void;
  addPhoto: (photo: PhotoEntry) => void;
  removePhoto: (id: string) => void;
  addVideo: (video: VideoEntry) => void;
  removeVideo: (id: string) => void;
  reset: () => void;
}

interface PersistedState {
  displayName: string;
  avatarUrl: string;
  details: ProfileDetails;
}

function buildInitial(user: User): PersistedState {
  return {
    displayName: user.displayName,
    avatarUrl: user.image ?? user.avatarSeed,
    details:
      user.profile ?? {
        photos: [],
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
      },
  };
}

export function useMyProfile(user: User): MyProfileApi {
  const [state, setState] = useState<PersistedState>(() => buildInitial(user));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(user.id));
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedState;
        setState(parsed);
      }
    } catch {
      // ignore corrupt localStorage entries; fall back to defaults
    }
    setHydrated(true);
  }, [user.id]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey(user.id), JSON.stringify(state));
    } catch {
      // quota or privacy mode — silently ignore
    }
  }, [state, hydrated, user.id]);

  const update = useCallback((updater: Updater) => {
    setState((prev) => ({ ...prev, details: updater(prev.details) }));
  }, []);

  const updateDisplayName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, displayName: name }));
  }, []);

  const updateAvatar = useCallback((url: string) => {
    setState((prev) => ({ ...prev, avatarUrl: url }));
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
    const fresh = buildInitial(user);
    setState(fresh);
    try {
      window.localStorage.removeItem(storageKey(user.id));
    } catch {
      // ignore
    }
  }, [user]);

  return {
    hydrated,
    displayName: state.displayName,
    avatarUrl: state.avatarUrl,
    details: state.details,
    updateDisplayName,
    updateAvatar,
    update,
    addPhoto,
    removePhoto,
    addVideo,
    removeVideo,
    reset,
  };
}
