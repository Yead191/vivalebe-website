"use client";

import { MessageSquare } from "lucide-react";

export default function MessagePage() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-6 h-full bg-[#F8FAFC] relative">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#429CA8]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative group">
                <div className="absolute -inset-4 bg-[#429CA8]/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="w-20 h-20 rounded-3xl bg-white border border-gray-200 flex items-center justify-center shadow-sm relative overflow-hidden">
                    <MessageSquare size={36} className="text-[#429CA8]/40 group-hover:text-[#429CA8]/80 transition-colors duration-500" />
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-[#429CA8]/20" />
                </div>
            </div>

            <div className="space-y-2 max-w-sm z-10">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Select a Chat</h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                    Choose from your existing contacts on the left to start a real-time conversation.
                </p>
            </div>

            <button className="mt-4 px-6 py-2.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-sm text-sm font-medium transition-all active:scale-95 z-10">
                New Message
            </button>
        </div>
    );
}