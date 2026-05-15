import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { User } from "@/lib/types";
import { ProfileSidebar } from "./ProfileSidebar";
import { ProfileMain } from "./ProfileMain";

interface Props {
  lang: Locale;
  dict: Dictionary;
  user: User;
}

export function ProfileFeature({ lang, dict, user }: Props) {
  return (
    <div className="container py-5">
      <Link
        href={`/${lang}/discover`}
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-brand transition-colors"
      >
        <ArrowLeft className="size-4" />
        {dict.profile.back}
      </Link>
      <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <div>
          <div className="lg:sticky lg:top-20">
            <ProfileSidebar dict={dict} user={user} />
          </div>
        </div>
        <ProfileMain lang={lang} dict={dict} user={user} />
      </div>
    </div>
  );
}
