// @/components/settings/tabs/AutoReplyTab.tsx
"use client";

import React, { useState } from "react";
import { Plus, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AutoReplyTab({ t }: { t: any }) {
    const [selectedReply, setSelectedReply] = useState(0);

    const templates = [
        "Thanks for your message! I'm currently offline but will reply when I'm back.",
        "Thanks for reaching out! I'm taking a short break and will respond soon."
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-xl font-bold tracking-tight mb-1">{t.tabs.autoReply}</h2>
                <p className="text-xs text-neutral-400  leading-normal max-w-xl">{t.autoReply.desc}</p>
            </div>

            <div className="space-y-3">
                {templates.map((text, idx) => {
                    const isSelected = selectedReply === idx;
                    return (
                        <div
                            key={idx}
                            onClick={() => setSelectedReply(idx)}
                            className={cn(
                                "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5",
                                isSelected ? "border-[#429CA8] bg-[#429CA8]/5" : "border-neutral-100  hover:border-neutral-200"
                            )}
                        >
                            <div className="mt-0.5">
                                {isSelected ? (
                                    <CheckSquare className="w-5 h-5 text-[#429CA8] fill-[#429CA8]/10" />
                                ) : (
                                    <Square className="w-5 h-5 text-neutral-300 " />
                                )}
                            </div>
                            <p className={cn("text-sm leading-relaxed font-medium", isSelected ? "text-neutral-900 " : "text-neutral-500 ")}>
                                {text}
                            </p>
                        </div>
                    );
                })}
            </div>

            <Button
                variant="outline"
                className="w-full py-5 border-dashed border-2 border-neutral-200 dark:border-neutral-800 hover:border-[#429CA8]/60 hover:bg-[#429CA8]/5 text-neutral-600 dark:text-neutral-400 hover:text-[#429CA8] transition-all rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            >
                <Plus className="w-4 h-4" />
                {t.autoReply.addCustom}
            </Button>
        </div>
    );
}