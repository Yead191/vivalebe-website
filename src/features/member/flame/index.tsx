"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { User } from "@/lib/types";
import { FlameCard } from "./FlameCard";
import { PreferencesModal, type FlamePreferences } from "./PreferencesModal";

interface FlameFeatureProps {
    lang: Locale;
    dict: Dictionary;
    me: User;
    candidates: User[];
}

const DEFAULT_PREFS: FlamePreferences = {
    genders: ["W"],
    ageRange: [19, 99],
    distance: "anywhere",
    willingToFly: false,
    expandedSearch: false,
};

export function FlameFeature({ lang, dict, me, candidates }: FlameFeatureProps) {
    const [prefs, setPrefs] = useState<FlamePreferences>(DEFAULT_PREFS);
    const [prefsOpen, setPrefsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lastPassedIndex, setLastPassedIndex] = useState<number | null>(null);

    const matches = useMemo(() => {
        return candidates.filter((u) => {
            if (prefs.genders.length > 0 && !prefs.genders.includes(u.gender)) return false;
            if (u.age < prefs.ageRange[0] || u.age > prefs.ageRange[1]) return false;
            if (prefs.distance === "country" && u.country !== me.country) return false;
            return true;
        });
    }, [candidates, prefs, me.country]);

    const current = matches[currentIndex];

    const handlePass = () => {
        setLastPassedIndex(currentIndex);
        setCurrentIndex((i) => i + 1);
    };

    const handleLike = () => {
        setLastPassedIndex(null);
        setCurrentIndex((i) => i + 1);
    };

    const handleUndo = () => {
        if (!me.premium || lastPassedIndex === null) return;
        setCurrentIndex(lastPassedIndex);
        setLastPassedIndex(null);
    };

    const handleSavePrefs = (next: FlamePreferences) => {
        setPrefs(next);
        setCurrentIndex(0);
        setLastPassedIndex(null);
        setPrefsOpen(false);
    };

    const resetDeck = () => {
        setCurrentIndex(0);
        setLastPassedIndex(null);
    };

    return (
        <div className="container py-6">
            <div className="mb-6 text-start">
                <button
                    type="button"
                    onClick={() => setPrefsOpen(true)}
                    className="text-sm font-medium underline underline-offset-4 hover:text-brand transition-colors cursor-pointer"
                >
                    Preferences for My Potential Matches
                </button>
            </div>

            <div className="">
                {current ? (
                    <FlameCard
                        lang={lang}
                        dict={dict}
                        user={current}
                        canUndo={lastPassedIndex !== null}
                        isPremium={me.premium}
                        onPass={handlePass}
                        onLike={handleLike}
                        onUndo={handleUndo}
                    />
                ) : (
                    <EmptyState
                        hasMatches={matches.length > 0}
                        onReset={resetDeck}
                        onOpenPrefs={() => setPrefsOpen(true)}
                    />
                )}
            </div>

            <PreferencesModal
                open={prefsOpen}
                onOpenChange={setPrefsOpen}
                initial={prefs}
                userCountry={me.country}
                isPremium={me.premium}
                onSave={handleSavePrefs}
            />
        </div>
    );
}

interface EmptyStateProps {
    hasMatches: boolean;
    onReset: () => void;
    onOpenPrefs: () => void;
}

function EmptyState({ hasMatches, onReset, onOpenPrefs }: EmptyStateProps) {
    return (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
            <h3 className="text-base font-semibold text-foreground">
                No more profiles right now
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
                You&apos;ve seen everyone matching your preferences. Adjust your preferences to see more.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
                {hasMatches ? (
                    <button
                        type="button"
                        onClick={onReset}
                        className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                    >
                        Start over
                    </button>
                ) : null}
                <button
                    type="button"
                    onClick={onOpenPrefs}
                    className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity"
                >
                    Adjust preferences
                </button>
            </div>
        </div>
    );
}
