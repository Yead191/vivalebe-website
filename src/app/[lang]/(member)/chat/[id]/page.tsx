import { ChatInput } from "@/components/shared/message/ChatInput";
import { ChatMessages } from "@/components/shared/message/ChatMessages";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { mockCurrentUser } from "@/constants/mockChatData";
import getProfile from "@/helpers/getProfile";
import { myFetch } from "@/helpers/myFetch";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatDetailPage({ params }: PageProps) {
  const { id } = await params;
  // console.log(id);
  let activeUser = null;
  let currentUserId = "";
  let initialMessages = [];
  let loadingError = false;
  const profile = await getProfile();
// console.log(profile)
  try {
    if (profile?._id) {
      currentUserId = profile._id;

      // Fetch chat room details
      const room = await myFetch(`/chat/${id}`, {
        method: "GET",
        tags: ["chat", `chat-${id}`],
        cache: "no-store",
      });
      if (room?.success) {
        activeUser = room.data;

        // Fetch initial messages
        const msgRes = await myFetch(`/message/${id}?page=1`, {
          method: "GET",
          tags: ["message", `message-${id}`],
          cache: "no-store",
        });
        // console.log(msgRes, "msgRes");
        if (msgRes?.success) {
          initialMessages = msgRes.data || [];
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch chat details on server:", error);
    loadingError = true;
  }
// console.log(activeUser, "activeUser")
  if (loadingError || !activeUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#F8FAFC] h-full p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center text-red-500 mb-4 shadow-lg shadow-red-500/5">
          <span className="font-black text-2xl">!</span>
        </div>
        <h2 className="text-gray-900 font-bold text-lg mb-2">
          Conversation Not Found
        </h2>
        <p className="text-gray-500 text-sm max-w-xs mx-auto">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          We couldn't retrieve the details for this chat. It may have been
          deleted or moved.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] border-l border-gray-200">
      {/* ── Chat Messages (Scrolling Area) ── */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <ChatMessages
          chatId={id}
          currentUserId={currentUserId}
          activeUser={activeUser}
          initialMessages={initialMessages}
        />
      </div>

      {/* ── Chat Input (Fixed Bottom) ── */}
      <div className="shrink-0 bg-white">
        <ChatInput chatId={id} activeUser={activeUser} profile={profile} />
      </div>

      {/* Aesthetic Border Highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gray-200 pointer-events-none" />
    </div>
  );
}
