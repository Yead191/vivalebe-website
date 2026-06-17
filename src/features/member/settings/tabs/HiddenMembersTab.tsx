// @/components/settings/tabs/HiddenMembersTab.tsx
"use client";

import React, { useState } from "react";
import { Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HiddenMembersTab({ t }: { t: any }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [members, setMembers] = useState([
        { id: 1, name: "SARAH", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
        { id: 2, name: "ALEXA", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
        { id: 3, name: "ZAHIN", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
        { id: 4, name: "MAHIN", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150" },
    ]);

    const handleUnhide = (id: number) => {
        setMembers(members.filter(m => m.id !== id));
    };

    const filteredMembers = members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-xl font-bold tracking-tight mb-1">{t.hidden.title}</h2>
            </div>

            {/* Search Input field */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                    type="text"
                    placeholder={t.hidden.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11 bg-neutral-50/50 border-neutral-200/80  rounded-xl focus-visible:ring-[#429CA8]"
                />
            </div>

            {/* Hidden connections stack */}
            <div className="space-y-2">
                {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center justify-between p-3 rounded-xl border border-neutral-100  hover:bg-neutral-50/50  transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="w-11 h-11 rounded-full object-cover ring-2 ring-neutral-100 "
                                />
                                <span className="text-sm font-bold text-neutral-700  tracking-wide">{member.name}</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUnhide(member.id)}
                                className="h-8 text-xs font-semibold px-3 rounded-lg border-neutral-200  hover:bg-neutral-100 hover:text-neutral-900   text-neutral-600  flex items-center gap-1.5"
                            >
                                <Eye className="w-3.5 h-3.5" />
                                {t.hidden.unhide}
                            </Button>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-sm text-neutral-400">
                        {t.hidden.empty}
                    </div>
                )}
            </div>
        </div>
    );
}