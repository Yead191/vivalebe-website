"use client";

import Image from "next/image";
import { Heart, MessageCircle, Smile } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/i18n/dictionaries";
import type { User } from "@/lib/types";
import { photoUrl } from "@/lib/image";

const sections = [
  { id: "summary", labelKey: "navSummary" as const },
  { id: "more-about-me", labelKey: "navMoreAboutMe" as const },
  { id: "moments", labelKey: "navMoments" as const },
  { id: "personal-blogs", labelKey: "navPersonalBlogs" as const },
  { id: "private-note", labelKey: "navAddPrivateNote" as const },
];

interface Props {
  dict: Dictionary;
  user: User;
}

export function ProfileSidebar({ dict, user }: Props) {
  const [active, setActive] = useState<string>("summary");

  useEffect(() => {
    const handler = () => {
      let current = sections[0].id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 120) current = s.id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside className="space-y-5">
      <div className="overflow-hidden rounded-xl bg-muted">
        <Image
          src={photoUrl(user.coverSeed, 480, 600)}
          alt={user.displayName}
          width={480}
          height={600}
          className="aspect-4/5 w-full object-cover"
          unoptimized
        />
      </div>

      <div className="flex items-center gap-5 px-1 text-muted-foreground">
        <button type="button" aria-label="Wink" className="hover:text-brand transition-colors">
          <Smile className="size-5" />
        </button>
        <button type="button" aria-label="Like" className="hover:text-brand transition-colors">
          <Heart className="size-5" />
        </button>
        <button type="button" aria-label="Message" className="hover:text-brand transition-colors">
          <MessageCircle className="size-5" />
        </button>
      </div>

      <nav className="space-y-3 px-1 pt-2 text-xs font-semibold tracking-wider">
        {sections.map((s) => (
          <button
            type="button"
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={cn(
              "block text-left transition-colors",
              active === s.id
                ? "text-foreground underline underline-offset-4"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {dict.profile[s.labelKey]}
          </button>
        ))}
      </nav>
    </aside>
  );
}
