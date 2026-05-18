"use client";

import { useState, useRef } from "react";
import { Smile, Paperclip, Send, X, Plus, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { myFetch } from "@/helpers/myFetch";
import { useRouter } from "next/navigation";
import { revalidateTags } from "@/helpers/revalidateTags";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ChatInput({ chatId, activeUser, profile }: { chatId: string; activeUser: any, profile: any }) {
  // console.log(activeUser, 'chat input')
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length + files.length > 5) {
      toast.error("You can only send up to 5 images at once");
      return;
    }
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!text.trim() && files.length === 0) return;

    setIsSending(true);

    try {
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newMessage = {
        _id: "mock_msg_" + Date.now(),
        sender: profile?._id || "user_me",
        text: text,
        createdAt: new Date().toISOString(),
        image: files.length > 0 ? URL.createObjectURL(files[0]) : undefined,
        docs: files.length > 1 ? files.map(f => URL.createObjectURL(f)) : undefined
      };

      // Dispatch event to ChatMessages component
      const event = new CustomEvent("newChatMessage", { 
        detail: { chatId, message: newMessage } 
      });
      window.dispatchEvent(event);

      setText("");
      setFiles([]);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      const res = await myFetch(`/message/purchase/${activeUser?._id}`, {
        method: "POST"
      });
      // console.log(res)
      if (res?.success) {
        revalidateTags(["wallet"])
        toast.success("Credits purchased successfully!");
        router.refresh();
      } else {
        toast.error(res?.message || "Purchase failed");
      }
    } catch (error) {
      toast.error("Failed to process purchase");
      console.error(error);
    } finally {
      setIsPurchasing(false);
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setText(prev => prev + emojiData.emoji);
  };

  const isBlocked = activeUser?.status === "block";
  const iBlockedThem = activeUser?.blockByMe === true;
  const theyBlockedMe = isBlocked && !iBlockedThem;
  const hasNoCredit = activeUser?.remaningMessage <= 0;

  if (hasNoCredit && !isBlocked && profile?.role === "FAN") {
    return (
      <div className="px-5 py-4 border-t border-gray-200 bg-white relative z-20">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#429CA8]/10 flex items-center justify-center text-[#429CA8] shrink-0">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-[15px]">Out of messages</p>
              <p className="text-gray-500 text-xs">You don't have enough credit to send messages. <span className="text-[#429CA8] font-medium">5 Credits / 20 messages</span></p>
            </div>
          </div>
          <button
            onClick={handlePurchase}
            disabled={isPurchasing}
            className="w-full sm:w-auto bg-[#429CA8] hover:bg-[#347A83] text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-nowrap"
          >
            {isPurchasing ? (
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              "Buy 5 Credits"
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-4 border-t border-gray-200 bg-white relative z-20">
      {/* File Previews */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 bg-gray-50 p-3 rounded-2xl border border-gray-200">
          {files.map((file, i) => (
            <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 group">
              <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removeFile(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-16 h-16 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-all"
          >
            <Plus size={20} />
          </button>
        </div>
      )}

      {/* Main Bar */}
      <div className={`flex items-center gap-3 border rounded-2xl px-4 py-2.5 shadow-sm transition-all group
  ${isBlocked
          ? "bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed"
          : "bg-gray-50 border-gray-200 focus-within:border-[#429CA8]/40"}`}>

        <Popover>
          <PopoverTrigger asChild>
            <button
              disabled={isBlocked}
              className="text-gray-400 hover:text-[#429CA8] transition-colors shrink-0 disabled:pointer-events-none disabled:text-gray-300"
            >
              <Smile size={20} />
            </button>
          </PopoverTrigger>

          <PopoverContent
            side="top"
            align="end"
            className="p-0 border-none bg-transparent"
          >
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </PopoverContent>
        </Popover>

        <input
          type="text"
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder={
            iBlockedThem
              ? "Unblock this user to send messages..."
              : theyBlockedMe
                ? "You cannot reply in this conversation..."
                : "Type a message..."
          }
          disabled={isSending || isBlocked}
          className="flex-1 bg-transparent text-gray-900 text-[14px] placeholder-gray-400 focus:outline-none min-w-0 font-normal disabled:cursor-not-allowed"
        />

        <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
          {activeUser?.remaningMessage !== undefined && profile?.role === "FAN" && (
            <Tooltip>
              <TooltipTrigger asChild disabled={isSending || isBlocked}>
                <div className="flex items-center justify-center min-w-[20px] h-6 px-1.5 rounded-md bg-white border border-gray-200 cursor-help hover:border-[#429CA8]/30 hover:bg-[#429CA8]/5 transition-all group/credit">
                  <span className="text-[10px] font-bold text-gray-500 group-hover/credit:text-[#429CA8] transition-colors">
                    {activeUser.remaningMessage}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-white border-gray-200 text-gray-700 shadow-sm">
                <p className="text-xs font-medium">Remaining messages: <span className="text-gray-900">{activeUser.remaningMessage}</span></p>
              </TooltipContent>
            </Tooltip>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept="image/*"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isBlocked}
            className="text-gray-400 hover:text-[#429CA8] transition-colors shrink-0 disabled:pointer-events-none disabled:text-gray-300"
          >
            <Paperclip size={18} />
          </button>

          <button
            onClick={handleSend}
            disabled={isSending || (!text.trim() && files.length === 0) || isBlocked}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0
        ${isSending || (!text.trim() && files.length === 0) || isBlocked
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#429CA8] text-white hover:bg-[#347A83] shadow-sm active:scale-95"}`}
          >
            {isSending ? (
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <Send size={15} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

