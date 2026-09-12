import type { ProfileDetails } from "@/lib/types";

const REQUIRED_TEXT = "Not specified";

const SMOKING = new Map([
  ["never", "never"],
  ["Never", "never"],
  ["social", "social"],
  ["Socially", "social"],
  ["tryToQuit", "tryToQuit"],
  ["Trying to quit", "tryToQuit"],
  ["regularly", "regularly"],
  ["Regularly", "regularly"],
]);

const DRINKING = new Map([
  ["never", "never"],
  ["Never", "never"],
  ["social", "social"],
  ["Socially", "social"],
  ["tryToQuit", "tryToQuit"],
  ["Trying to quit", "tryToQuit"],
  ["Sober", "tryToQuit"],
  ["regularly", "regularly"],
  ["Regularly", "regularly"],
]);

const HAVE_CHILDREN = new Map([
  ["no", "no"],
  ["No", "no"],
  ["yes-one", "yes-one"],
  ["Yes — one", "yes-one"],
  ["yes-two", "yes-two"],
  ["Yes — two", "yes-two"],
  ["yes-three-or-more", "yes-three-or-more"],
  ["Yes — three or more", "yes-three-or-more"],
]);

const WANT_CHILDREN = new Map([
  ["yes", "yes"],
  ["Yes", "yes"],
  ["no", "no"],
  ["No", "no"],
  ["maybe", "maybe"],
  ["Maybe", "maybe"],
  ["have-already", "have-already"],
  ["Already have", "have-already"],
]);

const SIGNS = new Map(
  [
    "aries",
    "taurus",
    "gemini",
    "cancer",
    "leo",
    "virgo",
    "libra",
    "scorpio",
    "sagittarius",
    "capricorn",
    "aquarius",
    "pisces",
  ].flatMap((sign) => [
    [sign, sign],
    [sign[0].toUpperCase() + sign.slice(1), sign],
  ]),
);

const POLITICAL = new Map([
  ["liberal", "liberal"],
  ["Liberal", "liberal"],
  ["conservative", "conservative"],
  ["Conservative", "conservative"],
  ["moderate", "moderate"],
  ["Moderate", "moderate"],
  ["apolitical", "apolitical"],
  ["Apolitical", "apolitical"],
  ["other", "other"],
  ["Other", "other"],
  ["Prefer not to say", "other"],
]);

const RELIGION = new Map([
  ["christian", "christian"],
  ["Christian", "christian"],
  ["Catholic", "christian"],
  ["muslim", "muslim"],
  ["Muslim", "muslim"],
  ["hindu", "hindu"],
  ["Hindu", "hindu"],
  ["buddhist", "buddhist"],
  ["Buddhist", "buddhist"],
  ["other", "other"],
  ["Other", "other"],
  ["Jewish", "other"],
  ["Atheist", "other"],
  ["Agnostic", "other"],
  ["Spiritual but not religious", "other"],
]);

const PETS = new Map([
  ["no", "no"],
  ["No", "no"],
  ["yes-dog", "yes-dog"],
  ["Yes — dog", "yes-dog"],
  ["yes-cat", "yes-cat"],
  ["Yes — cat", "yes-cat"],
  ["yes-other", "yes-other"],
  ["Yes — other", "yes-other"],
  ["Yes — both", "yes-other"],
]);

const INCOME = new Set([
  "preferNotToSay",
  "lessThan10000",
  "10000-20000",
  "20000-30000",
  "30000-40000",
  "40000-50000",
  "50000-60000",
  "60000-70000",
  "70000-80000",
  "80000-90000",
  "90000-100000",
  "100000-150000",
  "150000-200000",
  "200000-250000",
]);

function requiredText(value?: string) {
  const trimmed = (value ?? "").trim();
  return trimmed || REQUIRED_TEXT;
}

function appendEnum(
  formData: FormData,
  key: string,
  value: string | undefined,
  map: Map<string, string>,
) {
  const mapped = map.get((value ?? "").trim());
  if (mapped) formData.append(key, mapped);
}

export function buildPrivateAlbumFormData(
  details: ProfileDetails,
  files: File[] = [],
) {
  const formData = new FormData();
  const extras = details.extras;

  formData.append("aboutMe", requiredText(details.aboutMe));
  formData.append("bodyShape", requiredText(details.bodyShapeStory));
  formData.append("motivateMe", requiredText(details.inspirationalQuotes));
  formData.append("myCondition", requiredText(details.conditionExperience));

  appendEnum(formData, "smoking", extras.smoking, SMOKING);
  appendEnum(formData, "drinking", extras.drinking, DRINKING);
  appendEnum(formData, "haveChildren", extras.haveChildren, HAVE_CHILDREN);
  appendEnum(formData, "wantChildren", extras.wantChildren, WANT_CHILDREN);
  appendEnum(formData, "astrologicalSign", extras.astrologicalSign, SIGNS);

  const income = extras.annualIncome.trim();
  if (INCOME.has(income)) formData.append("annualIncome", income);

  appendEnum(formData, "politicalViews", extras.politicalViews, POLITICAL);
  appendEnum(formData, "religion", extras.religion, RELIGION);
  appendEnum(formData, "havePets", extras.havePets, PETS);

  for (const file of files) {
    if (file.type.startsWith("video/")) {
      formData.append("media", file);
    } else {
      formData.append("image", file);
    }
  }

  return formData;
}

export function mergeProfileDetails(
  current: ProfileDetails,
  patch: Partial<ProfileDetails>,
): ProfileDetails {
  return {
    ...current,
    ...patch,
    extras: patch.extras ? { ...current.extras, ...patch.extras } : current.extras,
    basics: patch.basics ? { ...current.basics, ...patch.basics } : current.basics,
    preferences: patch.preferences
      ? { ...current.preferences, ...patch.preferences }
      : current.preferences,
  };
}
