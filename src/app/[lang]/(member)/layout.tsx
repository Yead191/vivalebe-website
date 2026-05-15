import { notFound } from "next/navigation";
import { MemberNavbar } from "@/components/shared/navbar/MemberNavbar";
import { Footer } from "@/components/shared/footer/Footer";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/mock/current-user";

export default async function MemberLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const me = getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <MemberNavbar
        lang={lang}
        dict={dict}
        currentUser={{
          username: me.username,
          displayName: me.displayName,
          avatarSeed: me.avatarSeed,
        }}
      />
      <main className="flex-1">{children}</main>
      <Footer lang={lang} dict={dict} />
    </div>
  );
}
