"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

interface Props {
  lang: Locale;
  dict: Dictionary;
  initialQuery: string;
}

export function UsernameSearchForm({ lang, dict, initialQuery }: Props) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ from: "username" });
    if (q.trim()) params.set("q", q.trim());
    router.push(`/${lang}/discover?${params.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="flex items-stretch gap-0">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={dict.discover.placeholderUsername}
          className="w-full rounded-l-md border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand"
        />
      </div>
      <button
        type="submit"
        className="rounded-r-md bg-muted-foreground/80 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-foreground transition-colors"
      >
        {dict.discover.search}
      </button>
    </form>
  );
}
