import type { Metadata } from "next";
import { Montserrat, MuseoModerno } from "next/font/google";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import "../globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
});

const museoModerno = MuseoModerno({
  subsets: ["latin"],
  variable: "--font-museo-moderno",
});

export const metadata: Metadata = {
  title: "Viva Leve",
  description: "Connection that begins with honesty.",
};

export default async function LocaleRootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      className={`${montserrat.variable} ${museoModerno.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
