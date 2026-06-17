"use client";

import { useState } from "react";
import { Shield, Bell, User, EyeOff, MessageSquare, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import PrivacyTab from "./tabs/PrivacyTab";
import NotificationsTab from "./tabs/NotificationsTab";
import MyAccountTab from "./tabs/MyAccountTab";
import HiddenMembersTab from "./tabs/HiddenMembersTab";
import AutoReplyTab from "./tabs/AutoReplyTab";
import ResetPassesTab from "./tabs/ResetPassesTab";


interface SettingsPageFeatureProps {
    lang: string;
    dict: any;
}

export default function SettingsPageFeature({ lang, dict }: SettingsPageFeatureProps) {
    const [activeTab, setActiveTab] = useState("privacy");
    const t = dict.settings;

    const menuItems = [
        { id: "group1", type: "heading", label: t.sections.account },
        { id: "privacy", type: "item", label: t.tabs.privacy, icon: Shield },
        { id: "notifications", type: "item", label: t.tabs.notifications, icon: Bell },
        { id: "myAccount", type: "item", label: t.tabs.myAccount, icon: User },
        { id: "hiddenMembers", type: "item", label: t.tabs.hiddenMembers, icon: EyeOff },
        { id: "group2", type: "heading", label: t.sections.customization },
        { id: "autoReply", type: "item", label: t.tabs.autoReply, icon: MessageSquare },
        { id: "group3", type: "heading", label: t.sections.general },
        { id: "resetPasses", type: "item", label: t.tabs.resetPasses, icon: RefreshCw },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case "privacy": return <PrivacyTab t={t} />;
            case "notifications": return <NotificationsTab t={t} />;
            case "myAccount": return <MyAccountTab t={t} />;
            case "hiddenMembers": return <HiddenMembersTab t={t} />;
            case "autoReply": return <AutoReplyTab t={t} />;
            case "resetPasses": return <ResetPassesTab t={t} />;
            default: return <PrivacyTab t={t} />;
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50/60  text-neutral-900 antialiased">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight mb-8 bg-linear-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
                    {t.title}
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
                    {/* Side Navigation */}
                    <nav className="lg:col-span-4 bg-white/80  backdrop-blur-md p-4 rounded-2xl border border-neutral-200/60 shadow-sm space-y-1 lg:sticky lg:top-20">
                        {menuItems.map((item) => {
                            if (item.type === "heading") {
                                return (
                                    <h3 key={item.id} className="text-xs font-semibold uppercase tracking-wider text-neutral-400 pt-4 pb-2 px-3 first:pt-0">
                                        {item.label}
                                    </h3>
                                );
                            }

                            const Icon = item.icon!;
                            const isActive = activeTab === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-out group relative",
                                        isActive
                                            ? "text-[#429CA8] bg-[#429CA8]/8 "
                                            : "text-neutral-600  hover:bg-neutral-100/80 "
                                    )}
                                >
                                    {isActive && (
                                        <span className="absolute left-0 top-3 bottom-3 w-1 bg-[#429CA8] rounded-full" />
                                    )}
                                    <Icon className={cn("w-5 h-5 transition-transform duration-200 group-hover:scale-105", isActive ? "text-[#429CA8]" : "text-neutral-400 ")} />
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Settings Tab Work Area */}
                    <main className="lg:col-span-8 bg-white  rounded-2xl border border-neutral-200/60 shadow-sm overflow-hidden p-6 sm:p-8 min-h-150 transition-all duration-300">
                        {renderTabContent()}
                    </main>
                </div>
            </div>
        </div>
    );
}