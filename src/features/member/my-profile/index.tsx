"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type {
  MatchPreferences,
  ProfileBasics,
  ProfileDetails,
  ProfileExtras,
  User,
} from "@/lib/types";
import { useMyProfile } from "./useMyProfile";
import { ProfileSidebar, type NavItem } from "./components/ProfileSidebar";
import { PhotosBlock } from "./components/PhotosBlock";
import { VideosBlock } from "./components/VideosBlock";
import { EditableText } from "./components/EditableText";
import {
  EditableRows,
  type FieldDef,
  type FieldValues,
} from "./components/EditableRows";
import {
  ANNUAL_INCOME,
  ASTROLOGICAL_SIGN,
  BASIC_GENDER,
  BODY_TYPE,
  DISTANCE_OPTIONS,
  DRINKING,
  EDUCATION,
  ETHNICITY,
  EYE_COLOR,
  HAIR_COLOR,
  HAVE_CHILDREN,
  HAVE_PETS,
  LIVING_WITH,
  LOOKING_FOR,
  MATCH_LIVES_WITH,
  POLITICAL_VIEWS,
  POSITIVE_SINCE,
  PREFERENCE_GENDER,
  RELATIONSHIP_STATUS,
  RELIGION,
  SMOKING,
  WANT_CHILDREN,
} from "./components/fieldOptions";

interface MyProfileFeatureProps {
  lang: Locale;
  dict: Dictionary;
  user: User;
}

const NAV_ITEMS: NavItem[] = [
  { id: "summary", label: "Summary" },
  { id: "more-about-me", label: "More About Me" },
  { id: "moments", label: "Moments" },
  { id: "my-events", label: "My Events" },
  { id: "feedback", label: "Feedback" },
];

export default function MyProfileFeature({ user }: MyProfileFeatureProps) {
  const profile = useMyProfile(user);
  const [activeId, setActiveId] = useState<string>(NAV_ITEMS[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 1],
      }
    );

    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      sectionRefs.current[item.id] = el;
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavigate = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const preferenceFields: FieldDef[] = useMemo(
    () => [
      {
        key: "gender",
        label: "Gender",
        type: "select",
        options: PREFERENCE_GENDER,
      },
      {
        key: "ageRange",
        label: "Age range",
        type: "range",
        minKey: "ageMin",
        maxKey: "ageMax",
        min: 18,
        max: 99,
      },
      {
        key: "distance",
        label: "Distance",
        type: "select",
        options: DISTANCE_OPTIONS,
      },
      {
        key: "lookingFor",
        label: "Looking for",
        type: "select",
        options: LOOKING_FOR,
      },
      {
        key: "matchLivesWith",
        label: "My Match Lives with",
        type: "select",
        options: MATCH_LIVES_WITH,
      },
    ],
    []
  );

  const basicsFields: FieldDef[] = useMemo(
    () => [
      { key: "livingWith", label: "Living With", type: "select", options: LIVING_WITH },
      { key: "positiveSince", label: "Positive Since", type: "select", options: POSITIVE_SINCE },
      { key: "gender", label: "Gender", type: "select", options: BASIC_GENDER },
      { key: "willingToFly", label: "Willing to fly to meet?", type: "yesno" },
      {
        key: "willingToMeetSoon",
        label: "Willing to Meet in Person Next 7 Days?",
        type: "yesno",
      },
      { key: "location", label: "Location", type: "text", placeholder: "City, Country" },
      { key: "height", label: "Height", type: "text", placeholder: "e.g. 5' 10\" (178 cm)" },
      { key: "weight", label: "Weight", type: "text", emptyLabel: "Add", placeholder: "e.g. 75 kg" },
      { key: "ethnicity", label: "Ethnicity", type: "select", options: ETHNICITY },
      { key: "relationshipStatus", label: "Relationship status", type: "select", options: RELATIONSHIP_STATUS },
      { key: "bodyType", label: "Body type", type: "select", options: BODY_TYPE },
      { key: "eyeColor", label: "Eye color", type: "select", options: EYE_COLOR },
      { key: "hairColor", label: "Hair color", type: "select", options: HAIR_COLOR },
    ],
    []
  );

  const extrasFields: FieldDef[] = useMemo(
    () => [
      { key: "languages", label: "Languages", type: "text", placeholder: "e.g. English, Portuguese" },
      { key: "education", label: "Education", type: "select", options: EDUCATION },
      { key: "occupation", label: "Occupation", type: "text", placeholder: "e.g. Software engineer" },
      { key: "smoking", label: "Smoking", type: "select", options: SMOKING },
      { key: "drinking", label: "Drinking", type: "select", options: DRINKING },
      { key: "haveChildren", label: "Have children", type: "select", options: HAVE_CHILDREN },
      { key: "wantChildren", label: "Want children", type: "select", options: WANT_CHILDREN },
      { key: "astrologicalSign", label: "Astrological sign", type: "select", options: ASTROLOGICAL_SIGN },
      { key: "annualIncome", label: "Annual income", type: "select", options: ANNUAL_INCOME },
      { key: "politicalViews", label: "Political views", type: "select", options: POLITICAL_VIEWS },
      { key: "religion", label: "Religion", type: "select", options: RELIGION },
      { key: "havePets", label: "Have pets", type: "select", options: HAVE_PETS },
      { key: "hobbies", label: "My hobbies & interests", type: "text", placeholder: "e.g. Cycling, photography" },
      { key: "favoriteMusic", label: "My favorite music", type: "text", placeholder: "Genres or artists" },
    ],
    []
  );

  const updateDetails = useCallback(
    (patch: Partial<ProfileDetails>) => {
      profile.update((prev) => ({ ...prev, ...patch }));
    },
    [profile]
  );

  const handlePreferencesSave = (next: FieldValues) => {
    const updated: MatchPreferences = {
      gender: (next.gender as MatchPreferences["gender"]) || "",
      ageMin: Number(next.ageMin ?? 18),
      ageMax: Number(next.ageMax ?? 99),
      distance:
        (next.distance as MatchPreferences["distance"]) || "Anywhere",
      lookingFor: String(next.lookingFor ?? ""),
      matchLivesWith: String(next.matchLivesWith ?? ""),
    };
    updateDetails({ preferences: updated });
  };

  const handleBasicsSave = (next: FieldValues) => {
    const updated: ProfileBasics = {
      livingWith: String(next.livingWith ?? ""),
      positiveSince: String(next.positiveSince ?? ""),
      gender: (next.gender as ProfileBasics["gender"]) || "",
      willingToFly: (next.willingToFly as ProfileBasics["willingToFly"]) || "",
      willingToMeetSoon:
        (next.willingToMeetSoon as ProfileBasics["willingToMeetSoon"]) || "",
      location: String(next.location ?? ""),
      height: String(next.height ?? ""),
      weight: String(next.weight ?? ""),
      ethnicity: String(next.ethnicity ?? ""),
      relationshipStatus: String(next.relationshipStatus ?? ""),
      bodyType: String(next.bodyType ?? ""),
      eyeColor: String(next.eyeColor ?? ""),
      hairColor: String(next.hairColor ?? ""),
    };
    updateDetails({ basics: updated });
  };

  const handleExtrasSave = (next: FieldValues) => {
    const updated: ProfileExtras = {
      languages: String(next.languages ?? ""),
      education: String(next.education ?? ""),
      occupation: String(next.occupation ?? ""),
      smoking: String(next.smoking ?? ""),
      drinking: String(next.drinking ?? ""),
      haveChildren: String(next.haveChildren ?? ""),
      wantChildren: String(next.wantChildren ?? ""),
      astrologicalSign: String(next.astrologicalSign ?? ""),
      annualIncome: String(next.annualIncome ?? ""),
      politicalViews: String(next.politicalViews ?? ""),
      religion: String(next.religion ?? ""),
      havePets: String(next.havePets ?? ""),
      hobbies: String(next.hobbies ?? ""),
      favoriteMusic: String(next.favoriteMusic ?? ""),
    };
    updateDetails({ extras: updated });
  };

  if (!profile.hydrated) {
    return (
      <div className="container py-6">
        <div className="h-[60vh] animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  const { details } = profile;

  return (
    <div className="container py-6">
      <div className="grid gap-8 md:grid-cols-[240px_minmax(0,1fr)]">
        <div className="md:sticky md:top-20 md:self-start">
          <ProfileSidebar
            avatarUrl={profile.avatarUrl}
            displayName={profile.displayName}
            age={user.age}
            navItems={NAV_ITEMS}
            activeId={activeId}
            onNavigate={handleNavigate}
            onAvatarChange={profile.updateAvatar}
            onDisplayNameSave={profile.updateDisplayName}
          />
        </div>

        <div className="space-y-8">
          <section id="summary" className="space-y-6 scroll-mt-24">
            <PhotosBlock
              photos={details.photos}
              onAdd={(arr) =>
                arr.forEach((p) => profile.addPhoto(p))
              }
              onRemove={profile.removePhoto}
            />

            <VideosBlock
              videos={details.videos}
              onAdd={profile.addVideo}
              onRemove={profile.removeVideo}
            />

            <button
              type="button"
              className="flex w-full items-center justify-between border-y border-border py-3 text-sm font-semibold hover:text-brand transition-colors cursor-pointer"
            >
              Requests to Upload More to Albums
              <ChevronRight className="size-4" />
            </button>

            <div className="divide-y divide-border">
              <EditableText
                title="About Me (Important)"
                placeholder="Share something true about who you are right now."
                value={details.aboutMe}
                onSave={(v) => updateDetails({ aboutMe: v })}
              />
              <EditableText
                title="About My Match"
                placeholder="Describe the kind of person you're hoping to meet."
                value={details.aboutMyMatch}
                onSave={(v) => updateDetails({ aboutMyMatch: v })}
              />
              <EditableRows
                title="Preferences for My Matches"
                fields={preferenceFields}
                values={{
                  gender: details.preferences.gender,
                  ageMin: details.preferences.ageMin,
                  ageMax: details.preferences.ageMax,
                  distance: details.preferences.distance,
                  lookingFor: details.preferences.lookingFor,
                  matchLivesWith: details.preferences.matchLivesWith,
                }}
                onSave={handlePreferencesSave}
              />
              <EditableText
                title="How I Work Hard and Keep My Body in Shape"
                placeholder="Share how you stay in shape to encourage others to prioritize their health and wellness."
                value={details.bodyShapeStory}
                onSave={(v) => updateDetails({ bodyShapeStory: v })}
              />
              <EditableText
                title="The Inspirational Quotes that Motivate Me"
                placeholder="Share quotes that inspire you and reflect your values."
                value={details.inspirationalQuotes}
                onSave={(v) => updateDetails({ inspirationalQuotes: v })}
              />
              <EditableText
                title="Experience of Having My Condition"
                placeholder="Tell your story to inspire and guide others in similar situations."
                value={details.conditionExperience}
                onSave={(v) => updateDetails({ conditionExperience: v })}
              />
              <EditableText
                title="My Favorites"
                placeholder="Any other favorites you'd like to add."
                value={details.myFavorites}
                onSave={(v) => updateDetails({ myFavorites: v })}
              />
              <EditableText
                title="Things I Highly Recommend to the Community so Everyone Can Enjoy Them"
                placeholder="Share your favorite restaurants, brands, or activities."
                value={details.recommendations}
                onSave={(v) => updateDetails({ recommendations: v })}
              />
            </div>
          </section>

          <section
            id="more-about-me"
            className="space-y-6 scroll-mt-24 divide-y divide-border"
          >
            <EditableRows
              title="My Basics"
              fields={basicsFields}
              values={details.basics as unknown as FieldValues}
              onSave={handleBasicsSave}
            />
            <EditableRows
              title="More About Me"
              fields={extrasFields}
              values={details.extras as unknown as FieldValues}
              onSave={handleExtrasSave}
            />
            <EditableText
              title="My Personality"
              placeholder="How would you describe your personality? Share a little bit of who you are."
              value={details.personality}
              onSave={(v) => updateDetails({ personality: v })}
            />
          </section>

          <section id="moments" className="scroll-mt-24 py-5">
            <h3 className="text-sm font-bold">Moments</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your published moments will appear here.
            </p>
          </section>

          <section id="my-events" className="scroll-mt-24 py-5">
            <h3 className="text-sm font-bold">My Events</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Events you've created or RSVP&apos;d to will appear here.
            </p>
          </section>

          <section id="feedback" className="scroll-mt-24 py-5">
            <h3 className="text-sm font-bold">Feedback</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Feedback others have left on your profile will appear here.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
