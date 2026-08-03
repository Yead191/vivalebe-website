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
  value: string;
  name: string;
  states: string[];
}

const countries: Country[] = [
  {
    value: "bangladesh",
    name: "Bangladesh",
    states: ["dhaka", "chittagong", "sylhet", "khulna", "rajshahi"],
  },
  {
    value: "brazil",
    name: "Brazil",
    states: ["SP", "RJ", "MG", "BA", "PE", "PR", "SC", "DF"],
  },
  {
    value: "portugal",
    name: "Portugal",
    states: ["Lisbon", "Porto", "Coimbra", "Faro"],
  },
  {
    value: "spain",
    name: "Spain",
    states: ["Madrid", "Catalonia", "Andalusia"],
  },
  {
    value: "usa",
    name: "USA",
    states: ["CA", "TX", "NY", "FL"],
  },
];

const LOOKING_FOR_MAP = {
  Man: "MALE",
  Woman: "FEMALE",
  Couple: "COUPLE",
} as const;

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
  const [country, setCountry] = useState("bangladesh");
  const [state, setState] = useState("dhaka");

  const states = countries.find((c) => c.value === country)?.states ?? [];

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const lookingFor = (["Woman", "Man", "Couple"] as const)
      .filter((key) => interestedIn[key])
      .map((key) => LOOKING_FOR_MAP[key])[0];

    const params = new URLSearchParams({ from: "quick" });

    if (lookingFor) params.set("lookingFor", lookingFor);
    params.set("ageFrom", String(ageRange[0]));
    params.set("ageTo", String(ageRange[1]));
    if (country) params.set("country", country);
    if (state) params.set("state", state);

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
              className="inline-flex cursor-pointer items-center gap-2 text-sm text-foreground"
            >
              <Checkbox
                checked={interestedIn[k]}
                onCheckedChange={(v) =>
                  setInterestedIn((prev) => ({ ...prev, [k]: Boolean(v) }))
                }
                className="cursor-pointer"
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
            className="flex-1 cursor-pointer"
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
          value={country}
          onValueChange={(v) => {
            setCountry(v);
            const first = countries.find((c) => c.value === v)?.states[0] ?? "";
            setState(first);
          }}
        >
          <SelectTrigger className="flex-1 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.value} value={c.value} className="cursor-pointer">
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
        <Select value={state} onValueChange={setState}>
          <SelectTrigger className="flex-1 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {states.map((s) => (
              <SelectItem key={s} value={s} className="cursor-pointer">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-center pt-1">
        <button
          type="submit"
          className="cursor-pointer rounded-md bg-brand px-8 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover transition-colors"
        >
          {dict.myHome.quickSubmit}
        </button>
      </div>
    </form>
  );
}
