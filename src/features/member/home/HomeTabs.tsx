"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Sparkles, Heart, Loader2 } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type {
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
import { getFeed, type PostMeta } from "./action";
import { parseHomeTab, type HomeTab } from "./tabs";

export type { PostMeta, HomeTab };
export { parseHomeTab };

const PAGE_LIMIT = 20;

interface HomeTabsProps {
  lang: Locale;
  dict: Dictionary;
  activeTab?: HomeTab;
  videos: VideoPost[];
  videoMeta: Record<string, PostMeta>;
  videoHasNextPage?: boolean;
  moments: MomentPost[];
  momentMeta: Record<string, PostMeta>;
  momentHasNextPage?: boolean;
  connections: ConnectionEvent[];
  authors: Record<string, User>;
  currentUserAvatarSeed: string;
}

function sortByDate<T extends { createdAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

function sortByPopularity<T extends { id: string }>(
  items: T[],
  meta: Record<string, PostMeta>,
): T[] {
  return [...items].sort(
    (a, b) => (meta[b.id]?.popularity ?? 0) - (meta[a.id]?.popularity ?? 0),
  );
}

function mergeById<T extends { id: string }>(existing: T[], incoming: T[]): T[] {
  const seen = new Set(existing.map((item) => item.id));
  const next = [...existing];
  for (const item of incoming) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    next.push(item);
  }
  return next;
}

export function HomeTabs({
  lang,
  dict,
  activeTab = "videos",
  videos: initialVideos,
  videoMeta: initialVideoMeta,
  videoHasNextPage: initialVideoHasNext = false,
  moments: initialMoments,
  momentMeta: initialMomentMeta,
  momentHasNextPage: initialMomentHasNext = false,
  connections,
  authors: initialAuthors,
  currentUserAvatarSeed,
}: HomeTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [videoSort, setVideoSort] = useState<FeedSort>("newest");
  const [momentSort, setMomentSort] = useState<FeedSort>("popular");

  const [videos, setVideos] = useState(initialVideos);
  const [videoMeta, setVideoMeta] = useState(initialVideoMeta);
  const [videoPage, setVideoPage] = useState(1);
  const [videoHasNext, setVideoHasNext] = useState(initialVideoHasNext);
  const [loadingVideos, setLoadingVideos] = useState(false);

  const [moments, setMoments] = useState(initialMoments);
  const [momentMeta, setMomentMeta] = useState(initialMomentMeta);
  const [momentPage, setMomentPage] = useState(1);
  const [momentHasNext, setMomentHasNext] = useState(initialMomentHasNext);
  const [loadingMoments, setLoadingMoments] = useState(false);

  const [authors, setAuthors] = useState(initialAuthors);

  const videoSentinelRef = useRef<HTMLDivElement | null>(null);
  const momentSentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingVideosRef = useRef(false);
  const loadingMomentsRef = useRef(false);

  useEffect(() => {
    setVideos(initialVideos);
    setVideoMeta(initialVideoMeta);
    setVideoPage(1);
    setVideoHasNext(initialVideoHasNext);
  }, [initialVideos, initialVideoMeta, initialVideoHasNext]);

  useEffect(() => {
    setMoments(initialMoments);
    setMomentMeta(initialMomentMeta);
    setMomentPage(1);
    setMomentHasNext(initialMomentHasNext);
  }, [initialMoments, initialMomentMeta, initialMomentHasNext]);

  useEffect(() => {
    setAuthors((prev) => ({ ...prev, ...initialAuthors }));
  }, [initialAuthors]);

  const loadMoreVideos = useCallback(async () => {
    if (loadingVideosRef.current || !videoHasNext) return;
    loadingVideosRef.current = true;
    setLoadingVideos(true);
    try {
      const nextPage = videoPage + 1;
      const res = await getFeed("VIDEO", nextPage, PAGE_LIMIT);
      setVideos((prev) => mergeById(prev, res.videos));
      setVideoMeta((prev) => ({ ...prev, ...res.videoMeta }));
      setAuthors((prev) => ({ ...prev, ...res.authors }));
      setVideoPage(res.pagination.page);
      setVideoHasNext(res.pagination.hasNextPage);
    } finally {
      loadingVideosRef.current = false;
      setLoadingVideos(false);
    }
  }, [videoHasNext, videoPage]);

  const loadMoreMoments = useCallback(async () => {
    if (loadingMomentsRef.current || !momentHasNext) return;
    loadingMomentsRef.current = true;
    setLoadingMoments(true);
    try {
      const nextPage = momentPage + 1;
      const res = await getFeed("IMAGE", nextPage, PAGE_LIMIT);
      setMoments((prev) => mergeById(prev, res.moments));
      setMomentMeta((prev) => ({ ...prev, ...res.momentMeta }));
      setAuthors((prev) => ({ ...prev, ...res.authors }));
      setMomentPage(res.pagination.page);
      setMomentHasNext(res.pagination.hasNextPage);
    } finally {
      loadingMomentsRef.current = false;
      setLoadingMoments(false);
    }
  }, [momentHasNext, momentPage]);

  useEffect(() => {
    if (activeTab !== "videos" || !videoHasNext) return;
    const node = videoSentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMoreVideos();
      },
      { rootMargin: "240px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [activeTab, videoHasNext, loadMoreVideos]);

  useEffect(() => {
    if (activeTab !== "moments" || !momentHasNext) return;
    const node = momentSentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMoreMoments();
      },
      { rootMargin: "240px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [activeTab, momentHasNext, loadMoreMoments]);

  const sortedVideos = useMemo(
    () =>
      videoSort === "newest"
        ? sortByDate(videos)
        : sortByPopularity(videos, videoMeta),
    [videos, videoMeta, videoSort],
  );

  const sortedMoments = useMemo(
    () =>
      momentSort === "newest"
        ? sortByDate(moments)
        : sortByPopularity(moments, momentMeta),
    [moments, momentMeta, momentSort],
  );

  const authorMini: Record<
    string,
    { displayName: string; avatarSeed: string }
  > = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(authors).map(([id, u]) => [
          id,
          { displayName: u.displayName, avatarSeed: u.avatarSeed },
        ]),
      ),
    [authors],
  );

  const onTabChange = (value: string) => {
    const tab = parseHomeTab(value);
    router.replace(`${pathname}?tab=${tab}`, { scroll: false });
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid h-14 w-full grid-cols-3 gap-1 rounded-[20px] bg-muted/40 p-1.5">
        <TabsTrigger
          value="videos"
          className="group flex items-center justify-center gap-2 rounded-[14px] py-2 transition-all duration-300 hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-brand data-[state=active]:shadow-sm"
        >
          <Video className="h-4 w-4 shrink-0 transition-transform duration-300 group-data-[state=active]:scale-110" />
          <span className="text-[11px] font-bold uppercase tracking-wider sm:text-xs">
            {dict.myHome.tabVideos}
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="moments"
          className="group flex items-center justify-center gap-2 rounded-[14px] py-2 transition-all duration-300 hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-brand data-[state=active]:shadow-sm"
        >
          <Sparkles className="h-4 w-4 shrink-0 transition-transform duration-300 group-data-[state=active]:scale-110" />
          <span className="text-[11px] font-bold uppercase tracking-wider sm:text-xs">
            {dict.myHome.tabMoments}
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="connections"
          className="group flex items-center justify-center gap-2 rounded-[14px] py-2 transition-all duration-300 hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-brand data-[state=active]:shadow-sm"
        >
          <Heart className="h-4 w-4 shrink-0 transition-transform duration-300 group-data-[state=active]:scale-110" />
          <span className="text-[11px] font-bold uppercase tracking-wider sm:text-xs">
            {dict.myHome.tabConnections}
          </span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="videos" className="space-y-4 pt-4">
        <div className="px-1">
          <UploadVideoModal dict={dict} />
        </div>
        <div className="flex items-center justify-between px-1">
          <span />
          <SortDropdown value={videoSort} onChange={setVideoSort} dict={dict} />
        </div>
        <div className="space-y-4">
          {sortedVideos.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              No videos in your feed yet.
            </p>
          ) : (
            sortedVideos.map((v) => {
              const author = authors[v.authorId];
              const meta = videoMeta[v.id] ?? {
                likeCount: 0,
                liked: false,
                comments: [],
                commentCount: 0,
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
                  commentCount={meta.commentCount}
                  authors={authorMini}
                  currentUserAvatarSeed={currentUserAvatarSeed}
                />
              ) : null;
            })
          )}
          {videoHasNext ? (
            <div
              ref={videoSentinelRef}
              className="flex items-center justify-center py-4"
            >
              {loadingVideos ? (
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              ) : null}
            </div>
          ) : null}
        </div>
      </TabsContent>

      <TabsContent value="moments" className="space-y-4 pt-4">
        <div className="px-1">
          <CreatePostModal dict={dict} />
        </div>
        <div className="flex items-center justify-between px-1">
          <span />
          <SortDropdown
            value={momentSort}
            onChange={setMomentSort}
            dict={dict}
          />
        </div>
        <div className="space-y-4">
          {sortedMoments.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              No moments in your feed yet.
            </p>
          ) : (
            sortedMoments.map((m) => {
              const author = authors[m.authorId];
              const meta = momentMeta[m.id] ?? {
                likeCount: 0,
                liked: false,
                comments: [],
                commentCount: 0,
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
                  commentCount={meta.commentCount}
                  authors={authorMini}
                  currentUserAvatarSeed={currentUserAvatarSeed}
                />
              ) : null;
            })
          )}
          {momentHasNext ? (
            <div
              ref={momentSentinelRef}
              className="flex items-center justify-center py-4"
            >
              {loadingMoments ? (
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              ) : null}
            </div>
          ) : null}
        </div>
      </TabsContent>

      <TabsContent value="connections" className="pt-4">
        <div className="space-y-1 rounded-xl border border-border bg-card p-2">
          {connections.map((c) => {
            const user = authors[c.userId];
            return user ? (
              <ConnectionRow
                key={c.id}
                lang={lang}
                dict={dict}
                event={c}
                user={user}
              />
            ) : null;
          })}
        </div>
      </TabsContent>
    </Tabs>
  );
}
