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
          <span className="absolute top-1 right-1 size-2 rounded-full bg-red-500" />
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        {items.length === 0 ? (
          <div className="px-3 py-4 text-sm text-muted-foreground text-center">
            Nothing new.
          </div>
        ) : (
          items.map((n) => (
            <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5">
              <span className="text-sm">{n.text}</span>
              <span className="text-xs text-muted-foreground">{n.at} ago</span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
