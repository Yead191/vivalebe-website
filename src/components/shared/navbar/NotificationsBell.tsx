"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notif {
  id: string;
  text: string;
  at: string;
}

const initial: Notif[] = [
  { id: "n_1", text: "MAYA liked your video", at: "2m" },
  { id: "n_2", text: "AURORA sent you a wink", at: "1h" },
  { id: "n_3", text: "CAMILA viewed your profile", at: "3h" },
];

export function NotificationsBell() {
  const [items] = useState<Notif[]>(initial);
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
        {items.length === 0 ? (
          <div className="px-3 py-10 text-sm text-neutral-400 text-center flex flex-col items-center gap-3">
            <div className="p-3 rounded-full bg-neutral-50 border border-neutral-100">
              <Bell className="w-6 h-6 opacity-30" />
            </div>
            <p className="font-medium">Nothing new right now</p>
          </div>
        ) : (
          <div className="space-y-1">
            {items.map((n) => (
              <DropdownMenuItem
                key={n.id}
                className="cursor-pointer rounded-xl flex flex-col items-start gap-1 p-3 hover:bg-[#429CA8]/5 focus:bg-[#429CA8]/5 transition-all border border-transparent hover:border-[#429CA8]/10"
              >
                <span className="text-sm font-semibold text-neutral-700">
                  {n.text}
                </span>
                <span className="text-[11px] font-bold text-[#429CA8]">
                  {n.at} ago
                </span>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
