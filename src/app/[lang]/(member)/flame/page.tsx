import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function FlamePage({ params }: PageProps<"/[lang]/flame">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return (
    <div className="container py-24 text-center">
      <h1 className="font-museo text-3xl">{dict.flame.title}</h1>
      <p className="mt-3 text-muted-foreground">{dict.flame.comingSoon}</p>
    </div>
  );
}
