import React from "react";
import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { AppLogo } from "@/components/shared/AppLogo";
import { LangSwitcher } from "@/components/shared/LangSwitcher";

export default async function AuthSharedLayout({
    children,
    params
}: {
    children: React.ReactNode,
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params;
    if (!isLocale(lang)) notFound();
    const dict = await getDictionary(lang);

    return (
        <div className="min-h-screen bg-neutral-50">

            {/* LEFT COLUMN: Fixed branding panel (large screens only) */}
            <div className="relative hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-5/12 xl:w-4/12 flex-col justify-between p-10 text-white
             overflow-hidden"
                style={{
                    backgroundImage: "url('/assets/bg/auth/auth-bg.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60" />
                {/* 1. AppLogo used here in high-contrast white variant */}
                <div className="relative z-10">
                    <AppLogo variant="white" />
                </div>

                <div className="relative z-10 space-y-4 max-w-sm">
                    <div className="h-1 w-12 bg-white/40 rounded-full" />
                    <h1 className="text-3xl font-bold tracking-tight leading-tight">
                        {dict.auth?.layoutPanelTitle}
                    </h1>
                    <p className="text-sm text-white/80 leading-relaxed font-light">
                        {dict.auth?.layoutPanelSubtitle}
                    </p>
                </div>

                <div className="text-xs text-white/50 font-medium tracking-wide uppercase relative z-10">
                    © 2026 VIVALIVE
                </div>
            </div>

            {/* RIGHT COLUMN: Scrollable form area, offset by the fixed panel width */}
            <div className="min-h-screen flex flex-col relative lg:ml-[41.6667%] xl:ml-[33.3333%]">

                {/* Top Floating Control Row */}
                <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-50">
                    {/* 2. AppLogo used here in default dark variant (Visible ONLY on smaller viewports) */}
                    {/* <div className="lg:hidden">
                        <AppLogo variant="default" />
                    </div> */}
                    <div className="hidden lg:block" /> {/* Spacer element alignment fix */}

                    {/* Active responsive language dropdown control */}
                    <LangSwitcher />
                </div>

                {/* Form Content Panel Area */}
                <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-20">
                    <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200/60 p-6 sm:p-10 shadow-sm">
                        {children}
                    </div>
                </div>
            </div>

        </div>
    );
}