import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import DiseaseQnADetailsFeature from "@/features/member/disease-qa/details";

export default async function DiseaseQnADetailsPage({
  params,
}: PageProps<any>) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return <DiseaseQnADetailsFeature lang={lang} dict={dict} postId={id} />;
}
