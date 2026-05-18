"use client";

import { MessageSquare } from "lucide-react";

export default function MessagePage() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-6 h-full bg-[#0d0e14] relative">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative group">
                <div className="absolute -inset-4 bg-indigo-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="w-20 h-20 rounded-3xl bg-[#1a1b26] border border-white/8 flex items-center justify-center shadow-xl relative overflow-hidden">
                    <MessageSquare size={36} className="text-indigo-400/30 group-hover:text-indigo-400/60 transition-colors duration-500" />
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-indigo-500/20" />
                </div>
            </div>

            <div className="space-y-2 max-w-sm">
                <h2 className="text-xl font-bold text-white tracking-tight">Select a Chat</h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                    Choose from your existing contacts on the left to start a real-time conversation.
                </p>
            </div>

            <button className="mt-4 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white text-sm font-medium transition-all active:scale-95">
                New Message
            </button>
        </div>
    );
}