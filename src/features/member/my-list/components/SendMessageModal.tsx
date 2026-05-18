"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { avatarUrl } from "@/lib/image";
import type { Dictionary } from "@/i18n/dictionaries";
import type { User } from "@/lib/types";

interface SendMessageModalProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dict: Dictionary;
}

export function SendMessageModal({
  user,
  open,
  onOpenChange,
  dict,
}: SendMessageModalProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    console.log(`Message to ${user.username}:`, text.trim());
    setText("");
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 bg-white border border-border shadow-lg rounded-none sm:rounded-none">
        <div className="p-5">
          {/* Header: avatar + name + close */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Image
                src={avatarUrl(user.avatarSeed, 80)}
                alt={user.displayName}
                width={40}
                height={40}
                className="size-10 rounded-full object-cover ring-1 ring-border"
                unoptimized
              />
              <div>
                <p className="text-sm font-semibold tracking-wide">
                  {user.displayName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user.city}
                  {user.state ? `, ${user.state}` : ""}, {user.country}
                </p>
              </div>
            </div>

          </div>

          {/* Message input */}
          <div className="flex items-center gap-2 border border-border rounded px-3 py-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={dict.myList.sendPrivateMessage}
              className="flex-1 text-sm outline-none bg-transparent placeholder:text-muted-foreground"
              autoFocus
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!text.trim()}
              className="text-muted-foreground hover:text-brand disabled:opacity-40 transition-colors"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
