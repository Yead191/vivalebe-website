"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { User } from "@/lib/types";
import { LeftSidebar } from "@/features/member/home/LeftSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventFormDialog } from "./EventFormDialog";
import { EventCard } from "./EventCard";
import type { MemberEvent } from "./types";

type SortOption = "nearest" | "newest" | "oldest";

function sortEvents(events: MemberEvent[], sort: SortOption) {
  return [...events].sort((a, b) => {
    const aDate = new Date(a.startDate).getTime();
    const bDate = new Date(b.startDate).getTime();

    if (sort === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sort === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return aDate - bDate;
  });
}

interface EventsPageClientProps {
  lang: Locale;
  dict: Dictionary;
  me: User;
  viewedCount: number;
  allEvents: MemberEvent[];
  myEvents: MemberEvent[];
}

export function EventsPageClient({
  lang,
  dict,
  me,
  viewedCount,
  allEvents,
  myEvents,
}: EventsPageClientProps) {
  const router = useRouter();
  const [sort, setSort] = useState<SortOption>("nearest");

  const sortedAllEvents = useMemo(() => sortEvents(allEvents, sort), [allEvents, sort]);
  const sortedMyEvents = useMemo(() => sortEvents(myEvents, sort), [myEvents, sort]);

  return (
    <div className="container py-6">
      <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <div>
          <div className="lg:sticky lg:top-22">
            <LeftSidebar lang={lang} dict={dict} me={me} viewedCount={viewedCount} />
          </div>
        </div>

        <div className="space-y-6">
          <header className="space-y-3 text-center">
            <h1 className="text-3xl font-semibold text-foreground">Events & Parties</h1>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
              Have something exciting planned? Create or join an event to bring
              people together.
            </p>
          </header>

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <EventFormDialog
              mode="create"
              onSuccess={() => router.refresh()}
              triggerLabel="Add Events & Parties"
            />

            <div className="flex items-center gap-2 self-end text-sm">
              <span className="text-muted-foreground">Sort by:</span>
              <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nearest">Nearest</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all" className="gap-5">
            <TabsList variant="line" className="w-full justify-start gap-6 rounded-none border-b border-border p-0">
              <TabsTrigger value="all" className="rounded-none px-0 pb-3 pt-0 text-sm">
                All Events & Parties
              </TabsTrigger>
              <TabsTrigger value="my" className="rounded-none px-0 pb-3 pt-0 text-sm">
                My Events & Parties
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {sortedAllEvents.length > 0 ? (
                sortedAllEvents.map((event) => (
                  <EventCard key={event.id} lang={lang} event={event} />
                ))
              ) : (
                <EmptyState message="No public events found right now." />
              )}
            </TabsContent>

            <TabsContent value="my" className="space-y-4">
              {sortedMyEvents.length > 0 ? (
                sortedMyEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    lang={lang}
                    event={event}
                    editable
                    onMutate={() => router.refresh()}
                  />
                ))
              ) : (
                <EmptyState message="You haven't created any events yet." />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
