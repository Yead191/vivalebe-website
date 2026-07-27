"use client";

import { ChatSidebar } from "@/components/shared/message/ChatSidebar";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Spinner from "@/components/shared/Spinner";
import { io } from "socket.io-client";
import getProfile from "@/helpers/getProfile";
import { myFetch } from "@/helpers/myFetch";

export default function MessageLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isChatRoomActive = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.length > 1;
  }, [pathname]);

  const [search, setSearch] = useState("");
  const [userId, setUser] = useState(null);
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const socket = useMemo(
    () =>
      io(
        process.env.NEXT_PUBLIC_SOCKET_URL ??
          process.env.SOCKET_URL ??
          "http://10.10.26.159:5000",
      ),
    [],
  );

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getProfile();
      setUser(user?._id);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    socket.on(`chatList::${userId}`, (data) => {
      // console.log(data, 'chat room data received');
      if (!data) return;

      setChatRooms((prev) => {
        let updatedRooms = [...prev];
        const incomingRooms = Array.isArray(data) ? data : [data];

        incomingRooms.forEach((newRoom) => {
          if (!newRoom?._id) return;

          const roomIndex = updatedRooms.findIndex(
            (r) => r._id === newRoom._id,
          );
          if (roomIndex !== -1) {
            // Update existing room with new data, merging fields
            updatedRooms[roomIndex] = {
              ...updatedRooms[roomIndex],
              ...newRoom,
            };
          } else {
            // Add new room to the list
            updatedRooms = [newRoom, ...updatedRooms];
          }
        });

        // Keep the list sorted by most recent message
        return updatedRooms.sort((a, b) => {
          const timeA = a.lastMessage?.createdAt
            ? new Date(a.lastMessage.createdAt).getTime()
            : 0;
          const timeB = b.lastMessage?.createdAt
            ? new Date(b.lastMessage.createdAt).getTime()
            : 0;
          return timeB - timeA;
        });
      });
    });

    return () => {
      socket.off(`chatList::${userId}`);
    };
  }, [socket, userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await getProfile();
        if (profile?._id) {
          setCurrentUserId(profile._id);
          const rooms = await myFetch(`/chat?searchTerm=${search}`, {
            method: "GET",
            tags: ["chat"],
            cache: "no-store",
          });
          if (rooms?.success) {
            const sortedRooms = [...(rooms.data || [])].sort((a, b) => {
              const timeA = a.lastMessage?.createdAt
                ? new Date(a.lastMessage.createdAt).getTime()
                : 0;
              const timeB = b.lastMessage?.createdAt
                ? new Date(b.lastMessage.createdAt).getTime()
                : 0;
              return timeB - timeA;
            });
            setChatRooms(sortedRooms);
          }
        }
      } catch (error) {
        console.error("Failed to fetch chat data:", error);
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
        className={`w-full lg:w-1/3 xl:w-1/4 shrink-0 h-full lg:border-r lg:border-gray-200 ${isChatRoomActive ? "hidden lg:block" : "block"}`}
      >
        <ChatSidebar
          chatRooms={chatRooms}
          currentUserId={currentUserId}
          search={search}
          setSearch={setSearch}
        />
      </div>

      {/* Main Content (Conversations) */}
      <div
        className={`flex-1 h-full relative overflow-hidden bg-[#F8FAFC] ${isChatRoomActive ? "block" : "hidden lg:block"}`}
      >
        {children}
      </div>
    </div>
  );
}
