"use client";

import { useState, } from "react";
import { Search, Filter, Users, } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { getImageUrl } from "@/helpers/getImageUrl";

interface ChatRoom {
  _id: string;
  participants: any;
  lastMessage?: {
    text: string;
    createdAt: string;
  };
  unreadMessages?: number;
  plan?: {
    name: string;
    emoji: string;
  };
  todayisBirthDay?: boolean;
}

export function ChatSidebar({ chatRooms, currentUserId, isCreator, search, setSearch }: { chatRooms: ChatRoom[], currentUserId: string, isCreator?: boolean, search: string, setSearch: (search: string) => void }) {
  const [showFilter, setShowFilter] = useState(false);
  const pathname = usePathname();



  return (
    <div className="flex flex-col h-full bg-[#0d0e14] border-r border-white/8 shrink-0">
      {/* Search Header */}
      <div className="px-4 py-4 flex items-center gap-2 border-b border-white/8">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full bg-[#1a1b26] border border-white/8 rounded-xl pl-9 pr-4 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500/40 transition-all font-normal"
          />
        </div>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
        >
          <Filter size={14} />
        </button>
        <button
          className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 hover:bg-indigo-500/30 transition-colors"
          title="Mass Message"
        >
          <Users size={15} />
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {chatRooms?.filter(room => {
          // If there's a search query, show all results
          if (search.trim()) return true;
          // Always show the currently active chat room
          if (pathname.includes(room._id)) return true;
          // Otherwise, only show rooms that have at least one message
          return !!room.lastMessage;
        }).length > 0 ? (
          chatRooms
            .filter(room => {
              if (search.trim()) return true;
              if (pathname.includes(room._id)) return true;
              return !!room.lastMessage;
            })
            .map(room => {
              const otherParticipant = Array.isArray(room.participants)
                ? room.participants.find((p: any) => p._id !== currentUserId)
                : room.participants;
              const isActive = pathname.includes(room._id);

              return (
                <Link
                  key={room._id}
                  href={isCreator ? `/creator-message/${room._id}` : `/message/${room._id}`}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-all border-b border-white/4 group ${isActive ? "bg-white/5 border-r-2 border-r-indigo-500" : ""}`}
                >
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-[#1e1f2e] border border-white/10">
                      <Image
                        src={getImageUrl(otherParticipant?.image) || "/user.png"}
                        alt={otherParticipant?.name || "User"}
                        width={44}
                        height={44}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Mocking online status for now */}
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0d0e14]" />
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-white text-[14px] font-medium truncate group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                        {otherParticipant?.name}
                        {room.todayisBirthDay && <span title="Birthday Today!" className="text-sm">🎂</span>}
                      </span>
                      <span className="text-gray-600 text-[11px] font-medium">
                        {room.lastMessage ? new Date(room.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col min-w-0">
                        <p className={`text-[13px] truncate ${room.unreadMessages ? "text-indigo-300 font-medium" : "text-gray-500"}`}>
                          {room.lastMessage?.text || "No messages yet"}
                        </p>
                        {room.plan && (
                          <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                            {room.plan.emoji} {room.plan.name} Plan
                          </span>
                        )}
                      </div>
                      {room.unreadMessages ? (
                        <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 ml-2">
                          {room.unreadMessages}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              );
            })
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-sm">No conversations found</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e1e2a; border-radius: 10px; }
      `}</style>
    </div>
  );
}
