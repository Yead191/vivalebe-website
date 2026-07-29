"use client";

import { useState, useEffect } from "react";
import { Bell, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getNotifications } from "./action";

function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return "just now";
}

export function NotificationsBell() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifs() {
      try {
        const data = await getNotifications();
        console.log("NOTIFICATIONS API RESPONSE:", data);
        setItems(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifs();
  }, []);
  const unread = items.length;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Notifications"
        className="relative inline-flex size-9 items-center justify-center rounded-full text-white/90 hover:bg-white/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        <Bell className="size-5" />
        {unread > 0 ? (
          <span className="absolute top-1 right-1 size-2 rounded-full bg-green-300" />
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 p-2 rounded-2xl border-none shadow-2xl bg-white/95 backdrop-blur-xl"
      >
        <div className="px-3 py-2.5 mb-2 flex items-center justify-between border-b border-neutral-100">
          <span className="text-sm font-bold text-neutral-800 tracking-tight">
            Notifications
          </span>
          {unread > 0 && (
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#429CA8]/10 text-[#429CA8] uppercase tracking-wider">
              {unread} New
            </span>
          )}
        </div>
        {loading ? (
          <div className="px-3 py-10 flex justify-center text-neutral-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="px-3 py-10 text-sm text-neutral-400 text-center flex flex-col items-center gap-3">
            <div className="p-3 rounded-full bg-neutral-50 border border-neutral-100">
              <Bell className="w-6 h-6 opacity-30" />
            </div>
            <p className="font-medium">Nothing new right now</p>
          </div>
        ) : (
          <div className="space-y-1 max-h-[300px] overflow-y-auto">
            {items.map((n: any) => {
              const text = n.message || n.title || n.text || "New notification";
              let at = "just now";
              try {
                if (n.createdAt) {
                  at = timeAgo(new Date(n.createdAt));
                }
              } catch (e) {}

              return (
                <DropdownMenuItem
                  key={n._id || n.id || Math.random()}
                  className="cursor-pointer rounded-xl flex flex-col items-start gap-1 p-3 hover:bg-[#429CA8]/5 focus:bg-[#429CA8]/5 transition-all border border-transparent hover:border-[#429CA8]/10"
                >
                  <span className="text-sm font-semibold text-neutral-700">
                    {text}
                  </span>
                  <span className="text-[11px] font-bold text-[#429CA8]">
                    {at}
                  </span>
                </DropdownMenuItem>
              );
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
