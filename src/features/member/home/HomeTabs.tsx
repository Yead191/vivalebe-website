"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type {
  Comment,
  ConnectionEvent,
  FeedSort,
  MomentPost,
  User,
  VideoPost,
} from "@/lib/types";
import { VideoCard } from "./cards/VideoCard";
import { MomentCard } from "./cards/MomentCard";
import { ConnectionRow } from "./cards/ConnectionRow";
import { SortDropdown } from "./SortDropdown";
import { UploadVideoModal } from "./modals/UploadVideoModal";
import { CreatePostModal } from "./modals/CreatePostModal";

export interface PostMeta {
  likeCount: number;
  liked: boolean;
  comments: Comment[];
  popularity: number;
}

interface HomeTabsProps {
  lang: Locale;
  dict: Dictionary;
  videos: VideoPost[];
  videoMeta: Record<string, PostMeta>;
  moments: MomentPost[];
  momentMeta: Record<string, PostMeta>;
  connections: ConnectionEvent[];
  authors: Record<string, User>;
  currentUserAvatarSeed: string;
}

function sortByDate<T extends { createdAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

function sortByPopularity<T extends { id: string }>(
  items: T[],
  meta: Record<string, PostMeta>
): T[] {
  return [...items].sort(
    (a, b) => (meta[b.id]?.popularity ?? 0) - (meta[a.id]?.popularity ?? 0)
  );
}

export function HomeTabs({
  lang,
  dict,
  videos,
  videoMeta,
  moments,
  momentMeta,
  connections,
  authors,
  currentUserAvatarSeed,
}: HomeTabsProps) {
  const [videoSort, setVideoSort] = useState<FeedSort>("newest");
  const [momentSort, setMomentSort] = useState<FeedSort>("popular");

  const sortedVideos = useMemo(
    () =>
      videoSort === "newest"
        ? sortByDate(videos)
        : sortByPopularity(videos, videoMeta),
    [videos, videoMeta, videoSort]
  );

  const sortedMoments = useMemo(
    () =>
      momentSort === "newest"
        ? sortByDate(moments)
        : sortByPopularity(moments, momentMeta),
    [moments, momentMeta, momentSort]
  );

  const authorMini: Record<string, { displayName: string; avatarSeed: string }> =
    useMemo(
      () =>
        Object.fromEntries(
          Object.entries(authors).map(([id, u]) => [
            id,
            { displayName: u.displayName, avatarSeed: u.avatarSeed },
          ])
        ),
      [authors]
    );

  return (
    <Tabs defaultValue="videos" className="w-full">
      <TabsList className="grid w-full grid-cols-3 rounded-none border-b border-border bg-transparent p-0">
        <TabsTrigger
          value="videos"
          className="rounded-none border-b-2 border-transparent bg-transparent py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground data-[state=active]:border-brand data-[state=active]:text-foreground data-[state=active]:shadow-none"
        >
          {dict.myHome.tabVideos}
        </TabsTrigger>
        <TabsTrigger
          value="moments"
          className="rounded-none border-b-2 border-transparent bg-transparent py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground data-[state=active]:border-brand data-[state=active]:text-foreground data-[state=active]:shadow-none"
        >
          {dict.myHome.tabMoments}
        </TabsTrigger>
        <TabsTrigger
          value="connections"
          className="rounded-none border-b-2 border-transparent bg-transparent py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground data-[state=active]:border-brand data-[state=active]:text-foreground data-[state=active]:shadow-none"
        >
          {dict.myHome.tabConnections}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="videos" className="space-y-4 pt-4">
        <div className="flex items-center justify-between px-1">
          <UploadVideoModal dict={dict} />
          <SortDropdown value={videoSort} onChange={setVideoSort} dict={dict} />
        </div>
        <div className="space-y-4">
          {sortedVideos.map((v) => {
            const author = authors[v.authorId];
            const meta = videoMeta[v.id] ?? {
              likeCount: 0,
              liked: false,
              comments: [],
              popularity: 0,
            };
            return author ? (
              <VideoCard
                key={v.id}
                lang={lang}
                dict={dict}
                video={v}
                author={author}
                likeCount={meta.likeCount}
                liked={meta.liked}
                comments={meta.comments}
                authors={authorMini}
                currentUserAvatarSeed={currentUserAvatarSeed}
              />
            ) : null;
          })}
        </div>
      </TabsContent>

      <TabsContent value="moments" className="space-y-4 pt-4">
        <div className="px-1">
          <CreatePostModal dict={dict} />
        </div>
        <div className="flex items-center justify-between px-1">
          <span />
          <SortDropdown value={momentSort} onChange={setMomentSort} dict={dict} />
        </div>
        <div className="space-y-4">
          {sortedMoments.map((m) => {
            const author = authors[m.authorId];
            const meta = momentMeta[m.id] ?? {
              likeCount: 0,
              liked: false,
              comments: [],
              popularity: 0,
            };
            return author ? (
              <MomentCard
                key={m.id}
                lang={lang}
                dict={dict}
                moment={m}
                author={author}
                likeCount={meta.likeCount}
                liked={meta.liked}
                comments={meta.comments}
                authors={authorMini}
                currentUserAvatarSeed={currentUserAvatarSeed}
              />
            ) : null;
          })}
        </div>
      </TabsContent>

      <TabsContent value="connections" className="pt-4">
        <div className="space-y-1 rounded-xl border border-border bg-card p-2">
          {connections.map((c) => {
            const user = authors[c.userId];
            return user ? (
              <ConnectionRow key={c.id} lang={lang} dict={dict} event={c} user={user} />
            ) : null;
          })}
        </div>
      </TabsContent>
    </Tabs>
  );
}
