// @/components/settings/tabs/DeletedMembersTab.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, Ban, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getBlockedMembers, unblockUser } from "../action";
import { toast } from "sonner";
import { avatarUrl } from "@/lib/image";

export default function DeletedMembersTab({ t }: { t: any }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await getBlockedMembers();
        if (res.success && res.data) {
          setMembers(res.data);
        }
      } catch (error) {
        toast.error("Failed to load blocked members");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const handleUnblock = async (id: string) => {
    try {
      const res = await unblockUser(id);
      if (res.success) {
        setMembers(members.filter((m) => m._id !== id && m.blockedUserId?._id !== id && (m.blockedUserId || m.user || m.userId || m)._id !== id));
        toast.success(res.message || "Member unblocked");
      } else {
        toast.error(res.message || "Failed to unblock member");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const filteredMembers = members.filter((m) => {
    const user = m.blockedUserId || m.blockedUser || m.userId || m.user || m;
    return (user.name || user.displayName || user.username || "").toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-1">
          {t.deleted.title}
        </h2>
      </div>

      {/* Search Input field */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <Input
          type="text"
          placeholder={t.deleted.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11 bg-neutral-50/50 border-neutral-200/80 rounded-xl focus-visible:ring-[#429CA8]"
        />
      </div>

      {/* Blocked/Deleted connections stack */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-brand" />
          </div>
        ) : filteredMembers.length > 0 ? (
          filteredMembers.map((member) => {
            const user = member.blockedUserId || member.blockedUser || member.userId || member.user || member;
            return (
            <div
              key={member._id || user._id}
              className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 hover:bg-neutral-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={avatarUrl(user.profile || user.image || "default", 150)}
                  alt={user.name || user.displayName}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-neutral-100"
                />
                <span className="text-sm font-bold text-neutral-700 tracking-wide">
                  {user.name || user.displayName || user.username}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUnblock(member._id || user._id)}
                className="h-8 text-xs font-semibold px-3 rounded-lg border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900 text-neutral-600 flex items-center gap-1.5"
              >
                <Ban className="w-3.5 h-3.5" />
                {t.deleted.unblock}
              </Button>
            </div>
          )
        })
        ) : (
          <div className="text-center py-12 text-sm text-neutral-400">
            {t.deleted.empty}
          </div>
        )}
      </div>
    </div>
  );
}
