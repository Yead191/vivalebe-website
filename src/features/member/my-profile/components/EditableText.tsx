"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  id?: string;
  title: string;
  placeholder?: string;
  value: string;
  onSave: (next: string) => void;
  maxLength?: number;
}

export function EditableText({
  id,
  title,
  placeholder,
  value,
  onSave,
  maxLength = 2000,
}: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [editing, value]);

  const handleSave = () => {
    onSave(draft.trim());
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
  };

  return (
    <section id={id} className="space-y-2 py-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label={`Edit ${title}`}
            className="text-muted-foreground hover:text-brand transition-colors cursor-pointer"
          >
            <Pencil className="size-4" />
          </button>
        ) : null}
      </div>

      {!editing ? (
        <p
          className={cn(
            "text-sm leading-relaxed",
            value ? "text-foreground" : "text-muted-foreground italic"
          )}
        >
          {value || placeholder || "Add details about yourself."}
        </p>
      ) : (
        <div className="space-y-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, maxLength))}
            placeholder={placeholder}
            rows={4}
            className="w-full rounded-md border border-border bg-background p-3 text-sm outline-none focus:border-brand"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {draft.length}/{maxLength.toLocaleString()}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-hover transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
