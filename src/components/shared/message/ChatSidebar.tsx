"use client";

import { useState } from "react";
import { Search, Filter, Users, MoreVertical, Trash2, Ban } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { getImageUrl } from "@/helpers/getImageUrl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ChatRoom {
  _id: string;
  name?: string;
  type?: string;
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

export function ChatSidebar({
  chatRooms,
  groupRooms = [],
  currentUserId,
  search,
  setSearch
}: {
  chatRooms: ChatRoom[],
  groupRooms?: ChatRoom[],
  currentUserId: string,
  search: string,
  setSearch: (search: string) => void
}) {
  const [showFilter, setShowFilter] = useState(false);
  const [activeTab, setActiveTab] = useState<'chats' | 'groups'>('chats');
  const pathname = usePathname();



  const handleAction = (e: React.MouseEvent, action: string) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`${action} successful!`);
  };

  const activeRooms = activeTab === 'chats' ? chatRooms : groupRooms;

  return (
    <div className="flex flex-col h-full bg-white lg:border-r border-gray-200 shrink-0">
      {/* Search Header */}
      <div className="px-4 py-4 flex flex-col gap-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-[#429CA8]/40 focus:ring-1 focus:ring-[#429CA8]/40 transition-all font-normal"
            />
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
          >
            <Filter size={14} />
          </button>
          <button
            className="w-9 h-9 rounded-xl bg-[#429CA8]/10 flex items-center justify-center text-[#429CA8] hover:bg-[#429CA8]/20 transition-colors"
            title="Mass Message"
          >
            <Users size={15} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'chats' ? 'bg-white text-[#429CA8] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Chats
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'groups' ? 'bg-white text-[#429CA8] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Public Groups
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeRooms?.filter(room => {
          if (search.trim()) return true;
          if (pathname.includes(room._id)) return true;
          return !!room.lastMessage;
        }).length > 0 ? (
          activeRooms
            .filter(room => {
              if (search.trim()) return true;
              if (pathname.includes(room._id)) return true;
              return !!room.lastMessage;
            })
            .map(room => {
              const isGroup = room.type === 'group';
              const displayParticipant = isGroup ? null : (Array.isArray(room.participants)
                ? room.participants.find((p: any) => p._id !== currentUserId)
                : room.participants);

              const displayName = isGroup ? room?.name : displayParticipant?.name;
              const displayImage = isGroup ? room?.participants?.image : displayParticipant?.image;

              const isActive = pathname.includes(room._id);

              const lang = pathname.split('/')[1] || 'en';
              const chatHref = `/${lang}/chat/${room._id}`;

              return (
                <Link
                  key={room._id}
                  href={chatHref}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-all border-b border-gray-100 group ${isActive ? "bg-gray-50 border-r-2 border-r-[#429CA8]" : ""}`}
                >
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                      <Image
                        src={getImageUrl(displayImage) || "/user.png"}
                        alt={displayName || "User"}
                        width={44}
                        height={44}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Mocking online status for now */}
                    {!isGroup && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-[14px] font-medium truncate transition-colors flex items-center gap-1.5 ${isActive ? 'text-[#429CA8]' : 'text-gray-900 group-hover:text-[#429CA8]'}`}>
                        {displayName}
                        {room.todayisBirthDay && <span title="Birthday Today!" className="text-sm">🎂</span>}
                      </span>
                      <span className="text-gray-500 text-[11px] font-medium shrink-0 ml-2">
                        {room.lastMessage ? new Date(room.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col min-w-0 flex-1">
                        <p className={`text-[13px] truncate ${room.unreadMessages ? "text-[#429CA8] font-semibold" : "text-gray-500"}`}>
                          {room.lastMessage?.text || "No messages yet"}
                        </p>
                        {room.plan && (
                          <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                            {room.plan.emoji} {room.plan.name} Plan
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {room.unreadMessages ? (
                          <span className="w-5 h-5 rounded-full bg-[#429CA8] text-white text-[10px] font-bold flex items-center justify-center">
                            {room.unreadMessages}
                          </span>
                        ) : null}

                        {/* Dropdown Menu for Actions */}
                        <div onClick={e => e.preventDefault()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="w-6 h-6 rounded-md hover:bg-gray-200 flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical size={14} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 bg-white border-gray-200">
                              <DropdownMenuItem
                                onClick={(e) => handleAction(e, "Delete")}
                                className="text-red-500 focus:text-red-600 focus:bg-red-50 cursor-pointer gap-2"
                              >
                                <Trash2 size={14} />
                                <span>Delete Chat</span>
                              </DropdownMenuItem>
                              {!isGroup && (
                                <DropdownMenuItem
                                  onClick={(e) => handleAction(e, "Block")}
                                  className="text-orange-500 focus:text-orange-600 focus:bg-orange-50 cursor-pointer gap-2"
                                >
                                  <Ban size={14} />
                                  <span>Block User</span>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
        ) : (
          <div className="p-8 text-center flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
              <Search size={20} />
            </div>
            <p className="text-gray-500 text-sm font-medium">No {activeTab} found</p>
            <p className="text-gray-400 text-xs">Try a different search term</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
      `}</style>
    </div>
  );
}
