// @/components/settings/tabs/AutoReplyTab.tsx
"use client";

import React, { useState } from "react";
import { Plus, CheckCircle2, Circle, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function AutoReplyTab({ t }: { t: any }) {
    // Array of reply options
    const [templates, setTemplates] = useState<string[]>([
        "Thanks for your message! I'm currently offline but will reply when I'm back.",
        "Thanks for reaching out! I'm taking a short break and will respond soon."
    ]);

    const [selectedReply, setSelectedReply] = useState<number>(0);

    // UI Flow States
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [newReplyText, setNewReplyText] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const MAX_CHARS = 160; // Standard premium length constraint

    const handleCreateReply = async () => {
        if (!newReplyText.trim()) return;

        setIsSaving(true);

        // Simulate database/API mutation latency
        await new Promise((resolve) => setTimeout(resolve, 800));

        const updatedTemplates = [...templates, newReplyText.trim()];
        setTemplates(updatedTemplates);

        // Auto-select the newly minted custom reply card
        setSelectedReply(updatedTemplates.length - 1);

        // Clean up input contexts
        setNewReplyText("");
        setIsCreating(false);
        setIsSaving(false);
    };

    return (
        <div className="space-y-6 animate-fade-in text-neutral-900">
            <div>
                <h2 className="text-xl font-bold tracking-tight mb-1">{t.tabs.autoReply}</h2>
                <p className="text-xs text-neutral-400 leading-normal max-w-xl">{t.autoReply.desc}</p>
            </div>

            {/* Target Container List */}
            <div className="space-y-3">
                {templates.map((text, idx) => {
                    const isSelected = selectedReply === idx;
                    return (
                        <div
                            key={idx}
                            onClick={() => setSelectedReply(idx)}
                            className={cn(
                                "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 group relative",
                                isSelected
                                    ? "border-[#429CA8] bg-[#429CA8]/5"
                                    : "border-neutral-100 bg-white hover:border-neutral-200"
                            )}
                        >
                            <div className="mt-0.5 shrink-0 transition-transform duration-200 group-hover:scale-105">
                                {isSelected ? (
                                    <CheckCircle2 className="w-5 h-5 text-[#429CA8] fill-[#429CA8]/10" />
                                ) : (
                                    <Circle className="w-5 h-5 text-neutral-300" />
                                )}
                            </div>
                            <p className={cn(
                                "text-sm leading-relaxed font-medium pr-4",
                                isSelected ? "text-neutral-900 font-semibold" : "text-neutral-500"
                            )}>
                                {text}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Expandable Creation Composer Sheet */}
            {isCreating ? (
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-3 animate-fade-in">
                    <div className="relative">
                        <Textarea
                            value={newReplyText}
                            onChange={(e) => setNewReplyText(e.target.value.slice(0, MAX_CHARS))}
                            placeholder={t.autoReply.placeholder || "Type your automated matching message here..."}
                            disabled={isSaving}
                            className="w-full bg-white border-neutral-200 rounded-xl resize-none min-h-20 p-3 text-sm focus-visible:ring-[#429CA8] focus-visible:ring-offset-0 transition-all placeholder:text-neutral-400 text-neutral-800"
                        />
                        <span className="absolute bottom-2.5 right-3 text-[10px] font-medium text-neutral-400 bg-white/80 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                            {newReplyText.length} / {MAX_CHARS}
                        </span>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={isSaving}
                            onClick={() => {
                                setIsCreating(false);
                                setNewReplyText("");
                            }}
                            className="h-9 px-3 rounded-xl border-neutral-200 text-neutral-500 hover:bg-neutral-100 font-medium text-xs flex items-center gap-1.5"
                        >
                            <X className="w-3.5 h-3.5" />
                            {t.common?.cancel || "Cancel"}
                        </Button>

                        <Button
                            size="sm"
                            disabled={!newReplyText.trim() || isSaving}
                            onClick={handleCreateReply}
                            className="h-9 px-4 bg-[#429CA8] hover:bg-[#357d87] text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 disabled:opacity-50"
                        >
                            {isSaving ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Check className="w-3.5 h-3.5" />
                            )}
                            {t.common?.save || "Save Template"}
                        </Button>
                    </div>
                </div>
            ) : (
                /* Action trigger to append standard collection elements */
                <Button
                    variant="outline"
                    onClick={() => setIsCreating(true)}
                    className="w-full py-5 border-dashed border-2 bg-white border-neutral-200 hover:border-[#429CA8]/60 hover:bg-[#429CA8]/5 text-neutral-600 hover:text-[#429CA8] transition-all rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    {t.autoReply.addCustom}
                </Button>
            )}
        </div>
    );
}