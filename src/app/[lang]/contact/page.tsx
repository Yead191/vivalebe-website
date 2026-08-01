import React from "react";
import { getDictionary } from "@/i18n/dictionaries";
import { defaultLocale, type Locale } from "@/i18n/config";
import ContactForm from "@/features/contact/ContactForm";
import { MemberNavbar } from "@/components/shared/navbar/MemberNavbar";
import { Footer } from "@/components/shared/footer/Footer";
import { getProfileAction } from "@/features/member/settings/action";

export const metadata = {
  title: "Contact Us | Viva Leve",
  description: "Get in touch with the Viva Leve team.",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const p = await params;
  const lang = (p.lang as Locale) || defaultLocale;
  const dict = await getDictionary(lang);
  
  // Fetch user data if logged in
  const profileRes = await getProfileAction();
  const userData = profileRes?.data || {};

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <MemberNavbar
        lang={lang}
        dict={dict}
        currentUser={{
          email: userData.email || "",
          username: userData.username || "user",
          displayName: userData.name || userData.displayName || "User",
          avatarSeed:
            userData.profile ||
            userData.image ||
            userData.profileImage ||
            userData.avatarSeed ||
            "default",
          isAdminVerified: userData.isAdminVerified || false,
          verifiedStatus: userData.verifiedStatus || "",
        }}
      />
      
      <main className="flex-1 bg-neutral-50/50 py-20 px-4 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Decorative background elements matching Viva Leve theme */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#429CA8]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#429CA8]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-4xl z-10 pt-10">
          <ContactForm dict={dict} />
        </div>
      </main>

      <Footer lang={lang} dict={dict} />
    </div>
  );
}
