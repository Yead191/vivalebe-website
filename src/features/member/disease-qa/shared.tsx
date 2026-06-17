"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { avatarUrl } from "@/lib/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Dictionary } from "@/i18n/dictionaries";
import type { DiseaseCategory, DiseasePost, DiseasePostComment } from "./types";
import { diseaseOptions } from "./data";

export const brandButtonClass =
  "bg-[#429CA8] text-white hover:bg-[#388994] shadow-[0_16px_35px_rgba(66,156,168,0.24)]";

export type AnonymousProfile = {
  name: string;
  username?: string;
  image: string;
};

export const anonymousProfiles: AnonymousProfile[] = [
  { name: "Anonymous Hope", image: avatarUrl("anonymous-hope", 96) },
  { name: "Anonymous Care", image: avatarUrl("anonymous-care", 96) },
  { name: "Anonymous Calm", image: avatarUrl("anonymous-calm", 96) },
  { name: "Anonymous Light", image: avatarUrl("anonymous-light", 96) },
];

export function getAuthorProfile(authorId: string) {
  if (authorId === "u_lucas") return { name: "Lucas", username: "lucas", image: avatarUrl(authorId, 96) };
  if (authorId === "u_maya") return { name: "Maya", username: "maya", image: avatarUrl(authorId, 96) };
  if (authorId === "u_aurora") return { name: "Aurora", username: "aurora", image: avatarUrl(authorId, 96) };
  if (authorId === "u_camila") return { name: "Camila", username: "camila", image: avatarUrl(authorId, 96) };
  if (authorId === "u_sofia") return { name: "Sofia", username: "sofia", image: avatarUrl(authorId, 96) };
  if (authorId === "u_beatriz") return { name: "Beatriz", username: "beatriz", image: avatarUrl(authorId, 96) };
  if (authorId === "u_helena") return { name: "Helena", username: "helena", image: avatarUrl(authorId, 96) };
  if (authorId === "u_olivia") return { name: "Olivia", username: "olivia", image: avatarUrl(authorId, 96) };
  if (authorId === "u_pedro") return { name: "Pedro", username: "pedro", image: avatarUrl(authorId, 96) };
  return { name: "Community member", username: "member", image: avatarUrl(authorId, 96) };
}

export function getAnonymousProfile(index = 0) {
  return anonymousProfiles[index % anonymousProfiles.length];
}

export function formatDate(date: string, lang: string) {
  return new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function PostHeader({
  post,
  lang,
  href,
  onOpen,
  onLike,
  isLiked,
  onCommentSubmit,
  onCommentLike,
  dict,
}: {
  post: DiseasePost;
  lang: string;
  href: string;
  onOpen: () => void;
  onLike?: (e: React.MouseEvent) => void;
  isLiked?: boolean;
  onCommentSubmit?: (text: string, anonymous: boolean) => void;
  onCommentLike?: (commentId: string) => void;
  dict: Dictionary;
}) {
  const author = post.anonymous ? getAnonymousProfile(0) : getAuthorProfile(post.authorId);

  return (
    <div className="group relative w-full text-left rounded-[2rem] border border-white/70 bg-white/95 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_80px_rgba(15,23,42,0.1)]">
      <Link href={href} onClick={onOpen} className="absolute inset-0 z-0 rounded-[2rem]" aria-label="View post details" />

      <div className="relative z-10 flex items-start gap-4 pointer-events-none">
        <Image
          src={author.image}
          alt={author.name}
          width={52}
          height={52}
          className="size-13 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm"
          unoptimized
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-950">{post.anonymous ? dict.diseaseQa.anonymousAuthor : author.name}</p>
              <span className="text-xs text-muted-foreground">• {formatDate(post.createdAt, lang)}</span>
            </div>
            <span className="rounded-full bg-[#429CA8]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#2b7e87]">
              {post.disease}
            </span>
          </div>

          <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950 group-hover:text-[#429CA8] transition-colors pointer-events-auto w-fit">
            <Link href={href} onClick={onOpen}>{post.title}</Link>
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-7 text-slate-600 pointer-events-auto">
            <Link href={href} onClick={onOpen}>{post.body}</Link>
          </p>

          {/* Interaction Bar */}
          <div className="mt-5 flex items-center gap-6 border-t border-slate-100/80 pt-4 pointer-events-auto">
            <button
              type="button"
              onClick={onLike}
              className={`flex items-center gap-2 text-sm font-medium transition-colors group/like ${isLiked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'}`}
            >
              <div className={`flex size-9 items-center justify-center rounded-full transition-colors ${isLiked ? 'bg-rose-50' : 'bg-slate-50 group-hover/like:bg-rose-50'}`}>
                <Heart className={`size-4.5 transition-colors ${isLiked ? "fill-rose-500 text-rose-500" : "text-slate-400 group-hover/like:text-rose-500"}`} />
              </div>
              <span>{post.likesCount > 0 ? post.likesCount : "Like"}</span>
            </button>

            <Link href={href} onClick={onOpen} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#429CA8] transition-colors group/comment">
              <div className={`flex size-9 items-center justify-center rounded-full transition-colors ${post.commentsCount > 0 ? 'bg-[#429CA8]/10' : 'bg-slate-50 group-hover/comment:bg-[#429CA8]/10'}`}>
                <MessageCircle className={`size-4.5 transition-colors ${post.commentsCount > 0 ? 'text-[#429CA8] fill-[#429CA8]/20' : 'text-slate-400 group-hover/comment:text-[#429CA8]'}`} />
              </div>
              <span>{post.commentsCount > 0 ? post.commentsCount : "Comment"}</span>
            </Link>
          </div>

          {/* Comments Section */}
          {onCommentSubmit && (
            <div className="mt-5 space-y-4 border-t border-slate-100/80 pt-4 pointer-events-auto">
              {post.comments.slice(0, 2).map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  anonymous={comment.anonymous}
                  dict={dict}
                  onLike={() => onCommentLike?.(comment.id)}
                />
              ))}

              {post.comments.length > 2 && (
                <Link href={href} onClick={onOpen} className="inline-block text-sm font-medium text-[#2b7e87] hover:underline">
                  {dict.diseaseQa.viewAllComments.replace("{{count}}", post.comments.length.toString())}
                </Link>
              )}

              <div className="mt-2">
                <CommentComposer dict={dict} onSubmit={(payload) => onCommentSubmit(payload.text, payload.anonymous)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ReactionStats({
  likes,
  comments,
}: {
  likes: number;
  comments: number;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
        <Heart className="size-3.5" />
        {likes}
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
        <MessageCircle className="size-3.5" />
        {comments}
      </span>
    </div>
  );
}

export function AddDiseasePostDialog({
  open,
  onOpenChange,
  dict,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dict: Dictionary;
  onCreate: (payload: { title: string; body: string; disease: DiseaseCategory; anonymous: boolean }) => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [disease, setDisease] = useState<DiseaseCategory>("Herpes");
  const [anonymous, setAnonymous] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] min-w-xl overflow-hidden p-0">
        <div className="max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">{dict.diseaseQa.createPostTitle}</DialogTitle>
            <DialogDescription>{dict.diseaseQa.createPostDescription}</DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid gap-4">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={dict.diseaseQa.postTitlePlaceholder} className="min-h-10" />
            <Select value={disease} onValueChange={(value) => setDisease(value as DiseaseCategory)}>
              <SelectTrigger className="min-h-10 w-full">
                <SelectValue placeholder={dict.diseaseQa.diseasePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {diseaseOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder={dict.diseaseQa.postBodyPlaceholder} className="min-h-36" />

            <label className="flex items-center justify-between rounded-[1.25rem] border border-[#429CA8]/12 bg-[#429CA8]/6 px-4 py-3">
              <div>
                <p className="font-medium text-slate-900">{dict.diseaseQa.postAnonymousLabel}</p>
                <p className="text-sm text-muted-foreground">{dict.diseaseQa.postAnonymousHelp}</p>
              </div>
              <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="size-5 accent-[#429CA8]" />
            </label>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => onOpenChange(false)}>{dict.common.back}</Button>
            <Button
              className={brandButtonClass}
              onClick={() => {
                if (!title.trim() || !body.trim()) return;
                onCreate({ title: title.trim(), body: body.trim(), disease, anonymous });
                setTitle("");
                setBody("");
                setAnonymous(true);
                setDisease("Herpes");
                onOpenChange(false);
              }}
            >
              {dict.diseaseQa.createPostSubmit}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CommentComposer({
  dict,
  onSubmit,
}: {
  dict: Dictionary;
  onSubmit: (payload: { text: string; anonymous: boolean }) => void;
}) {
  const [text, setText] = useState("");
  const [anonymous, setAnonymous] = useState(true);

  return (
    <form
      className="rounded-[1.5rem] border border-[#429CA8]/12 bg-[#429CA8]/6 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSubmit({ text: text.trim(), anonymous });
        setText("");
        setAnonymous(true);
      }}
    >
      <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={dict.diseaseQa.commentPlaceholder} className="min-h-28 bg-white" />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="size-4 accent-[#429CA8]" />
          {dict.diseaseQa.commentAnonymousLabel}
        </label>
        <Button type="submit" className={brandButtonClass}>{dict.diseaseQa.commentSubmit}</Button>
      </div>
    </form>
  );
}

export function CommentCard({
  comment,
  anonymous,
  dict,
  onLike,
}: {
  comment: DiseasePostComment;
  anonymous: boolean;
  dict: Dictionary;
  onLike: () => void;
}) {
  const author = anonymous ? getAnonymousProfile(1) : getAuthorProfile(comment.authorId);
  return (
    <div className="rounded-[1.35rem] border border-white/70 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
      <div className="flex items-start gap-3">
        <Image src={author.image} alt={author.name} width={40} height={40} className="size-10 rounded-full object-cover ring-2 ring-white" unoptimized />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-950">{anonymous ? dict.diseaseQa.anonymousAuthor : author.name}</p>
            <span className="text-xs text-muted-foreground">{anonymous ? dict.diseaseQa.anonymousLabel : `@${author.username}`}</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{comment.text}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <button type="button" onClick={onLike} className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2b7e87]">
          <Heart className="size-4" />
          {comment.likesCount}
        </button>
      </div>
    </div>
  );
}
