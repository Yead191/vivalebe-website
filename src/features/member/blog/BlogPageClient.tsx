"use client";

import { useState, useMemo, useTransition } from "react";
import { ChevronDown, Loader2, PenLine } from "lucide-react";
import { toast } from "sonner";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { BlogPost, Comment, User } from "@/lib/types";
import { BlogCard } from "./components/BlogCard";
import { BlogSidebar, type BlogTab } from "./components/BlogSidebar";
import { PostBlogModal } from "./components/PostBlogModal";
import { getMyBlogsAction } from "./actions";

type SortMode = "newest" | "popular";

interface BlogPageClientProps {
  lang: Locale;
  dict: Dictionary;
  blogs: BlogPost[];
  authorsMap: Record<string, User>;
  authorInfoMap: Record<string, { displayName: string; avatarSeed: string }>;
  likeMetaMap: Record<string, { count: number; liked: boolean }>;
  commentMap: Record<string, Comment[]>;
  commentCountMap?: Record<string, number>;
  currentUserAvatarSeed: string;
  currentUserId: string;
  recentBlogs: Pick<BlogPost, "id" | "title">[];
  totalBlogs: number;
}

export function BlogPageClient({
  lang,
  dict,
  blogs,
  authorsMap,
  authorInfoMap,
  likeMetaMap,
  commentMap,
  commentCountMap = {},
  currentUserAvatarSeed,
  currentUserId,
  recentBlogs,
  totalBlogs,
}: BlogPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [activeTab, setActiveTab] = useState<BlogTab>("all");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [myBlogs, setMyBlogs] = useState<BlogPost[] | null>(null);
  const [myAuthorsMap, setMyAuthorsMap] = useState<Record<string, User>>({});
  const [myAuthorInfoMap, setMyAuthorInfoMap] = useState<
    Record<string, { displayName: string; avatarSeed: string }>
  >({});
  const [myLikeMetaMap, setMyLikeMetaMap] = useState<
    Record<string, { count: number; liked: boolean }>
  >({});
  const [myCommentMap, setMyCommentMap] = useState<Record<string, Comment[]>>(
    {},
  );
  const [myCommentCountMap, setMyCommentCountMap] = useState<
    Record<string, number>
  >({});

  const activeBlogs = activeTab === "my" && myBlogs ? myBlogs : blogs;
  const activeAuthorsMap =
    activeTab === "my" && myBlogs
      ? { ...authorsMap, ...myAuthorsMap }
      : authorsMap;
  const activeAuthorInfoMap =
    activeTab === "my" && myBlogs
      ? { ...authorInfoMap, ...myAuthorInfoMap }
      : authorInfoMap;
  const activeLikeMetaMap =
    activeTab === "my" && myBlogs
      ? { ...likeMetaMap, ...myLikeMetaMap }
      : likeMetaMap;
  const activeCommentMap =
    activeTab === "my" && myBlogs
      ? { ...commentMap, ...myCommentMap }
      : commentMap;
  const activeCommentCountMap =
    activeTab === "my" && myBlogs
      ? { ...commentCountMap, ...myCommentCountMap }
      : commentCountMap;

  const handleTabChange = (tab: BlogTab) => {
    setActiveTab(tab);

    if (tab !== "my") return;

    startTransition(async () => {
      const res = await getMyBlogsAction();
      if (!res.success) {
        toast.error(res.message ?? "Failed to load my blogs");
        return;
      }
      setMyBlogs(res.blogs);
      setMyAuthorsMap(res.authorsMap);
      setMyAuthorInfoMap(res.authorInfoMap);
      setMyLikeMetaMap(res.likeMetaMap);
      setMyCommentMap(res.commentMap);
      setMyCommentCountMap(res.commentCountMap);
    });
  };

  const visibleBlogs = useMemo(() => {
    let list = [...activeBlogs];

    if (activeTab === "liked") {
      list = list.filter((b) => activeLikeMetaMap[b.id]?.liked);
    } else if (activeTab === "commented") {
      list = list.filter((b) =>
        (activeCommentMap[b.id] ?? []).some((c) => c.authorId === currentUserId),
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((b) => {
        const author = activeAuthorsMap[b.authorId];
        return (
          b.title.toLowerCase().includes(q) ||
          (author?.displayName.toLowerCase().includes(q) ?? false)
        );
      });
    }

    if (sortMode === "newest") {
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else {
      list.sort((a, b) => {
        const scoreA =
          (activeLikeMetaMap[a.id]?.count ?? 0) * 2 +
          (activeCommentCountMap[a.id] ?? activeCommentMap[a.id]?.length ?? 0);
        const scoreB =
          (activeLikeMetaMap[b.id]?.count ?? 0) * 2 +
          (activeCommentCountMap[b.id] ?? activeCommentMap[b.id]?.length ?? 0);
        return scoreB - scoreA;
      });
    }

    return list;
  }, [
    activeBlogs,
    activeTab,
    searchQuery,
    sortMode,
    currentUserId,
    activeLikeMetaMap,
    activeCommentMap,
    activeCommentCountMap,
    activeAuthorsMap,
  ]);

  const displayedTotal =
    activeTab === "my" && myBlogs ? myBlogs.length : totalBlogs;

  return (
    <div className="container py-6">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5 min-w-0">
          <div>
            <h1 className="text-xs font-bold tracking-widest text-foreground uppercase">
              {dict.blog.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {dict.blog.description}
            </p>
            <button
              type="button"
              onClick={() => setIsPostModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand/90 transition-colors"
            >
              <PenLine className="size-3.5" />
              {dict.blog.postBlog}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {dict.blog.totalBlogs}{" "}
              <span className="font-semibold text-foreground">
                {displayedTotal.toLocaleString()}
              </span>
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-muted-foreground">
                {dict.blog.show}
              </span>
              <button
                type="button"
                onClick={() =>
                  setSortMode((m) => (m === "newest" ? "popular" : "newest"))
                }
                className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-brand transition-colors"
              >
                {sortMode === "newest" ? dict.blog.newest : dict.blog.popular}
                <ChevronDown className="size-4" />
              </button>
            </div>
          </div>

          {activeTab === "my" && isPending && !myBlogs ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : visibleBlogs.length > 0 ? (
            <div className="space-y-4">
              {visibleBlogs.map((blog) => {
                const author = activeAuthorsMap[blog.authorId];
                if (!author) return null;
                return (
                  <BlogCard
                    key={blog.id}
                    lang={lang}
                    dict={dict}
                    blog={blog}
                    author={author}
                    likeCount={activeLikeMetaMap[blog.id]?.count ?? 0}
                    liked={activeLikeMetaMap[blog.id]?.liked ?? false}
                    comments={activeCommentMap[blog.id] ?? []}
                    commentCount={activeCommentCountMap[blog.id]}
                    authors={activeAuthorInfoMap}
                    currentUserAvatarSeed={currentUserAvatarSeed}
                  />
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">
              {dict.blog.notFound}
            </p>
          )}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-22">
            <BlogSidebar
              lang={lang}
              dict={dict}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              recentBlogs={recentBlogs}
            />
          </div>
        </div>
      </div>

      <PostBlogModal
        open={isPostModalOpen}
        onOpenChange={setIsPostModalOpen}
        dict={dict}
      />
    </div>
  );
}
