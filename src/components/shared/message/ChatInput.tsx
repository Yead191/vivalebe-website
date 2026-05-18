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
    const formData = new FormData();
    formData.append("text", text);
    formData.append("chatId", chatId);
    formData.append("type", "text");

    files.forEach(file => {
      formData.append("image", file);
    });

    try {
      const res = await myFetch("/message", {
        method: "POST",
        body: formData,
      });
      // console.log(res)
      if (res?.success) {
        setText("");
        setFiles([]);
        revalidateTags(["message",])
        router.refresh();
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
      else if (res?.message === "You don't have enough credit to send messages" ||
        res?.message === "blocked by user") {
        toast.error(res.message);

        setTimeout(() => {
          window.location.reload();
        }, 300);

        return;
      }
      else {
        toast.error(res?.message || "Failed to send message");
      }
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
      <div className="px-5 py-4 border-t border-white/8 bg-[#0d0e14] relative z-20">
        <div className="bg-[#1a1b26] border border-indigo-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_20px_rgba(79,70,229,0.1)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-white font-semibold text-[15px]">Out of messages</p>
              <p className="text-gray-400 text-xs">You don't have enough credit to send messages. <span className="text-indigo-400 font-medium">5 Credits / 20 messages</span></p>
            </div>
          </div>
          <button
            onClick={handlePurchase}
            disabled={isPurchasing}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-nowrap"
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
    <div className="px-5 py-4 border-t border-white/8 bg-[#0d0e14] relative z-20">
      {/* File Previews */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 bg-[#1a1b26] p-3 rounded-2xl border border-white/8">
          {files.map((file, i) => (
            <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 group">
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
            className="w-16 h-16 rounded-xl border border-dashed border-white/20 flex items-center justify-center text-white/20 hover:text-white/40 hover:border-white/40 transition-all"
          >
            <Plus size={20} />
          </button>
        </div>
      )}

      {/* Main Bar */}
      <div className={`flex items-center gap-3 border rounded-2xl px-4 py-2.5 shadow-lg transition-all group
  ${isBlocked
          ? "bg-[#14151e] border-white/6 opacity-50 cursor-not-allowed"
          : "bg-[#1a1b26] border-white/10 focus-within:border-indigo-500/40"}`}>

        <Popover>
          <PopoverTrigger asChild>
            <button
              disabled={isBlocked}
              className="text-gray-500 hover:text-indigo-400 transition-colors shrink-0 disabled:pointer-events-none disabled:text-gray-700"
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
          className="flex-1 bg-transparent text-white text-[14px] placeholder-gray-600 focus:outline-none min-w-0 font-normal disabled:cursor-not-allowed"
        />

        <div className="flex items-center gap-2 border-l border-white/10 pl-3">
          {activeUser?.remaningMessage !== undefined && profile?.role === "FAN" && (
            <Tooltip>
              <TooltipTrigger asChild disabled={isSending || isBlocked}>
                <div className="flex items-center justify-center min-w-[20px] h-6 px-1.5 rounded-md bg-white/5 border border-white/10 cursor-help hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group/credit">
                  <span className="text-[10px] font-bold text-gray-400 group-hover/credit:text-indigo-400 transition-colors">
                    {activeUser.remaningMessage}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-[#1a1b26] border-white/10 text-gray-300">
                <p className="text-xs font-medium">Remaining messages: <span className="text-white">{activeUser.remaningMessage}</span></p>
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
            className="text-gray-500 hover:text-indigo-400 transition-colors shrink-0 disabled:pointer-events-none disabled:text-gray-700"
          >
            <Paperclip size={18} />
          </button>

          <button
            onClick={handleSend}
            disabled={isSending || (!text.trim() && files.length === 0) || isBlocked}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0
        ${isSending || (!text.trim() && files.length === 0) || isBlocked
                ? "bg-[#252636] text-gray-700 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-95"}`}
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

