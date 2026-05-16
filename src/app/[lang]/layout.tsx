import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LocaleRootLayout({
  children,
  params,
}: LayoutProps) {
  const { lang } = await params;
  
  if (!isLocale(lang)) {
    notFound();
  }

  return <>{children}</>;
}
