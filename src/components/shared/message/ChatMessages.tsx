"use client";

import { useEffect, useRef, useState } from "react";
import { ImageWithFallback as Image } from "@/components/shared/ImageWithFallback";
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  MoreVertical,
  ChevronLeft,
  CheckCheck,
  MessageSquare,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Flag,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Ban,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Phone,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Unlock,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  DropdownMenu,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  DropdownMenuContent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  DropdownMenuItem,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter, unstable_rethrow } from "next/navigation";
import { getImageUrl } from "@/helpers/getImageUrl";
import { myFetch } from "@/helpers/myFetch";
import { socketInstance } from "@/lib/socket";

// Sub-components for better organization
function Avatar({
  src,
  size = 10,
  online,
}: {
  src: string;
  size?: number;
  online?: boolean;
}) {
  return (
    <div className={`relative shrink-0 w-${size} h-${size}`}>
      <div
        className={`w-${size} h-${size} rounded-full overflow-hidden bg-gray-100 border border-gray-200`}
      >
        <Image
          src={src}
          alt="Avatar"
          width={size * 4}
          height={size * 4}
          className="w-full h-full object-cover"
        />
      </div>
      {/* {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
      )} */}
    </div>
  );
}

export function ChatMessages({
  chatId,
  currentUserId,
  activeUser,
  initialMessages = [],
}: {
  chatId: string;
  currentUserId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeUser: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialMessages?: any[];
}) {
  const isGroup = activeUser?.type === "group";
  const router = useRouter();
  // console.log(activeUser)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any[]>(() => {
    return [...initialMessages].reverse();
  });
  // console.log(messages)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const updateSourceRef = useRef<"initial" | "pagination" | "new-message">(
    "initial",
  );
  const socket = socketInstance();

  // Sync state when initialMessages prop changes (after router.refresh())
  useEffect(() => {
    if (initialMessages) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages((prev) => {
        const reversedInitial = [...initialMessages].reverse();

        // Merge strategy: Use server's truth + local messages not yet in server's truth
        const merged = [...reversedInitial];
        prev.forEach((localMsg) => {
          if (
            localMsg &&
            localMsg._id &&
            !merged.find((m) => m._id === localMsg._id)
          ) {
            merged.push(localMsg);
          }
        });

        // Ensure everything is sorted by creation date
        return merged.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      });
      setIsInitialLoad(false);
    }
  }, [initialMessages]);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  // const [messageGet, setMessageGet] = useState<boolean>(false)

  useEffect(() => {
    if (!socket) return;

    const eventName = `getMessage::${chatId}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onMessage = (data: any) => {
      if (data) {
        updateSourceRef.current = "new-message";
        setMessages((prev) => {
          const isDuplicate = prev.some((msg) => msg._id === data._id);
          if (isDuplicate) return prev;
          return [...prev, data];
        });

        setTimeout(() => {
          router.refresh();
        }, 300);
      }
    };

    socket.on(eventName, onMessage);

    return () => {
      socket.off(eventName, onMessage);
    };
  }, [socket, chatId, router]);

  // console.log(chatId, "chatId")
  const fetchMessages = async (pageNumber: number, isMore: boolean = false) => {
    if (isMore) setIsLoadingMore(true);
    try {
      const res = await myFetch(`/message/${chatId}?page=${pageNumber}`, {
        method: "GET",
        cache: "no-store",
      });

      if (res?.success) {
        const newMessages = res?.data || [];
        if (newMessages.length === 0) {
          setHasMore(false);
        } else {
          const reversedMessages = [...newMessages].reverse();
          if (isMore) {
            updateSourceRef.current = "pagination";
            // Capture scroll height before update
            if (containerRef.current) {
              prevScrollHeightRef.current = containerRef.current.scrollHeight;
            }
            setMessages((prev) => [...reversedMessages, ...prev]);
            setPage(pageNumber);
          } else {
            updateSourceRef.current = "initial";
            setMessages(reversedMessages);
            setIsInitialLoad(false);
          }
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      unstable_rethrow(error);
      console.error("Failed to fetch messages:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
    setHasMore(true);
    setIsInitialLoad(true);
    fetchMessages(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  const handleScroll = () => {
    if (
      containerRef.current &&
      containerRef.current.scrollTop === 0 &&
      hasMore &&
      !isLoadingMore
    ) {
      fetchMessages(page + 1, true);
    }
  };

  useEffect(() => {
    if (!containerRef.current || messages.length === 0) return;

    const source = updateSourceRef.current;

    if (source === "initial") {
      scrollToBottom();
    } else if (source === "pagination") {
      // Maintaining scroll position after loading more
      if (prevScrollHeightRef.current > 0) {
        const scrollDiff =
          containerRef.current.scrollHeight - prevScrollHeightRef.current;
        containerRef.current.scrollTop = scrollDiff;
        prevScrollHeightRef.current = 0;
      }
    } else if (source === "new-message") {
      // For now, always scroll to bottom for new messages as requested
      scrollToBottom();
    }
  }, [messages]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBlock = () => {
    toast.promise(
      myFetch(`/user/block`, {
        method: "POST",
        body: {
          user: otherParticipant?._id,
        },
      }),
      {
        loading: `Blocking ${otherParticipant?.name || "user"}...`,
        success: (res) => {
          setTimeout(() => {
            window.location.reload();
          }, 500);
          return res?.message || `Blocked ${otherParticipant?.name || "user"}`;
        },
        error: (err) => {
          return (
            err?.message ||
            `Failed to block ${otherParticipant?.name || "user"}`
          );
        },
      },
    );
  };

  const otherParticipant = Array.isArray(activeUser?.participants)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? activeUser?.participants?.find((p: any) => p._id !== currentUserId)
    : activeUser?.participants;

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] relative overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white/90 backdrop-blur-md z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/chat")}
            className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <Avatar
            src={getImageUrl(otherParticipant?.profile) || "/user.png"}
            online={true}
          />
          <div>
            <p className="text-gray-900 text-[15px] font-semibold">
              {otherParticipant?.name || "Loading..."}
            </p>
            {isGroup ? (
              <p className="text-gray-500 text-[11px] font-medium mt-0.5">
                {activeUser?.participants?.length} Participants
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* {!isGroup && (
            <button className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-all border border-gray-200">
              <Phone size={16} />
            </button>
          )} */}

          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-all border border-gray-200 outline-none">
                <MoreVertical size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-white border-gray-200 text-gray-900"
            >
              <DropdownMenuItem className="gap-3 cursor-pointer focus:bg-gray-50 text-gray-700">
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
          </DropdownMenu> */}
        </div>
      </div>

      {/* Messages List */}
      <div
        className="flex-1 overflow-y-auto px-5 py-6 space-y-6 custom-scrollbar"
        ref={containerRef}
        onScroll={handleScroll}
      >
        {/* Load more indicator */}
        {isLoadingMore && (
          <div className="flex justify-center py-2 animate-pulse">
            <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        )}

        {!hasMore && messages.length > 0 && (
          <div className="flex justify-center py-4">
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-700 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
              Beginning of your history
            </span>
          </div>
        )}
        {messages?.map((msg, idx) => {
          // console.log(messages)
          const isMe = msg.sender === currentUserId;
          const showAvatar =
            !isMe && (idx === 0 || messages[idx - 1]?.sender !== msg.sender);

          return (
            <div
              key={msg._id || idx}
              className={`flex items-end gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}
            >
              {!isMe && (
                <div className="w-8 h-8 shrink-0">
                  {showAvatar ? (
                    <Image
                      src={
                        getImageUrl(
                          otherParticipant?.profile || otherParticipant?.image,
                        ) || "/user.png"
                      }
                      alt=""
                      width={32}
                      height={32}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full" />
                  )}
                </div>
              )}

              <div
                className={`max-w-[75%] space-y-1 ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm
                  ${
                    isMe
                      ? "bg-[#429CA8] text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                  }`}
                >
                  {/* Render multiple docs/images */}
                  {msg.docs && msg.docs.length > 0 && (
                    <div
                      className={`mb-2 grid gap-2 ${msg.docs.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
                    >
                      {msg.docs.map((doc: string, dIdx: number) => {
                        const url = getImageUrl(doc);
                        if (!url) return null;
                        return (
                          <div
                            key={dIdx}
                            className="rounded-lg overflow-hidden border border-white/10 bg-black/20"
                          >
                            <Image
                              src={url}
                              alt=""
                              width={400}
                              height={300}
                              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {Array.isArray(msg.image) &&
                    msg.image.length > 0 &&
                    (!msg.docs || msg.docs.length === 0) && (
                      <div
                        className={`mb-2 grid gap-2 ${msg.image.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
                      >
                        {msg.image.map((img: string, iIdx: number) => {
                          const url = getImageUrl(img);
                          if (!url) return null;
                          return (
                            <div
                              key={iIdx}
                              className="rounded-lg overflow-hidden border border-white/10 relative group/img"
                            >
                              <Image
                                src={url}
                                alt="Message content"
                                width={300}
                                height={200}
                                className="w-full h-auto hover:scale-[1.02] transition-transform duration-500"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  {msg.text && <p>{msg.text}</p>}
                </div>

                <div
                  className={`flex items-center gap-1.5 px-1 ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <span className="text-gray-600 text-[10px] font-medium tracking-tight">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {isMe && <CheckCheck size={12} className="text-[#429CA8]" />}
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
              <p className="text-gray-900 font-semibold">
                Start the conversation
              </p>
              <p className="text-gray-500 text-sm">
                Send a message to start chatting with {otherParticipant?.name}
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
