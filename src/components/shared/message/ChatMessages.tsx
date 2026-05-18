"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { MoreVertical, ChevronLeft, CheckCheck, MessageSquare, Flag, Ban, Lock, Loader2, Phone, Unlock } from "lucide-react";
import { socketInstance } from "@/lib/socket";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter } from "next/navigation";
import { myFetch } from "@/helpers/myFetch";
import { revalidateTags } from "@/helpers/revalidateTags";
import { getImageUrl } from "@/helpers/getImageUrl";

// Sub-components for better organization
function Avatar({ src, size = 10, online }: { src: string; size?: number; online?: boolean }) {
  return (
    <div className={`relative shrink-0 w-${size} h-${size}`}>
      <div className={`w-${size} h-${size} rounded-full overflow-hidden bg-gray-100 border border-gray-200`}>
        <Image src={src} alt="Avatar" width={size * 4} height={size * 4} className="w-full h-full object-cover" />
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
      )}
    </div>
  );
}

export function ChatMessages({
  chatId,
  currentUserId,
  activeUser,
  initialMessages = []
}: {
  chatId: string;
  currentUserId: string;
  activeUser: any;
  initialMessages?: any[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>(() => {
    return [...initialMessages];
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [unlockingMessageId, setUnlockingMessageId] = useState<string | null>(null);

  // Auto-scroll on mount or new messages
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle mock messages pushed via window event
  useEffect(() => {
    const handleNewMessage = (e: any) => {
      const msg = e.detail;
      if (msg.chatId === chatId) {
        setMessages(prev => [...prev, msg.message]);
      }
    };
    window.addEventListener("newChatMessage", handleNewMessage);
    return () => window.removeEventListener("newChatMessage", handleNewMessage);
  }, [chatId]);

  const handleUnlockImage = async (messageId: string) => {
    if (unlockingMessageId) return;
    setUnlockingMessageId(messageId);
    setTimeout(() => {
      toast.success("Content unlocked successfully!");
      setUnlockingMessageId(null);
    }, 1000);
  };

  const handleBlock = () => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 800)), {
      loading: `Blocking...`,
      success: () => `Action successful`,
      error: () => `Failed`,
    });
  };

  const isGroup = activeUser?.type === 'group';
  
  const otherParticipant = isGroup ? null : (Array.isArray(activeUser?.participants)
    ? activeUser?.participants?.find((p: any) => p._id !== currentUserId)
    : activeUser?.participants);

  const headerName = isGroup ? activeUser?.name : otherParticipant?.name;
  const headerImage = isGroup ? activeUser?.image : otherParticipant?.image;

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] relative overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white/90 backdrop-blur-md z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/chat')}
            className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <Avatar src={getImageUrl(headerImage) || "/user.png"} online={!isGroup} />
          <div>
            <p className="text-gray-900 text-[15px] font-semibold">{headerName || "Loading..."}</p>
            {isGroup ? (
              <p className="text-gray-500 text-[11px] font-medium mt-0.5">
                {activeUser?.participants?.length} Participants
              </p>
            ) : (
              <p className="text-green-500 text-[11px] font-medium uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Online
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isGroup && (
            <button className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-all border border-gray-200">
              <Phone size={16} />
            </button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-all border border-gray-200 outline-none">
                <MoreVertical size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white border-gray-200 text-gray-900">
              <DropdownMenuItem
                className="gap-3 cursor-pointer focus:bg-gray-50 text-gray-700"
              >
                <Flag size={16} className="text-amber-500" />
                <span>Report User</span>
              </DropdownMenuItem>
              {!(activeUser?.status === "block" && !activeUser?.blockByMe) && (
                <DropdownMenuItem
                  onClick={handleBlock}
                  className="gap-3 cursor-pointer focus:bg-red-50 focus:text-red-600 text-red-500"
                >
                  {activeUser?.status === "block" && activeUser?.blockByMe ? (
                    <Unlock size={16} />
                  ) : (
                    <Ban size={16} />
                  )}
                  <span>
                    {activeUser?.status === "block" && activeUser?.blockByMe
                      ? "Unblock User"
                      : "Block User"}
                  </span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages List */}
      <div
        className="flex-1 overflow-y-auto px-5 py-6 space-y-6 custom-scrollbar"
        ref={containerRef}
      >
        <div className="flex justify-center py-4">
          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full border border-gray-200">
            Beginning of your history
          </span>
        </div>
        
        {messages?.map((msg, idx) => {
          const isMe = msg.sender === currentUserId;
          const showAvatar = !isMe && (idx === 0 || messages[idx - 1]?.sender !== msg.sender);
          
          let senderParticipant = null;
          if (isGroup && !isMe) {
            senderParticipant = activeUser?.participants?.find((p: any) => p._id === msg.sender);
          } else if (!isGroup && !isMe) {
            senderParticipant = otherParticipant;
          }

          return (
            <div key={msg._id || idx} className={`flex items-end gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
              {!isMe && (
                <div className="w-8 h-8 shrink-0">
                  {showAvatar ? (
                    <Image src={getImageUrl(senderParticipant?.image) || "/user.png"} alt="" width={32} height={32} className="w-full h-full rounded-full object-cover border border-gray-200" />
                  ) : <div className="w-full" />}
                </div>
              )}

              <div className={`max-w-[75%] space-y-1 ${isMe ? "items-end" : "items-start"}`}>
                {!isMe && isGroup && showAvatar && senderParticipant && (
                  <p className="text-[11px] font-semibold text-gray-500 ml-1">{senderParticipant.name}</p>
                )}
                
                <div className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm
                  ${isMe
                    ? "bg-[#429CA8] text-white rounded-br-sm"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"}`}>

                  {/* Single image fallback */}
                  {msg.image && (!msg.docs || msg.docs.length === 0) && (
                    <div className="mb-2 rounded-lg overflow-hidden border border-gray-100 relative group/img">
                        <Image
                          src={getImageUrl(msg.image) || ""}
                          alt="Message content"
                          width={300}
                          height={200}
                          className="w-full h-auto hover:scale-[1.02] transition-transform duration-500"
                        />
                    </div>
                  )}
                  {msg.text && <p>{msg.text}</p>}
                </div>

                <div className={`flex items-center gap-1.5 px-1 ${isMe ? "justify-end" : "justify-start"}`}>
                  <span className="text-gray-400 text-[10px] font-medium tracking-tight">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && (
                    <CheckCheck size={12} className="text-[#429CA8]" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {messages?.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-3xl bg-gray-50 border border-gray-200 flex items-center justify-center shadow-sm">
              <MessageSquare size={28} className="text-[#429CA8]/40" />
            </div>
            <div>
              <p className="text-gray-900 font-semibold">Start the conversation</p>
              <p className="text-gray-500 text-sm">Send a message to start chatting with {headerName}</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
      `}</style>

    </div>
  );
}
