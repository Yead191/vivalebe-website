"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import type { Gender } from "@/lib/types";

export interface FlamePreferences {
  genders: Gender[];
  ageRange: [number, number];
  distance: "anywhere" | "country";
  willingToFly: boolean;
  expandedSearch: boolean;
}

interface PreferencesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: FlamePreferences;
  userCountry: string;
  isPremium: boolean;
  onSave: (next: FlamePreferences) => void;
}

const GENDER_OPTIONS: { label: string; value: Gender }[] = [
  { label: "Women", value: "W" },
  { label: "Men", value: "M" },
  { label: "Couples", value: "C" },
];

export function PreferencesModal({
  open,
  onOpenChange,
  initial,
  userCountry,
  isPremium,
  onSave,
}: PreferencesModalProps) {
  const [draft, setDraft] = useState<FlamePreferences>(initial);

  useEffect(() => {
    if (open) setDraft(initial);
  }, [open, initial]);

  const toggleGender = (g: Gender, checked: boolean) => {
    setDraft((d) => ({
      ...d,
      genders: checked
        ? Array.from(new Set([...d.genders, g]))
        : d.genders.filter((x) => x !== g),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 sm:max-w-lg">
        <div className="p-6 sm:p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="sr-only">
              Preferences for potential matches
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Gender
              </h3>
              <p className="text-xs text-muted-foreground">
                (You can make multiple selections.)
              </p>
              <div className="space-y-3">
                {GENDER_OPTIONS.map((opt) => (
                  <div key={opt.value} className="flex items-center gap-3">
                    <Checkbox
                      id={`gender-${opt.value}`}
                      checked={draft.genders.includes(opt.value)}
                      onCheckedChange={(checked) =>
                        toggleGender(opt.value, checked === true)
                      }
                    />
                    <Label
                      htmlFor={`gender-${opt.value}`}
                      className="cursor-pointer text-base font-normal"
                    >
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Age
                </h3>
                <span className="text-sm text-muted-foreground">
                  {draft.ageRange[0]} - {draft.ageRange[1]}
                </span>
              </div>
              <Slider
                min={18}
                max={99}
                step={1}
                value={draft.ageRange}
                onValueChange={(v) =>
                  setDraft((d) => ({
                    ...d,
                    ageRange: [v[0], v[1]] as [number, number],
                  }))
                }
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Distance
              </h3>
              <Select
                value={draft.distance}
                onValueChange={(v) =>
                  setDraft((d) => ({
                    ...d,
                    distance: v as "anywhere" | "country",
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anywhere">Anywhere</SelectItem>
                  <SelectItem value="country">
                    Within {userCountry}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Willing to Fly to Meet
                </h3>
                <span className="rounded-sm border border-border px-1.5 text-[10px] font-semibold tracking-wider">
                  PREMIUM
                </span>
              </div>
              <Switch
                checked={draft.willingToFly}
                disabled={!isPremium}
                onCheckedChange={(c) =>
                  setDraft((d) => ({ ...d, willingToFly: c }))
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Enable Expanded Search
                </h3>
                <Switch
                  checked={draft.expandedSearch}
                  onCheckedChange={(c) =>
                    setDraft((d) => ({ ...d, expandedSearch: c }))
                  }
                />
              </div>
              <p className="text-xs text-muted-foreground">
                (Once you&apos;ve swiped through all matching members, we&apos;ll
                automatically expand your search to find more potential matches.)
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="min-w-[120px] uppercase tracking-wider"
            >
              Cancel
            </Button>
            <Button
              onClick={() => onSave(draft)}
              className="min-w-[120px] bg-brand uppercase tracking-wider text-background hover:opacity-90 "
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
