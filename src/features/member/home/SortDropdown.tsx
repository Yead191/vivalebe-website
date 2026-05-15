"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { FeedSort } from "@/lib/types";

interface SortDropdownProps {
  value: FeedSort;
  onChange: (v: FeedSort) => void;
  dict: Dictionary;
}

export function SortDropdown({ value, onChange, dict }: SortDropdownProps) {
  const label = value === "newest" ? dict.myHome.feedNewest : dict.myHome.feedPopular;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <span>{dict.myHome.feedShow}</span>
        <span className="font-medium text-foreground">{label}</span>
        <ChevronDown className="size-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuItem onClick={() => onChange("newest")}>
          {dict.myHome.feedNewest}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange("popular")}>
          {dict.myHome.feedPopular}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
