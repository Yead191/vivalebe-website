"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { ReportContentModal } from "@/features/member/home/modals/ReportContentModal";
import type { DiseasePost } from "./types";
import { CommentCard, CommentComposer, ReactionStats, brandButtonClass } from "./shared";

export function DiseaseQaDetailsClient({
  lang,
  dict,
  post,
}: {
  lang: Locale;
  dict: Dictionary;
  post: DiseasePost;
}) {
  const [reportOpen, setReportOpen] = useState(false);
  const [comments, setComments] = useState(post.comments);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  return (
    <div className="container py-6 sm:py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild className="rounded-full">
          <Link href={`/${lang}/disease-qa`}>
            <ArrowLeft className="size-4" />
            {dict.diseaseQa.backToFeed}
          </Link>
        </Button>
        <Button variant="outline" className="rounded-full border-[#429CA8]/20 text-[#2b7e87]" onClick={() => setReportOpen(true)}>
          {dict.diseaseQa.report}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <article className="rounded-[2rem] border border-white/70 bg-white/95 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2b7e87]">{post.disease}</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{post.title}</h1>
          </div>
          <p className="mt-4 text-base leading-8 text-slate-600">{post.body}</p>
          <div className="mt-6 flex items-center gap-3">
            <Button className={brandButtonClass} onClick={() => setLikesCount((value) => value + 1)}>
              <Heart className="size-4" />
              {dict.diseaseQa.like}
            </Button>
            <ReactionStats likes={likesCount} comments={comments.length} />
          </div>
        </article>

        <aside className="space-y-4 rounded-[2rem] border border-white/70 bg-white/95 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">{dict.diseaseQa.commentsTitle}</p>
          <CommentComposer
            dict={dict}
            onSubmit={({ text, anonymous }) => {
              setComments((current) => [
                {
                  id: `${post.id}-${Date.now()}`,
                  authorId: "u_lucas",
                  text,
                  createdAt: new Date().toISOString(),
                  anonymous,
                  likesCount: 0,
                },
                ...current,
              ]);
              toast.success(dict.diseaseQa.commentPosted);
            }}
          />
          <div className="space-y-3">
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                anonymous={comment.anonymous}
                dict={dict}
                onLike={() => setComments((current) => current.map((item) => item.id === comment.id ? { ...item, likesCount: item.likesCount + 1 } : item))}
              />
            ))}
          </div>
        </aside>
      </div>

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
