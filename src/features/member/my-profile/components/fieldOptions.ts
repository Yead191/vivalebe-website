export const PREFERENCE_GENDER = ["Woman", "Man", "Couple"];
export const DISTANCE_OPTIONS = ["Anywhere", "Within my country"];
export const LOOKING_FOR = ["Long-term", "Marriage", "Casual", "Friendship"];
export const MATCH_LIVES_WITH = [
  "Doesn't matter",
  "HSV-1",
  "HSV-2 (G)",
  "HPV",
  "HIV",
  "Other",
];

export const LIVING_WITH = [
  "HSV-1",
  "HSV-2 (Oral)",
  "HSV-2 (Genital)",
  "HPV",
  "HIV",
  "Other",
];

export const POSITIVE_SINCE = [
  "Don't remember",
  "Before 2010",
  "2010-2015",
  "2016-2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
];

export const BASIC_GENDER = ["Man", "Woman", "Couple", "Non-binary"];

export const ETHNICITY = [
  "Asian",
  "Black",
  "Caucasian / White",
  "Latino / Hispanic",
  "Mixed",
  "Middle Eastern",
  "Native American",
  "Pacific Islander",
  "Other",
];

export const RELATIONSHIP_STATUS = [
  "Single",
  "Divorced",
  "Widowed",
  "Separated",
  "Open relationship",
];

export const BODY_TYPE = [
  "Slim",
  "Average",
  "Athletic",
  "Curvy",
  "A few extra pounds",
  "Shapely",
];

export const EYE_COLOR = [
  "Brown",
  "Blue",
  "Green",
  "Hazel",
  "Gray",
  "Amber",
  "Other",
];

export const HAIR_COLOR = [
  "Black",
  "Brown",
  "Blonde",
  "Red",
  "Gray",
  "Bald",
  "Other",
];

export const EDUCATION = [
  "High school",
  "Some college",
  "Associate degree",
  "Bachelor's degree",
  "Master's degree",
  "Doctorate",
  "Other",
];

export type SelectOption = { value: string; label: string };

export const SMOKING: SelectOption[] = [
  { value: "never", label: "Never" },
  { value: "social", label: "Socially" },
  { value: "tryToQuit", label: "Trying to quit" },
  { value: "regularly", label: "Regularly" },
];

export const DRINKING: SelectOption[] = [
  { value: "never", label: "Never" },
  { value: "social", label: "Socially" },
  { value: "tryToQuit", label: "Trying to quit" },
  { value: "regularly", label: "Regularly" },
];

export const HAVE_CHILDREN: SelectOption[] = [
  { value: "no", label: "No" },
  { value: "yes-one", label: "Yes — one" },
  { value: "yes-two", label: "Yes — two" },
  { value: "yes-three-or-more", label: "Yes — three or more" },
];

export const WANT_CHILDREN: SelectOption[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "maybe", label: "Maybe" },
  { value: "have-already", label: "Already have" },
];

export const ASTROLOGICAL_SIGN: SelectOption[] = [
  { value: "aries", label: "Aries" },
  { value: "taurus", label: "Taurus" },
  { value: "gemini", label: "Gemini" },
  { value: "cancer", label: "Cancer" },
  { value: "leo", label: "Leo" },
  { value: "virgo", label: "Virgo" },
  { value: "libra", label: "Libra" },
  { value: "scorpio", label: "Scorpio" },
  { value: "sagittarius", label: "Sagittarius" },
  { value: "capricorn", label: "Capricorn" },
  { value: "aquarius", label: "Aquarius" },
  { value: "pisces", label: "Pisces" },
];

export const ANNUAL_INCOME: SelectOption[] = [
  { value: "preferNotToSay", label: "Prefer not to say" },
  { value: "lessThan10000", label: "Less than $10k" },
  { value: "10000-20000", label: "$10k–$20k" },
  { value: "20000-30000", label: "$20k–$30k" },
  { value: "30000-40000", label: "$30k–$40k" },
  { value: "40000-50000", label: "$40k–$50k" },
  { value: "50000-60000", label: "$50k–$60k" },
  { value: "60000-70000", label: "$60k–$70k" },
  { value: "70000-80000", label: "$70k–$80k" },
  { value: "80000-90000", label: "$80k–$90k" },
  { value: "90000-100000", label: "$90k–$100k" },
  { value: "100000-150000", label: "$100k–$150k" },
  { value: "150000-200000", label: "$150k–$200k" },
  { value: "200000-250000", label: "$200k–$250k" },
];

export const POLITICAL_VIEWS: SelectOption[] = [
  { value: "liberal", label: "Liberal" },
  { value: "conservative", label: "Conservative" },
  { value: "moderate", label: "Moderate" },
  { value: "apolitical", label: "Apolitical" },
  { value: "other", label: "Other" },
];

export const RELIGION: SelectOption[] = [
  { value: "christian", label: "Christian" },
  { value: "muslim", label: "Muslim" },
  { value: "hindu", label: "Hindu" },
  { value: "buddhist", label: "Buddhist" },
  { value: "other", label: "Other" },
];

export const HAVE_PETS: SelectOption[] = [
  { value: "no", label: "No" },
  { value: "yes-dog", label: "Yes — dog" },
  { value: "yes-cat", label: "Yes — cat" },
  { value: "yes-other", label: "Yes — other" },
];
