import { ChatInput } from "@/components/shared/message/ChatInput";
import { ChatMessages } from "@/components/shared/message/ChatMessages";
import getProfile from "@/helpers/getProfile";
import { myFetch } from "@/helpers/myFetch";


export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatDetailPage({ params }: PageProps) {
  const { id } = await params;
  let activeUser = null;
  let currentUserId = "";
  let initialMessages = [];
  let loadingError = false;

  const profile = await getProfile();
  try {
    if (profile?._id) {
      currentUserId = profile._id;

      // Fetch chat room details
      const room = await myFetch(`/chat/${id}`, {
        method: "GET",
        tags: ["chat", `chat-${id}`],
        cache: "no-store"
      });

      if (room?.success) {
        activeUser = room.data;

        // Fetch initial messages
        const msgRes = await myFetch(`/message/${id}?page=1`, {
          method: "GET",
          tags: ["message", `message-${id}`],
          cache: "no-store",
        });

        if (msgRes?.success) {
          initialMessages = msgRes.data || [];
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch chat details on server:", error);
    loadingError = true;
  }

  if (loadingError || !activeUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0d0e14] h-full p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-4 shadow-lg shadow-red-500/5">
          <span className="font-black text-2xl">!</span>
        </div>
        <h2 className="text-white font-bold text-lg mb-2">Conversation Not Found</h2>
        <p className="text-gray-500 text-sm max-w-xs mx-auto">
          We couldn't retrieve the details for this chat. It may have been deleted or moved.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0d0e14] border-l border-white/8">
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
      <div className="shrink-0 bg-[#0d0e14]">
        <ChatInput
          chatId={id}
          activeUser={activeUser}
          profile={profile}
        />
      </div>

      {/* Aesthetic Border Highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-indigo-500/10 pointer-events-none" />
    </div>
  );
}
