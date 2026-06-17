// @/components/settings/tabs/ResetPassesTab.tsx
"use client";

import React, { useState } from "react";
import { RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResetPassesTab({ t }: { t: any }) {
    const [isResetting, setIsResetting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleReset = () => {
        setIsResetting(true);
        // Simulate API request call
        setTimeout(() => {
            setIsResetting(false);
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 3000);
        }, 1200);
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-xl">
            <div>
                <h2 className="text-xl font-bold tracking-tight mb-1.5">{t.resetPasses.title}</h2>
                <p className="text-sm text-neutral-500  leading-relaxed">
                    {t.resetPasses.desc}
                </p>
            </div>

            <div className="p-6 rounded-2xl bg-linear-to-br from-neutral-50 to-neutral-100/50  border border-neutral-100  space-y-4">
                <Button
                    onClick={handleReset}
                    disabled={isResetting || isSuccess}
                    className="w-full sm:w-auto px-6 h-12 bg-[#429CA8] hover:bg-[#36818C] disabled:bg-[#429CA8]/70 text-white font-semibold rounded-xl tracking-wide shadow-md shadow-[#429CA8]/10 transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${isResetting ? "animate-spin" : ""}`} />
                    {isResetting ? "Resetting..." : t.resetPasses.btn}
                </Button>

                {isSuccess && (
                    <div className="flex items-center gap-2 text-emerald-600  text-xs font-semibold animate-fade-in">
                        <CheckCircle2 className="w-4 h-4" />
                        {t.resetPasses.success}
                    </div>
                )}
            </div>
        </div>
    );
}