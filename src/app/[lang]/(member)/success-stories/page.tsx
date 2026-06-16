import SuccessStoriesFeature from '@/features/member/success-stories';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { notFound } from 'next/navigation';


export default async function MySuccessStoriesPage({ params }: PageProps<any>) {
    const { lang } = await params;
    if (!isLocale(lang)) notFound();
    const dict = await getDictionary(lang);
    return <SuccessStoriesFeature lang={lang} dict={dict} />;
}
