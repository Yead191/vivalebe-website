"use client";

import { ChatSidebar } from "@/components/shared/message/ChatSidebar";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { mockChatRooms, mockCurrentUser, mockGroupRooms } from "@/constants/mockChatData";
import Spinner from "@/components/shared/Spinner";

// API LOGIC COMMENTED OUT FOR DEMO PURPOSES
// import getProfile from "@/helpers/getProfile";
// import { myFetch } from "@/helpers/myFetch";
// import { io } from "socket.io-client";

export default function MessageLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isChatPage = pathname.endsWith('/chat') || pathname.endsWith('/chat/');
    const [search, setSearch] = useState("");
    const [chatRooms, setChatRooms] = useState<any[]>([]);
    const [groupRooms, setGroupRooms] = useState<any[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // MOCK DATA INITIALIZATION
        // Simulating network fetch
        const fetchData = async () => {
            setTimeout(() => {
                setCurrentUserId(mockCurrentUser._id);

                // Filter by search term if needed
                const filteredChats = mockChatRooms.filter(room =>
                    search ? room.participants.some(p => p.name.toLowerCase().includes(search.toLowerCase())) : true
                );

                const filteredGroups = mockGroupRooms.filter(room =>
                    search ? room.name.toLowerCase().includes(search.toLowerCase()) : true
                );

                setChatRooms(filteredChats);
                setGroupRooms(filteredGroups);
                setLoading(false);
            }, 500);
        };
        fetchData();

        /* --- OLD API LOGIC --- 
        const fetchUser = async () => {
            const user = await getProfile();
            setCurrentUserId(user?._id);
        };
        fetchUser();

        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://68.178.164.48:5005");
        socket.on(`chatList::${currentUserId}`, (data) => {
            // ... update logic
        });
        ------------------------- */

    }, [search]);

    if (loading) {
        return (
            <Spinner />
        );
    }

    return (
        <div className="flex md:max-w-270 mx-auto overflow-hidden bg-white h-[calc(100vh-64px)]">
            {/* Sidebar - Persistent */}
            <div className={`w-full lg:w-1/3 xl:w-1/4 shrink-0 h-full lg:border-r lg:border-gray-200 ${isChatPage ? 'block' : 'hidden lg:block'}`}>
                <ChatSidebar
                    chatRooms={chatRooms}
                    groupRooms={groupRooms}
                    currentUserId={currentUserId}
                    search={search}
                    setSearch={setSearch}
                />
            </div>

            {/* Main Content (Conversations) */}
            <div className={`flex-1 h-full relative overflow-hidden bg-[#F8FAFC] ${isChatPage ? 'hidden lg:block' : 'block'}`}>
                {children}
            </div>
        </div>
    );
}
