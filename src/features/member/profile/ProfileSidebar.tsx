"use client";

import { ImageWithFallback as Image } from "@/components/shared/ImageWithFallback";
import { Heart, MessageCircle, Smile } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/i18n/dictionaries";
import type { User } from "@/lib/types";
import { photoUrl } from "@/lib/image";

import type { Locale } from "@/i18n/config";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  sendWink,
  acceptWink,
  createChatRoom,
  swipeUser,
} from "@/features/member/my-list/action";

const sections = [
  { id: "summary", labelKey: "navSummary" as const },
  { id: "more-about-me", labelKey: "navMoreAboutMe" as const },
  { id: "moments", labelKey: "navMoments" as const },
  { id: "personal-blogs", labelKey: "navPersonalBlogs" as const },
  // { id: "private-note", labelKey: "navAddPrivateNote" as const },
];

interface Props {
  lang: Locale;
  dict: Dictionary;
  user: User;
}

export function ProfileSidebar({ lang, dict, user }: Props) {
  const router = useRouter();
  const [active, setActive] = useState<string>("summary");
  const [winked, setWinked] = useState(user.isWinked || false);
  const [isSendingWink, setIsSendingWink] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [liked, setLiked] = useState(user.isLiked || false);
  const [isSwiping, setIsSwiping] = useState(false);

  useEffect(() => {
    setWinked(user.isWinked || false);
  }, [user.isWinked]);

  useEffect(() => {
    setLiked(user.isLiked || false);
  }, [user.isLiked]);

  const handleWinkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (winked) return;
    setIsSendingWink(true);
    try {
      let res;
      if (user.winkId) {
        res = await acceptWink(user.winkId);
      } else {
        res = await sendWink(user.id);
      }

      if (res.success) {
        setWinked(true);
        toast.success(res.message || "Wink sent successfully");
      } else {
        toast.error(res.message || "Failed to send wink");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSendingWink(false);
    }
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSwiping) return;
    setIsSwiping(true);

    const action = liked ? "dislike" : "like";
    setLiked(!liked);

    try {
      const res = await swipeUser(user.id, action);
      if (res.success) {
        toast.success(res.message || `User ${action}d successfully`);
      } else {
        setLiked(liked);
        toast.error(res.message || "Failed to swipe");
      }
    } catch (error) {
      setLiked(liked);
      toast.error("An error occurred");
    } finally {
      setIsSwiping(false);
    }
  };

  const handleChatClick = async () => {
    try {
      setIsCreatingChat(true);
      const res = await createChatRoom(user.id);
      if (res.success) {
        const roomId = res.data?._id || res.data?.id;
        if (roomId) {
          router.push(`/${lang}/chat/${roomId}`);
        } else {
          router.push(`/${lang}/chat`);
        }
      } else {
        console.error("Failed to create chat room", res);
        router.push(`/${lang}/chat`);
      }
    } catch (error) {
      console.error(error);
      router.push(`/${lang}/chat`);
    } finally {
      setIsCreatingChat(false);
    }
  };

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
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
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
        <button
          type="button"
          aria-label="Wink"
          onClick={handleWinkClick}
          disabled={isSendingWink || winked}
          className={cn(
            "transition-colors",
            isSendingWink && "opacity-50",
            winked ? "text-brand" : "text-muted-foreground hover:text-brand"
          )}
        >
          <Smile 
            className={cn(
              "size-5 transition-transform", 
              winked && "fill-current stroke-card scale-110"
            )} 
          />
        </button>
        <button
          type="button"
          aria-label="Like"
          onClick={handleLikeClick}
          disabled={isSwiping}
          className={cn(
            "transition-colors",
            isSwiping && "opacity-50",
            liked ? "text-red-500" : "text-muted-foreground hover:text-brand"
          )}
        >
          <Heart className={cn("size-5", liked && "fill-current")} />
        </button>
        <button
          type="button"
          aria-label="Message"
          onClick={handleChatClick}
          disabled={isCreatingChat}
          className="hover:text-brand transition-colors disabled:opacity-50"
        >
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
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {dict.profile[s.labelKey]}
          </button>
        ))}
      </nav>
    </aside>
  );
}
