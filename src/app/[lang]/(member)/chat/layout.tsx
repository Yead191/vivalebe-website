"use client";

import { ChatSidebar } from "@/components/shared/message/ChatSidebar";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { mockCurrentUser } from "@/constants/mockChatData";
import Spinner from "@/components/shared/Spinner";
import { getChatList } from "@/features/member/chat/action";

export default function MessageLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isChatPage = pathname.endsWith("/chat") || pathname.endsWith("/chat/");
  const [search, setSearch] = useState("");
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [groupRooms, setGroupRooms] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getChatList();
        setCurrentUserId(data.currentUserId || mockCurrentUser._id);

        const mappedChats = (data.chats || []).map((room: any) => ({
          _id: room._id,
          participants: room.participants || [],
          lastMessage: room.lastMessage || null,
          status: room.status,
          chatType: room.chatType,
        }));

        const filtered = search
          ? mappedChats.filter((room: any) =>
              room.participants.some((p: any) =>
                (p.name || p.id || "")
                  .toLowerCase()
                  .includes(search.toLowerCase()),
              ),
            )
          : mappedChats;

        setChatRooms(filtered);
      } catch (error) {
        console.error("Failed to fetch chat data:", error);
        setCurrentUserId(mockCurrentUser._id);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex md:max-w-270 mx-auto overflow-hidden bg-white h-[calc(100vh-64px)]">
      {/* Sidebar - Persistent */}
      <div
        className={`w-full lg:w-1/3 xl:w-1/4 shrink-0 h-full lg:border-r lg:border-gray-200 ${isChatPage ? "block" : "hidden lg:block"}`}
      >
        <ChatSidebar
          chatRooms={chatRooms}
          groupRooms={groupRooms}
          currentUserId={currentUserId}
          search={search}
          setSearch={setSearch}
        />
      </div>

      {/* Main Content (Conversations) */}
      <div
        className={`flex-1 h-full relative overflow-hidden bg-[#F8FAFC] ${isChatPage ? "hidden lg:block" : "block"}`}
      >
        {children}
      </div>
    </div>
  );
}
