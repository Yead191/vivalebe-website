"use client";

import { useMemo, useState, useTransition } from "react";
import { CalendarDays, Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createEvent, deleteEvent, updateEvent } from "./action";
import type { EventFormValues, MemberEvent } from "./types";

const DEFAULT_VALUES: EventFormValues = {
  eventName: "",
  type: "meeting",
  startDate: "",
  endDate: "",
  startTime: "",
  details: "",
  price: "",
  visibility: "public",
  status: "upcoming",
  guestUserIds: "",
};

function toDateInput(value: string) {
  if (!value) return "";
  return value.slice(0, 10);
}

function toDateTimeInput(dateValue: string, timeValue: string) {
  const source = timeValue || dateValue;
  if (!source) return "";
  return source.slice(0, 16);
}

function toFormValues(event?: MemberEvent | null): EventFormValues {
  if (!event) return DEFAULT_VALUES;

  return {
    eventName: event.eventName,
    type: event.type || "meeting",
    startDate: toDateInput(event.startDate),
    endDate: toDateInput(event.endDate),
    startTime: toDateTimeInput(event.startDate, event.startTime),
    details: event.details,
    price: String(event.price ?? ""),
    visibility: event.visibility,
    status: event.status,
    guestUserIds: event.guests.map((guest) => guest.userId).join(", "),
  };
}

interface EventFormDialogProps {
  mode: "create" | "edit";
  event?: MemberEvent | null;
  triggerLabel?: string;
  onSuccess?: () => void;
  triggerVariant?: "default" | "outline" | "ghost";
}

export function EventFormDialog({
  mode,
  event,
  triggerLabel,
  onSuccess,
  triggerVariant = "outline",
}: EventFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState<EventFormValues>(toFormValues(event));

  const title = mode === "create" ? "Add Events & Parties" : "Edit event";
  const description =
    mode === "create"
      ? "Create a new event or party for the community."
      : "Update your event details, time, status, or visibility.";

  const computedTriggerLabel =
    triggerLabel ?? (mode === "create" ? "Add Events & Parties" : "Edit");

  const canSubmit = useMemo(() => {
    return (
      values.eventName.trim() &&
      values.type.trim() &&
      values.startDate &&
      values.endDate &&
      values.startTime &&
      values.details.trim()
    );
  }, [values]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setValues(toFormValues(event));
    }
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    startTransition(async () => {
      const res =
        mode === "create"
          ? await createEvent(values)
          : await updateEvent(event!.id, values);

      if (!res.success) {
        toast.error(res.message || "Failed to save event");
        return;
      }

      toast.success(
        res.message ||
          (mode === "create"
            ? "Event created successfully"
            : "Event updated successfully"),
      );
      setOpen(false);
      router.refresh();
      onSuccess?.();
    });
  };

  const handleDelete = async () => {
    if (!event) return;
    setRemoving(true);
    try {
      const res = await deleteEvent(event.id);
      if (!res.success) {
        toast.error(res.message || "Failed to delete event");
        return;
      }
      toast.success(res.message || "Event deleted successfully");
      setOpen(false);
      onSuccess?.();
    } finally {
      setRemoving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} >
      <DialogTrigger asChild>
        <Button variant={triggerVariant} className="gap-2">
          {mode === "create" ? <Plus className="size-4" /> : <CalendarDays className="size-4" />}
          {computedTriggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[min(90vh,820px)] w-[calc(100vw-4rem)] max-w-[680px] overflow-hidden border-none bg-transparent p-0 shadow-none sm:max-w-[780px]">
        <div className="flex h-full w-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-background shadow-2xl">
          <div className="bg-gradient-to-r from-brand/12 via-brand/5 to-transparent px-6 py-6 sm:px-8">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl font-semibold tracking-tight text-foreground">
                {title}
              </DialogTitle>
              <DialogDescription className="max-w-2xl text-sm leading-6 text-muted-foreground">
                {description}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 sm:px-8">
            <div className="grid gap-6">
              <section className="rounded-2xl border border-border/70 bg-muted/20 p-5">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                    Basic Information
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Set the event name, type, and who can see it.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="event-name">Event Name</Label>
                    <Input
                      id="event-name"
                      placeholder="e.g. Flutter Team Sprint Planning"
                      value={values.eventName}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, eventName: e.target.value }))
                      }
                      className="min-h-11 rounded-xl bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-type">Event Type</Label>
                    <Input
                      id="event-type"
                      placeholder="e.g. Meeting, Party, Music & Concert"
                      value={values.type}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, type: e.target.value }))
                      }
                      className="min-h-11 rounded-xl bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-visibility">Visibility</Label>
                    <Select
                      value={values.visibility}
                      onValueChange={(value) =>
                        setValues((prev) => ({
                          ...prev,
                          visibility: value as EventFormValues["visibility"],
                        }))
                      }
                    >
                      <SelectTrigger
                        id="event-visibility"
                        className="min-h-11 w-full rounded-xl bg-background"
                      >
                        <SelectValue placeholder="Choose event visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="event-price">Price (USD)</Label>
                    <Input
                      id="event-price"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="e.g. 500"
                      value={values.price}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, price: e.target.value }))
                      }
                      className="min-h-11 rounded-xl bg-background"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-border/70 bg-muted/20 p-5">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                    Schedule
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Add the date and time members should follow.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="event-start-date">Start Date</Label>
                    <Input
                      id="event-start-date"
                      type="date"
                      value={values.startDate}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, startDate: e.target.value }))
                      }
                      className="min-h-11 rounded-xl bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-end-date">End Date</Label>
                    <Input
                      id="event-end-date"
                      type="date"
                      value={values.endDate}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, endDate: e.target.value }))
                      }
                      className="min-h-11 rounded-xl bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-start-time">Start Time</Label>
                    <Input
                      id="event-start-time"
                      type="datetime-local"
                      value={values.startTime}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, startTime: e.target.value }))
                      }
                      className="min-h-11 rounded-xl bg-background"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-border/70 bg-muted/20 p-5">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                    Access & Guests
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Control the event status and invited guest IDs.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="event-status">Status</Label>
                    <Select
                      value={values.status}
                      onValueChange={(value) =>
                        setValues((prev) => ({
                          ...prev,
                          status: value as EventFormValues["status"],
                        }))
                      }
                    >
                      <SelectTrigger
                        id="event-status"
                        className="min-h-11 w-full rounded-xl bg-background"
                      >
                        <SelectValue placeholder="Choose event status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-guests">Guest User IDs</Label>
                    <Input
                      id="event-guests"
                      placeholder="e.g. 6a5814c43e5d063f403701b3, 6a5814c43e5d063f403701b4"
                      value={values.guestUserIds}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          guestUserIds: e.target.value,
                        }))
                      }
                      className="min-h-11 rounded-xl bg-background"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-border/70 bg-muted/20 p-5">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                    Description
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Share the plan, agenda, and important details for attendees.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-details">Event Details</Label>
                  <Textarea
                    id="event-details"
                    placeholder="Write the full event plan, meeting agenda, timing notes, and anything guests should know..."
                    className="min-h-40 rounded-2xl bg-background"
                    value={values.details}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, details: e.target.value }))
                    }
                  />
                </div>
              </section>
            </div>
          </div>
          <DialogFooter className="border-t border-border/70 bg-background px-6 py-4 sm:justify-between sm:px-8">
            <div>
              {mode === "edit" ? (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isPending || removing}
                  className="gap-2"
                >
                  <Trash2 className="size-4" />
                  Delete
                </Button>
              ) : null}
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isPending || removing}
              className="gap-2"
            >
              <Save className="size-4" />
              {isPending ? "Saving..." : mode === "create" ? "Create" : "Save changes"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
