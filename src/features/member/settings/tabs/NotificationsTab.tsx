// @/components/settings/tabs/NotificationsTab.tsx
"use client";

import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";

export default function NotificationsTab({ t }: { t: any }) {
    const [viewed, setViewed] = useState(true);
    const [likes, setLikes] = useState(true);
    const [msg, setMsg] = useState(true);

    const configs = [
        { id: "v", state: viewed, setter: setViewed, title: t.notifications.viewed, desc: t.notifications.viewedDesc },
        { id: "l", state: likes, setter: setLikes, title: t.notifications.likes, desc: t.notifications.likesDesc },
        { id: "m", state: msg, setter: setMsg, title: t.notifications.messages, desc: t.notifications.messagesDesc }
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-xl font-bold tracking-tight mb-1">{t.notifications.title}</h2>
            </div>

            <div className="space-y-3">
                {configs.map((cfg) => (
                    <div
                        key={cfg.id}
                        className="flex items-start justify-between p-4 rounded-xl border border-neutral-100  hover:bg-neutral-50/50  transition-colors"
                    >
                        <div className="space-y-0.5 max-w-[85%]">
                            <h4 className="text-sm font-semibold">{cfg.title}</h4>
                            <p className="text-xs text-neutral-400 leading-normal">{cfg.desc}</p>
                        </div>
                        <Switch
                            checked={cfg.state}
                            onCheckedChange={cfg.setter}
                            className="data-[state=checked]:bg-[#429CA8]"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}