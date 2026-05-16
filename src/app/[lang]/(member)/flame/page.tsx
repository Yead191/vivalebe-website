import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/mock/current-user";
import { getOtherUsers } from "@/lib/mock/users";
import { FlameFeature } from "@/features/member/flame";

export default async function FlamePage({ params }: PageProps<"/[lang]/flame">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const me = getCurrentUser();
  const candidates = getOtherUsers(me.id);

  return (
    <FlameFeature
      lang={lang}
      dict={dict}
      me={me}
      candidates={candidates}
    />
  );
}
