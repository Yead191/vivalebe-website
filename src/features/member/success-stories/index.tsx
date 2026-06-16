import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/mock/current-user";
import { successStories } from "../../../lib/mock/success-stories-mock";
import { SuccessStoriesPageClient } from "./SuccessStoriesPageClient";

export default function SuccessStoriesFeature({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const me = getCurrentUser();

  return (
    <SuccessStoriesPageClient
      lang={lang}
      dict={dict}
      currentUser={{ id: me.id, username: me.username, avatarSeed: me.avatarSeed }}
      initialStories={successStories}
    />
  );
}
