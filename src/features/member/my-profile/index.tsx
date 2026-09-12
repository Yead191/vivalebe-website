"use client";

import { useCallback, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { ProfileDetails, ProfileExtras, User } from "@/lib/types";
import { useMyProfile } from "./useMyProfile";
import { ProfileSidebar, type NavItem } from "./components/ProfileSidebar";
import { PhotosBlock } from "./components/PhotosBlock";
import { EditableText } from "./components/EditableText";
import {
  EditableRows,
  type FieldDef,
  type FieldValues,
} from "./components/EditableRows";
import {
  ANNUAL_INCOME,
  ASTROLOGICAL_SIGN,
  DRINKING,
  HAVE_CHILDREN,
  HAVE_PETS,
  POLITICAL_VIEWS,
  RELIGION,
  SMOKING,
  WANT_CHILDREN,
} from "./components/fieldOptions";
import { getPrivateAlbum, savePrivateAlbum } from "./action";
import {
  buildPrivateAlbumFormData,
  mergeProfileDetails,
} from "./albumFormData";
import { formatAlbumLabel, formatMeasure } from "./albumMap";
import { handleClientSubscriptionError } from "@/helpers/handleClientSubscriptionError";
import { toast } from "sonner";

interface MyProfileFeatureProps {
  lang: Locale;
  dict: Dictionary;
  user: User;
}

const NAV_ITEMS: NavItem[] = [{ id: "summary", label: "Profile" }];

const LIFESTYLE_FIELDS: FieldDef[] = [
  { key: "smoking", label: "Smoking", type: "select", options: SMOKING },
  { key: "drinking", label: "Drinking", type: "select", options: DRINKING },
  {
    key: "haveChildren",
    label: "Have children",
    type: "select",
    options: HAVE_CHILDREN,
  },
  {
    key: "wantChildren",
    label: "Want children",
    type: "select",
    options: WANT_CHILDREN,
  },
  {
    key: "astrologicalSign",
    label: "Astrological sign",
    type: "select",
    options: ASTROLOGICAL_SIGN,
  },
  {
    key: "annualIncome",
    label: "Annual income",
    type: "select",
    options: ANNUAL_INCOME,
  },
  {
    key: "politicalViews",
    label: "Political views",
    type: "select",
    options: POLITICAL_VIEWS,
  },
  { key: "religion", label: "Religion", type: "select", options: RELIGION },
  { key: "havePets", label: "Have pets", type: "select", options: HAVE_PETS },
];

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[10rem_minmax(0,1fr)] gap-3 items-start py-2">
      <dt className="text-sm text-foreground">{label}:</dt>
      <dd className="text-sm text-foreground">{value || "—"}</dd>
    </div>
  );
}

export default function MyProfileFeature({ lang, user }: MyProfileFeatureProps) {
  const profile = useMyProfile(user, lang);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const updateDetails = useCallback(
    (patch: Partial<ProfileDetails>) => {
      profile.update((prev) => mergeProfileDetails(prev, patch));
    },
    [profile],
  );

  const handleSaveAll = useCallback(async () => {
    setSaving(true);
    try {
      const formData = buildPrivateAlbumFormData(profile.details, pendingFiles);
      const res = await savePrivateAlbum(formData);
      if (handleClientSubscriptionError(res, lang)) return;
      if (!res.success) {
        toast.error(res.error || res.message || "Failed to update profile.");
        return;
      }
      const albumId = res.data?._id || res.data?.id;
      if (albumId) profile.setAlbumId(albumId);
      if (res.data) profile.applyAlbum(res.data);
      const latest = await getPrivateAlbum();
      if (latest.success && latest.data) profile.applyAlbum(latest.data);
      setPendingFiles([]);
      toast.success("Profile saved successfully!");
    } catch {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  }, [lang, pendingFiles, profile]);

  const handleLifestyleChange = (next: FieldValues) => {
    const extras: ProfileExtras = {
      ...profile.details.extras,
      smoking: String(next.smoking ?? ""),
      drinking: String(next.drinking ?? ""),
      haveChildren: String(next.haveChildren ?? ""),
      wantChildren: String(next.wantChildren ?? ""),
      astrologicalSign: String(next.astrologicalSign ?? ""),
      annualIncome: String(next.annualIncome ?? ""),
      politicalViews: String(next.politicalViews ?? ""),
      religion: String(next.religion ?? ""),
      havePets: String(next.havePets ?? ""),
    };
    updateDetails({ extras });
  };

  const handleAddMedia = (file: File) => {
    const url = URL.createObjectURL(file);
    profile.addVideo({
      id: `pending_media_${Date.now()}`,
      url,
      thumbnail: url,
      durationSeconds: 0,
      visibility: "private",
    });
    setPendingFiles((prev) => [...prev, file]);
  };

  if (!profile.hydrated) {
    return (
      <div className="container py-6">
        <div className="h-[60vh] animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  const { details, userInfo } = profile;
  const hasUserInfo = Boolean(
    userInfo.bio ||
      userInfo.education ||
      userInfo.height ||
      userInfo.weight ||
      userInfo.nationality ||
      userInfo.relationStatus,
  );

  return (
    <div className="container py-6">
      <div className="grid gap-8 md:grid-cols-[240px_minmax(0,1fr)]">
        <div className="md:sticky md:top-20 md:self-start">
          <ProfileSidebar
            avatarUrl={profile.avatarUrl}
            displayName={profile.displayName}
            age={user.age}
            navItems={NAV_ITEMS}
            activeId="summary"
            onNavigate={() => undefined}
            onAvatarChange={profile.updateAvatar}
            onDisplayNameSave={profile.updateDisplayName}
          />
        </div>

        <div className="space-y-8">
          <section id="summary" className="space-y-6 scroll-mt-24">
            <PhotosBlock
              photos={details.photos}
              defaultTab="private"
              onAdd={(arr, files) => {
                arr.forEach((p) => profile.addPhoto(p));
                setPendingFiles((prev) => [...prev, ...files]);
              }}
              onRemove={profile.removePhoto}
            />

            <section className="space-y-3 rounded-2xl border border-border/70 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-bold tracking-tight">Media</h3>
                <label className="cursor-pointer rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted">
                  Add video
                  <input
                    type="file"
                    accept="video/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAddMedia(file);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
              {details.videos.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {details.videos.map((video) => (
                    <div
                      key={video.id}
                      className="overflow-hidden rounded-md bg-black"
                    >
                      <video
                        src={video.url}
                        controls
                        className="aspect-video w-full"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No media uploaded yet.
                </p>
              )}
            </section>

            <div className="divide-y divide-border rounded-2xl border border-border/70 bg-white px-5 shadow-sm">
              {hasUserInfo ? (
                <section className="space-y-1 py-5">
                  <h3 className="text-sm font-bold text-foreground">
                    Profile info
                  </h3>
                  <dl>
                    <InfoRow label="Bio" value={userInfo.bio} />
                    <InfoRow
                      label="Education"
                      value={formatAlbumLabel(userInfo.education)}
                    />
                    <InfoRow
                      label="Height"
                      value={formatMeasure(userInfo.height, "cm")}
                    />
                    <InfoRow
                      label="Weight"
                      value={formatMeasure(userInfo.weight, "kg")}
                    />
                    <InfoRow label="Nationality" value={userInfo.nationality} />
                    <InfoRow
                      label="Relationship status"
                      value={formatAlbumLabel(userInfo.relationStatus)}
                    />
                  </dl>
                </section>
              ) : null}

              <EditableText
                title="About Me"
                placeholder="Share something true about who you are right now."
                value={details.aboutMe}
                onChange={(v) => updateDetails({ aboutMe: v })}
              />
              <EditableText
                title="Body Shape"
                placeholder="Share how you stay in shape."
                value={details.bodyShapeStory}
                onChange={(v) => updateDetails({ bodyShapeStory: v })}
              />
              <EditableText
                title="What Motivates Me"
                placeholder="Share quotes or habits that keep you going."
                value={details.inspirationalQuotes}
                onChange={(v) => updateDetails({ inspirationalQuotes: v })}
              />
              <EditableText
                title="My Condition"
                placeholder="Tell your story to inspire and guide others."
                value={details.conditionExperience}
                onChange={(v) => updateDetails({ conditionExperience: v })}
              />
              <EditableRows
                title="Lifestyle"
                fields={LIFESTYLE_FIELDS}
                values={{
                  smoking: details.extras.smoking,
                  drinking: details.extras.drinking,
                  haveChildren: details.extras.haveChildren,
                  wantChildren: details.extras.wantChildren,
                  astrologicalSign: details.extras.astrologicalSign,
                  annualIncome: details.extras.annualIncome,
                  politicalViews: details.extras.politicalViews,
                  religion: details.extras.religion,
                  havePets: details.extras.havePets,
                }}
                onChange={handleLifestyleChange}
              />
            </div>
          </section>

          <div className="sticky bottom-4 z-20 flex justify-end pt-2">
            <button
              type="button"
              disabled={saving}
              onClick={handleSaveAll}
              className="rounded-full bg-[#429CA8] px-8 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#357D87] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {saving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
