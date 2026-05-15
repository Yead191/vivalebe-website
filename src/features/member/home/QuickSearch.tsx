"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

interface Country {
  code: string;
  name: string;
  states: string[];
}

const countries: Country[] = [
  { code: "BR", name: "Brazil", states: ["SP", "RJ", "MG", "BA", "PE", "PR", "SC", "DF"] },
  { code: "PT", name: "Portugal", states: ["Lisbon", "Porto", "Coimbra", "Faro"] },
  { code: "ES", name: "Spain", states: ["Madrid", "Catalonia", "Andalusia"] },
  { code: "US", name: "USA", states: ["CA", "TX", "NY", "FL"] },
];

interface QuickSearchProps {
  lang: Locale;
  dict: Dictionary;
}

export function QuickSearch({ lang, dict }: QuickSearchProps) {
  const router = useRouter();
  const [interestedIn, setInterestedIn] = useState<Record<string, boolean>>({
    Man: false,
    Woman: true,
    Couple: false,
  });
  const [ageRange, setAgeRange] = useState<number[]>([19, 24]);
  const [countryCode, setCountryCode] = useState("BR");
  const [stateCode, setStateCode] = useState("SP");

  const states = countries.find((c) => c.code === countryCode)?.states ?? [];

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const interests = Object.entries(interestedIn)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(",");
    const params = new URLSearchParams({
      from: "quick",
      interestedIn: interests,
      ageMin: String(ageRange[0]),
      ageMax: String(ageRange[1]),
      country: countryCode,
      state: stateCode,
    });
    router.push(`/${lang}/discover?${params.toString()}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-border bg-card p-5 space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Label className="sm:w-32 text-xs text-foreground">
          {dict.myHome.quickInterested}
        </Label>
        <div className="flex items-center gap-4">
          {(["Man", "Woman", "Couple"] as const).map((k) => (
            <label
              key={k}
              className="inline-flex items-center gap-2 text-sm text-foreground"
            >
              <Checkbox
                checked={interestedIn[k]}
                onCheckedChange={(v) =>
                  setInterestedIn((prev) => ({ ...prev, [k]: Boolean(v) }))
                }
              />
              {k === "Man"
                ? dict.myHome.quickMan
                : k === "Woman"
                  ? dict.myHome.quickWoman
                  : dict.myHome.quickCouple}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Label className="sm:w-32 text-xs text-foreground">
          {dict.myHome.quickAgeRange}
        </Label>
        <div className="flex flex-1 items-center gap-3">
          <Slider
            value={ageRange}
            min={18}
            max={80}
            step={1}
            onValueChange={setAgeRange}
            className="flex-1"
          />
          <span className="tabular-nums text-sm text-foreground min-w-[4.5rem] text-right">
            {ageRange[0]} - {ageRange[1]}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Label className="sm:w-32 text-xs text-foreground">
          {dict.myHome.quickCountry}
        </Label>
        <Select
          value={countryCode}
          onValueChange={(v) => {
            setCountryCode(v);
            const first = countries.find((c) => c.code === v)?.states[0] ?? "";
            setStateCode(first);
          }}
        >
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Label className="sm:w-32 text-xs text-foreground">
          {dict.myHome.quickState}
        </Label>
        <Select value={stateCode} onValueChange={setStateCode}>
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {states.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-center pt-1">
        <button
          type="submit"
          className="rounded-md bg-brand px-8 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover transition-colors"
        >
          {dict.myHome.quickSubmit}
        </button>
      </div>
    </form>
  );
}
