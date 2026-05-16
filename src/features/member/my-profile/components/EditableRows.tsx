"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

export type FieldValue = string | number;
export type FieldValues = Record<string, FieldValue>;

export type FieldDef =
  | {
      key: string;
      label: string;
      type: "text";
      placeholder?: string;
      emptyLabel?: string;
    }
  | {
      key: string;
      label: string;
      type: "select";
      options: string[];
      emptyLabel?: string;
    }
  | {
      key: string;
      label: string;
      type: "yesno";
      emptyLabel?: string;
    }
  | {
      key: string;
      label: string;
      type: "range";
      minKey: string;
      maxKey: string;
      min: number;
      max: number;
    };

interface EditableRowsProps {
  id?: string;
  title: string;
  fields: FieldDef[];
  values: FieldValues;
  onSave: (next: FieldValues) => void;
}

export function EditableRows({
  id,
  title,
  fields,
  values,
  onSave,
}: EditableRowsProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<FieldValues>(values);

  useEffect(() => {
    if (!editing) setDraft(values);
  }, [editing, values]);

  const setDraftValue = (key: string, value: FieldValue) => {
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const handleSave = () => {
    onSave(draft);
    setEditing(false);
  };

  return (
    <section id={id} className="space-y-3 py-5">
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

      <dl className="space-y-2 text-sm">
        {fields.map((field) => (
          <div
            key={field.key}
            className="grid grid-cols-[10rem_minmax(0,1fr)] gap-3 items-start"
          >
            <dt className="text-foreground">{field.label}:</dt>
            <dd>
              {editing ? (
                <FieldEditor
                  field={field}
                  values={draft}
                  setValue={setDraftValue}
                />
              ) : (
                <FieldReadView field={field} values={values} />
              )}
            </dd>
          </div>
        ))}
      </dl>

      {editing ? (
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => setEditing(false)}
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
      ) : null}
    </section>
  );
}

function FieldReadView({
  field,
  values,
}: {
  field: FieldDef;
  values: FieldValues;
}) {
  if (field.type === "range") {
    return (
      <span className="text-foreground">
        {values[field.minKey]} - {values[field.maxKey]}
      </span>
    );
  }

  const raw = values[field.key];
  const value = raw === undefined || raw === null ? "" : String(raw);
  if (value) {
    return <span className="text-foreground">{value}</span>;
  }
  const empty = "emptyLabel" in field && field.emptyLabel ? field.emptyLabel : "Select";
  return (
    <span className="cursor-default text-brand underline underline-offset-2">
      {empty}
    </span>
  );
}

function FieldEditor({
  field,
  values,
  setValue,
}: {
  field: FieldDef;
  values: FieldValues;
  setValue: (key: string, value: FieldValue) => void;
}) {
  if (field.type === "text") {
    return (
      <input
        type="text"
        value={String(values[field.key] ?? "")}
        onChange={(e) => setValue(field.key, e.target.value)}
        placeholder={field.placeholder}
        className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm outline-none focus:border-brand"
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        value={String(values[field.key] ?? "")}
        onChange={(e) => setValue(field.key, e.target.value)}
        className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm outline-none focus:border-brand"
      >
        <option value="">Select</option>
        {field.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "yesno") {
    const current = String(values[field.key] ?? "");
    return (
      <div className="flex gap-2">
        {["Yes", "No"].map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setValue(field.key, opt)}
            className={cn(
              "rounded-md border px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
              current === opt
                ? "border-brand bg-brand text-white"
                : "border-input bg-background text-foreground hover:bg-muted"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  }

  // range
  const min = Number(values[field.minKey] ?? field.min);
  const max = Number(values[field.maxKey] ?? field.max);
  return (
    <div className="space-y-2">
      <Slider
        min={field.min}
        max={field.max}
        step={1}
        value={[min, max]}
        onValueChange={(v) => {
          setValue(field.minKey, v[0]);
          setValue(field.maxKey, v[1]);
        }}
      />
      <p className="text-xs text-muted-foreground">
        {min} - {max}
      </p>
    </div>
  );
}
