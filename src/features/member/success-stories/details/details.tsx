import { notFound } from "next/navigation";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getCurrentUser } from "@/lib/mock/current-user";
import { successStories } from "../../../../lib/mock/success-stories-mock";
import { SuccessStoryDetailsClient } from "./details-client";

export default function SuccessStoryDetailsFeature({
  lang,
  dict,
  storyId,
}: {
  lang: Locale;
  dict: Dictionary;
  storyId: string;
}) {
  const story = successStories.find((item) => item.id === storyId);
  if (!story) notFound();

  return <SuccessStoryDetailsClient lang={lang} dict={dict} currentUser={getCurrentUser()} initialStory={story} />;
}
