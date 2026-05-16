import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { User } from "@/lib/types";
import { ProfileSidebar } from "./ProfileSidebar";
import { ProfileMain } from "./ProfileMain";
import BackButton from "@/components/shared/BackButton";

interface Props {
  lang: Locale;
  dict: Dictionary;
  user: User;
}

export function ProfileFeature({ lang, dict, user }: Props) {
  return (
    <div className="container py-5">
      <BackButton />
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
