export const ONBOARDING_COUNTRY_VALUES = [
  "Brazil",
  "Cape Verde",
  "Guinea Bissau",
  "Sao Tome and Principe",
  "Angola",
  "Mozambique",
  "Equatorial Guinea",
] as const;

export type OnboardingCountryValue =
  (typeof ONBOARDING_COUNTRY_VALUES)[number];

export type OnboardingCountry = {
  value: OnboardingCountryValue;
  en: string;
  pt: string;
  states: readonly string[];
};

export const ONBOARDING_COUNTRIES: readonly OnboardingCountry[] = [
  {
    value: "Brazil",
    en: "Brazil",
    pt: "Brasil",
    states: [
      "Acre",
      "Alagoas",
      "Amapá",
      "Amazonas",
      "Bahia",
      "Ceará",
      "Distrito Federal",
      "Espírito Santo",
      "Goiás",
      "Maranhão",
      "Mato Grosso",
      "Mato Grosso do Sul",
      "Minas Gerais",
      "Pará",
      "Paraíba",
      "Paraná",
      "Pernambuco",
      "Piauí",
      "Rio de Janeiro",
      "Rio Grande do Norte",
      "Rio Grande do Sul",
      "Rondônia",
      "Roraima",
      "Santa Catarina",
      "São Paulo",
      "Sergipe",
      "Tocantins",
    ],
  },
  {
    value: "Cape Verde",
    en: "Cape Verde",
    pt: "Cabo Verde",
    states: [
      "Santo Antão",
      "São Vicente",
      "São Nicolau",
      "Sal",
      "Boa Vista",
      "Maio",
      "Santiago",
      "Fogo",
      "Brava",
    ],
  },
  {
    value: "Guinea Bissau",
    en: "Guinea Bissau",
    pt: "Guiné-Bissau",
    states: [
      "Bafatá",
      "Biombo",
      "Bissau",
      "Bolama",
      "Cacheu",
      "Gabú",
      "Oio",
      "Quinara",
      "Tombali",
    ],
  },
  {
    value: "Sao Tome and Principe",
    en: "São Tomé and Príncipe",
    pt: "São Tomé e Príncipe",
    states: [
      "Água Grande",
      "Cantagalo",
      "Caué",
      "Lembá",
      "Lobata",
      "Mé-Zóchi",
      "Pagué",
    ],
  },
  {
    value: "Angola",
    en: "Angola",
    pt: "Angola",
    states: [
      "Bengo",
      "Benguela",
      "Bié",
      "Cabinda",
      "Cuando Cubango",
      "Cuanza Norte",
      "Cuanza Sul",
      "Cunene",
      "Huambo",
      "Huíla",
      "Luanda",
      "Lunda Norte",
      "Lunda Sul",
      "Malanje",
      "Moxico",
      "Namibe",
      "Uíge",
      "Zaire",
    ],
  },
  {
    value: "Mozambique",
    en: "Mozambique",
    pt: "Moçambique",
    states: [
      "Cabo Delgado",
      "Gaza",
      "Inhambane",
      "Manica",
      "Maputo City",
      "Maputo Province",
      "Nampula",
      "Niassa",
      "Sofala",
      "Tete",
      "Zambézia",
    ],
  },
  {
    value: "Equatorial Guinea",
    en: "Equatorial Guinea",
    pt: "Guiné Equatorial",
    states: [
      "Annobón",
      "Bioko Norte",
      "Bioko Sur",
      "Centro Sur",
      "Kié-Ntem",
      "Litoral",
      "Wele-Nzas",
      "Djibloho",
    ],
  },
];

export function getOnboardingCountry(
  value: string,
): OnboardingCountry | undefined {
  return ONBOARDING_COUNTRIES.find((country) => country.value === value);
}

export function getOnboardingStates(countryValue: string): readonly string[] {
  return getOnboardingCountry(countryValue)?.states ?? [];
}

export function isOnboardingCountry(value: string): boolean {
  return ONBOARDING_COUNTRIES.some((country) => country.value === value);
}
