import { RefreshCw } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { User } from "@/lib/types";
import { ProfileHoverCard } from "./ProfileHoverCard";

interface RightSidebarProps {
  lang: Locale;
  dict: Dictionary;
  suggestions: User[];
}

export function RightSidebar({ lang, dict, suggestions }: RightSidebarProps) {
  return (
    <aside className="space-y-3 max-h-[calc(100vh-90px)] overflow-auto scrollbar-hide pb-8">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold tracking-wider text-foreground">
          {dict.myHome.youMightLike}
        </h3>
        <button
          type="button"
          aria-label="Refresh suggestions"
          className="rounded-full p-1.5 text-muted-foreground hover:bg-muted transition-colors"
        >
          <RefreshCw className="size-3.5" />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {suggestions.map((user) => (
          <ProfileHoverCard key={user.id} user={user} lang={lang} dict={dict} />
        ))}
      </div>
    </aside>
  );
}
