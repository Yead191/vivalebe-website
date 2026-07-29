"use client";

import { useCallback, useEffect, useState } from "react";
import type { PhotoEntry, ProfileDetails, User, VideoEntry } from "@/lib/types";
import { getPrivateAlbum } from "./action";

const storageKey = (userId: string) => `viveleve:my-profile:${userId}`;

type Updater = (prev: ProfileDetails) => ProfileDetails;

export interface MyProfileApi {
  hydrated: boolean;
  albumId: string | null;
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
  albumId: string | null;
  displayName: string;
  avatarUrl: string;
  details: ProfileDetails;
}

function buildInitial(user: User): PersistedState {
  const profilePhotos = user.profile?.photos ?? [];
  const defaultPhotos =
    profilePhotos.length > 0
      ? profilePhotos
      : user.photos.map((url, i) => ({
          id: `photo_${i}`,
          url,
          visibility: "public" as const,
          status: "approved" as const,
        }));

  return {
    albumId: null,
    displayName: user.displayName,
    avatarUrl: user.image ?? user.avatarSeed,
    details: user.profile
      ? { ...user.profile, photos: defaultPhotos }
      : {
          photos: defaultPhotos,
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

        // Sync photos if localStorage has no photos but user does
        if (
          parsed.details &&
          parsed.details.photos.length === 0 &&
          user.photos.length > 0
        ) {
          parsed.details.photos = user.photos.map((url, i) => ({
            id: `photo_${i}`,
            url,
            visibility: "public" as const,
            status: "approved" as const,
          }));
        }

        setState(parsed);
      }
    } catch {
      // ignore corrupt localStorage entries; fall back to defaults
    }

    // Fetch from backend
    const fetchData = async () => {
      try {
        const res = await getPrivateAlbum();
        if (res.success && res.data) {
          setState((prev) => ({
            ...prev,
            albumId: res.data._id || prev.albumId,
            details: {
              ...prev.details,
              aboutMe: res.data.aboutMe || prev.details.aboutMe,
              bodyShapeStory: res.data.bodyShape || prev.details.bodyShapeStory,
              inspirationalQuotes:
                res.data.motivateMe || prev.details.inspirationalQuotes,
              conditionExperience:
                res.data.myCondition || prev.details.conditionExperience,
              extras: {
                ...prev.details.extras,
                smoking: res.data.smoking || prev.details.extras.smoking,
                drinking: res.data.drinking || prev.details.extras.drinking,
                haveChildren:
                  res.data.haveChildren || prev.details.extras.haveChildren,
                wantChildren:
                  res.data.wantChildren || prev.details.extras.wantChildren,
                astrologicalSign:
                  res.data.astrologicalSign ||
                  prev.details.extras.astrologicalSign,
                annualIncome:
                  res.data.annualIncome || prev.details.extras.annualIncome,
                politicalViews:
                  res.data.politicalViews || prev.details.extras.politicalViews,
                religion: res.data.religion || prev.details.extras.religion,
                havePets: res.data.havePets || prev.details.extras.havePets,
                hobbies:
                  res.data.myHobbiesAndInterests?.join(", ") ||
                  prev.details.extras.hobbies,
                favoriteMusic:
                  res.data.myFavoriteMusic?.join(", ") ||
                  prev.details.extras.favoriteMusic,
              },
            },
          }));
        }
      } catch (err) {
        console.error("Error fetching private albums data", err);
      } finally {
        setHydrated(true);
      }
    };

    fetchData();
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
    albumId: state.albumId,
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
