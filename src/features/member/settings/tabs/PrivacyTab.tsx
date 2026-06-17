// @/components/settings/tabs/PrivacyTab.tsx
"use client";

import React, { useState } from "react";
import { Check, Crown, Globe, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export default function PrivacyTab({ t }: { t: any }) {
    const [profileScope, setProfileScope] = useState("all");
    const [regionScope, setRegionScope] = useState("all");

    // States for toggle-switches
    const [anon, setAnon] = useState(false);
    const [hideOnline, setHideOnline] = useState(false);
    const [hideMoments, setHideMoments] = useState(false);

    const premiumOptions = [
        { id: "liked", label: t.privacy.showLiked },
        { id: "liked-std", label: t.privacy.showLikedStandard },
        { id: "hide-all", label: t.privacy.hideAll },
        { id: "hide-women", label: t.privacy.hideWomen },
        { id: "hide-men", label: t.privacy.hideMen },
        { id: "hide-couples", label: t.privacy.hideCouples },
        { id: "same-std", label: t.privacy.showSameStd },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Profile Privacy Header */}
            <div>
                <h2 className="text-xl font-bold mb-1 tracking-tight">{t.privacy.profileTitle}</h2>
                <p className="text-sm text-neutral-500">{t.privacy.desc || "Control who can view your profile details."}</p>
            </div>

            {/* Standard Option */}
            <div
                onClick={() => setProfileScope("all")}
                className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between",
                    profileScope === "all" ? "border-[#429CA8] bg-[#429CA8]/5" : "border-neutral-100  hover:border-neutral-200"
                )}
            >
                <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-neutral-400" />
                    <span className="text-sm font-semibold">{t.privacy.showAll}</span>
                </div>
                <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center", profileScope === "all" ? "bg-[#429CA8] border-[#429CA8]" : "border-neutral-300")}>
                    {profileScope === "all" && <Check className="w-3  h-3 text-white" />}
                </div>
            </div>

            {/* Premium Exclusive Divider Block */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-neutral-100 ">
                    <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-amber-600  tracking-wider uppercase">{t.privacy.premiumBadge}</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {premiumOptions.map((opt) => {
                        const isSelected = profileScope === opt.id;
                        return (
                            <div
                                key={opt.id}
                                onClick={() => setProfileScope(opt.id)}
                                className={cn(
                                    "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between group",
                                    isSelected ? "border-[#429CA8] bg-[#429CA8]/5" : "border-neutral-100  hover:border-neutral-200"
                                )}
                            >
                                <span className="text-sm text-neutral-600  font-medium group-hover:text-neutral-900 ">{opt.label}</span>
                                <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center", isSelected ? "bg-[#429CA8] border-[#429CA8]" : "border-neutral-200")}>
                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Regions Settings */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold tracking-tight text-neutral-400 uppercase">{t.privacy.regionTitle}</h3>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { id: "all", label: t.privacy.allRegions },
                        { id: "country", label: t.privacy.countryOnly }
                    ].map((reg) => (
                        <button
                            key={reg.id}
                            onClick={() => setRegionScope(reg.id)}
                            className={cn(
                                "py-3 px-4 rounded-xl font-medium text-sm border-2 transition-all text-center",
                                regionScope === reg.id
                                    ? "border-[#429CA8] bg-[#429CA8] text-white shadow-sm"
                                    : "border-neutral-100  text-neutral-600  hover:bg-neutral-50"
                            )}
                        >
                            {reg.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Activity Settings */}
            <div className="space-y-4 pt-4 border-t border-neutral-100 ">
                <div>
                    <h2 className="text-xl font-bold mb-1 tracking-tight">{t.privacy.activityTitle}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">{t.privacy.premiumBadge}</span>
                    </div>
                </div>

                <div className="space-y-1 bg-neutral-50/50  p-4 rounded-2xl border border-neutral-100 ">
                    {[
                        { state: anon, setter: setAnon, label: t.privacy.anonymous },
                        { state: hideOnline, setter: setHideOnline, label: t.privacy.hideOnline },
                        { state: hideMoments, setter: setHideMoments, label: t.privacy.hideMoments }
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 border-b last:border-0 border-neutral-100 ">
                            <span className="text-sm font-medium text-neutral-700 ">{item.label}</span>
                            <Switch
                                checked={item.state}
                                onCheckedChange={item.setter}
                                className="data-[state=checked]:bg-[#429CA8]"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}