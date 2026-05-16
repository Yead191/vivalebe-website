"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Camera, Check, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  id: string;
  label: string;
}

interface ProfileSidebarProps {
  avatarUrl: string;
  displayName: string;
  age: number;
  navItems: NavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  onAvatarChange: (url: string) => void;
  onDisplayNameSave: (next: string) => void;
}

export function ProfileSidebar({
  avatarUrl,
  displayName,
  age,
  navItems,
  activeId,
  onNavigate,
  onAvatarChange,
  onDisplayNameSave,
}: ProfileSidebarProps) {
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(displayName);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editingName) setDraftName(displayName);
  }, [editingName, displayName]);

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onAvatarChange(url);
    e.target.value = "";
  };

  const saveName = () => {
    const trimmed = draftName.trim();
    if (trimmed) onDisplayNameSave(trimmed);
    setEditingName(false);
  };

  return (
    <aside className="space-y-4">
      <div className="group relative aspect-square w-full overflow-hidden bg-muted">
        <Image
          src={avatarUrl}
          alt={displayName}
          fill
          className="object-cover"
          unoptimized
        />
        <button
          type="button"
          onClick={() => avatarInputRef.current?.click()}
          className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-1.5 bg-black/55 py-2 text-xs font-semibold uppercase tracking-wider text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
        >
          <Camera className="size-4" />
          Add photo
        </button>
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarFile}
        />
      </div>

      <div className="flex items-center gap-2">
        {editingName ? (
          <>
            <input
              autoFocus
              value={draftName}
              onChange={(e) => setDraftName(e.target.value.slice(0, 24))}
              className="min-w-0 flex-1 rounded-md border border-border bg-background px-2 py-1 text-sm font-semibold uppercase tracking-wider outline-none focus:border-brand"
            />
            <button
              type="button"
              onClick={saveName}
              aria-label="Save name"
              className="text-brand hover:opacity-80 cursor-pointer"
            >
              <Check className="size-4" />
            </button>
          </>
        ) : (
          <>
            <span className="text-sm font-semibold uppercase tracking-wider">
              {displayName}, {age}
            </span>
            <button
              type="button"
              onClick={() => setEditingName(true)}
              aria-label="Edit name"
              className="text-muted-foreground hover:text-brand transition-colors cursor-pointer"
            >
              <Pencil className="size-3.5" />
            </button>
          </>
        )}
      </div>

      <a
        href="#verify"
        className="block text-sm font-semibold uppercase tracking-wider text-brand underline underline-offset-4 hover:opacity-80"
      >
        Verify my photo
      </a>

      <nav className="flex flex-col gap-3 pt-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={cn(
              "text-left text-sm font-semibold uppercase tracking-wider transition-colors cursor-pointer",
              activeId === item.id
                ? "text-foreground underline underline-offset-4"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
