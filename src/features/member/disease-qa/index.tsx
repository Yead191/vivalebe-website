"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { ReportContentModal } from "@/features/member/home/modals/ReportContentModal";
import { diseaseOptions, diseaseQaPosts } from "./data";
import type { DiseaseCategory, DiseasePost } from "./types";
import { AddDiseasePostDialog, PostHeader, brandButtonClass } from "./shared";

export default function DiseaseQnAFeature({ lang, dict }: { lang: Locale; dict: Dictionary }) {
    const [posts, setPosts] = useState(diseaseQaPosts);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<DiseaseCategory | "All">("All");
    const [openCreate, setOpenCreate] = useState(false);
    const [reportOpen, setReportOpen] = useState(false);

    const visiblePosts = useMemo(() => {
        return [...posts].filter((post) => {
            const matchSearch =
                post.title.toLowerCase().includes(search.toLowerCase()) ||
                post.body.toLowerCase().includes(search.toLowerCase()) ||
                post.disease.toLowerCase().includes(search.toLowerCase());
            const matchFilter = filter === "All" ? true : post.disease === filter;
            return matchSearch && matchFilter;
        });
    }, [posts, search, filter]);

    const createPost = (payload: { title: string; body: string; disease: DiseaseCategory; anonymous: boolean }) => {
        const next: DiseasePost = {
            id: `dq_${Date.now()}`,
            authorId: "u_lucas",
            createdAt: new Date().toISOString(),
            likesCount: 0,
            commentsCount: 0,
            comments: [],
            ...payload,
        };
        setPosts((current) => [next, ...current]);
        toast.success(dict.diseaseQa.postCreated);
    };

    const handleCommentLike = (postId: string, commentId: string) => {
        setPosts((current) =>
            current.map((post) =>
                post.id !== postId
                    ? post
                    : {
                        ...post,
                        comments: post.comments.map((comment) =>
                            comment.id === commentId ? { ...comment, likesCount: comment.likesCount + 1 } : comment
                        ),
                    }
            )
        );
    };

    const handlePostLike = (postId: string) => {
        setPosts((current) =>
            current.map((post) => {
                if (post.id === postId) {
                    const isLiked = likedPosts.has(postId);
                    return { ...post, likesCount: post.likesCount + (isLiked ? -1 : 1) };
                }
                return post;
            })
        );
        setLikedPosts((prev) => {
            const next = new Set(prev);
            if (next.has(postId)) next.delete(postId);
            else next.add(postId);
            return next;
        });
    };

    const handleCommentSubmit = (postId: string, text: string, anonymous: boolean) => {
        setPosts((current) =>
            current.map((post) => {
                if (post.id === postId) {
                    return {
                        ...post,
                        commentsCount: post.commentsCount + 1,
                        comments: [
                            {
                                id: `${post.id}-${Date.now()}`,
                                authorId: "u_lucas",
                                text,
                                createdAt: new Date().toISOString(),
                                anonymous,
                                likesCount: 0,
                            },
                            ...post.comments,
                        ],
                    };
                }
                return post;
            })
        );
        toast.success(dict.diseaseQa.commentPosted || "Comment posted!");
    };

    return (
        <div className="relative isolate overflow-hidden">
            <div className="absolute inset-x-0 top-0 -z-10 h-120 bg-[radial-gradient(circle_at_20%_20%,rgba(66,156,168,0.18),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(66,156,168,0.14),transparent_28%),linear-gradient(180deg,#fff,#f8fafc_45%,#eef7f8)]" />
            <div className="absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[#429CA8]/10 blur-3xl" />

            <div className="container py-6 sm:py-8">
                <div className="mb-6 flex items-center justify-between gap-3">
                    <Button variant="ghost" size="sm" asChild className="rounded-full">
                        <Link href={`/${lang}/myHome`}>
                            <ArrowLeft className="size-4" />
                            {dict.common.back}
                        </Link>
                    </Button>

                    <Button className={brandButtonClass} onClick={() => setOpenCreate(true)}>
                        <Plus className="size-4" />
                        {dict.diseaseQa.createPost}
                    </Button>
                </div>

                <section className="w-full flex flex-col gap-8 ">
                    <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#2b7e87]">
                            <Sparkles className="size-4" />
                            {dict.diseaseQa.title}
                        </div>
                        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                            {dict.diseaseQa.heroTitle}
                        </h1>
                        <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                            {dict.diseaseQa.heroDescription}
                        </p>
                        <p className="mt-4  rounded-[1.5rem] border border-[#429CA8]/12 bg-[#429CA8]/6 p-4 text-sm leading-7 text-slate-700">
                            {dict.diseaseQa.disclaimer}
                        </p>
                    </div>
                    <div className="rounded-[1.5rem] border border-[#429CA8]/12 bg-[#429CA8]/6 p-4 lg:hidden">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2b7e87]">{dict.diseaseQa.categoryTitle}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <button type="button" onClick={() => setFilter("All")} className={`rounded-full px-3 py-1.5 text-xs ${filter === "All" ? "bg-[#429CA8] text-white" : "bg-white text-slate-700"}`}>
                                {dict.diseaseQa.allFilter}
                            </button>
                            {diseaseOptions.map((option) => (
                                <button key={option} type="button" onClick={() => setFilter(option)} className={`rounded-full px-3 py-1.5 text-xs ${filter === option ? "bg-[#429CA8] text-white" : "bg-white text-slate-700"}`}>
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="mt-8 lg:mt-16 grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem] relative">
                    <div className="space-y-5">
                        <div className="grid gap-3 rounded-[2rem] border border-white/70 bg-white/95 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={dict.diseaseQa.searchPlaceholder} className="min-h-11 pl-10" />
                            </div>
                        </div>

                        {visiblePosts?.map((post) => (
                            <PostHeader
                                key={post.id}
                                post={post}
                                lang={lang}
                                href={`/${lang}/disease-qa/details/${post.id}`}
                                dict={dict}
                                onOpen={() => { }}
                                isLiked={likedPosts.has(post.id)}
                                onLike={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handlePostLike(post.id);
                                }}
                                onCommentSubmit={(text, anonymous) => handleCommentSubmit(post.id, text, anonymous)}
                                onCommentLike={(commentId) => handleCommentLike(post.id, commentId)}
                            />
                        ))}
                    </div>

                    <aside className="hidden xl:block lg:sticky lg:top-40">
                        <div className="rounded-[1.5rem] border border-[#429CA8]/12 bg-[#429CA8]/6 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2b7e87]">{dict.diseaseQa.categoryTitle}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <button type="button" onClick={() => setFilter("All")} className={`rounded-full px-3 py-1.5 text-xs ${filter === "All" ? "bg-[#429CA8] text-white" : "bg-white text-slate-700"}`}>
                                    {dict.diseaseQa.allFilter}
                                </button>
                                {diseaseOptions.map((option) => (
                                    <button key={option} type="button" onClick={() => setFilter(option)} className={`rounded-full px-3 py-1.5 text-xs ${filter === option ? "bg-[#429CA8] text-white" : "bg-white text-slate-700"}`}>
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <AddDiseasePostDialog open={openCreate} onOpenChange={setOpenCreate} dict={dict} onCreate={createPost} />
            <ReportContentModal
                open={reportOpen}
                onOpenChange={setReportOpen}
                title={dict.diseaseQa.reportTitle}
                reasonsTitle={dict.diseaseQa.reportReasonsTitle}
                detailsTitle={dict.diseaseQa.reportDetailsTitle}
                detailsPlaceholder={dict.diseaseQa.reportDetailsPlaceholder}
                evidenceTitle={dict.diseaseQa.reportEvidenceTitle}
                evidenceNote={dict.diseaseQa.reportEvidenceNote}
                addLabel={dict.diseaseQa.reportAdd}
            />
        </div>
    );
}
