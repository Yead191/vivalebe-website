import Link from "next/link";
import { SearchX, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function ProfileNotFoundState({
  lang,
  dict,
  username,
}: {
  lang: Locale;
  dict: Dictionary;
  username: string;
}) {
  return (
    <div className="container py-10 sm:py-16">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="bg-[radial-gradient(circle_at_top,rgba(66,156,168,0.18),transparent_42%),linear-gradient(180deg,rgba(66,156,168,0.10),transparent)] px-6 py-10 sm:px-10">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#429CA8] text-white shadow-lg shadow-[#429CA8]/20">
            <SearchX className="size-8" />
          </div>

          <div className="mx-auto mt-6 max-w-xl text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#429CA8]/18 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#2b7e87]">
              <Sparkles className="size-3.5" />
              {dict.profile.notFoundBadge}
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {dict.profile.notFoundTitle}
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              {dict.profile.notFoundDescription.replace(
                "@{username}",
                `@${username}`
              )}
            </p>
          </div>
        </div>

        <div className="grid gap-4 px-6 py-6 sm:px-10 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-[#429CA8]/12 bg-[#429CA8]/6 p-5">
            <p className="text-sm font-semibold text-slate-900">
              {dict.profile.notFoundTipsTitle}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {dict.profile.notFoundTipsBody}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-dashed border-[#429CA8]/18 bg-white p-5">
            <p className="text-sm font-semibold text-slate-900">
              {dict.profile.notFoundHelpTitle}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {dict.profile.notFoundHelpBody}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 border-t border-white/70 px-6 py-6 sm:px-10">
          <Button
            className="rounded-full bg-[#429CA8] text-white hover:bg-[#388994]"
            asChild
          >
            <Link href={`/${lang}/discover`}>
              {dict.profile.notFoundBrowse}
            </Link>
          </Button>

          <Button
            variant="outline"
            className="rounded-full border-[#429CA8]/20 text-[#2b7e87]"
            asChild
          >
            <Link href={`/${lang}/myHome`}>
              {dict.profile.notFoundHome}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}