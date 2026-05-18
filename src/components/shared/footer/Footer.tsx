"use client"
import Image from "next/image";
import { Heart } from "lucide-react";
import { LocaleLink } from "@/components/shared/locale-link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { usePathname } from "next/navigation";

interface FooterColumn {
  headingKey: keyof Dictionary["footer"];
  links: { labelKey: keyof Dictionary["footer"]; href: string }[];
}

const columns: FooterColumn[] = [
  {
    headingKey: "sectionProduct",
    links: [
      { labelKey: "productFeatures", href: "/features" },
      { labelKey: "productSafety", href: "/safety" },
      { labelKey: "productPricing", href: "/pricing" },
      { labelKey: "productCommunity", href: "/community" },
    ],
  },
  {
    headingKey: "sectionCompany",
    links: [
      { labelKey: "companyAbout", href: "/about" },
      { labelKey: "companyResources", href: "/resources" },
      { labelKey: "companyPress", href: "/press" },
      { labelKey: "companyCareers", href: "/careers" },
    ],
  },
  {
    headingKey: "sectionSupport",
    links: [
      { labelKey: "supportHelp", href: "/help" },
      { labelKey: "supportPrivacy", href: "/privacy" },
      { labelKey: "supportTerms", href: "/terms" },
      { labelKey: "supportContact", href: "/contact" },
    ],
  },
];

interface FooterProps {
  lang: Locale;
  dict: Dictionary;
}

export async function Footer({ lang, dict }: FooterProps) {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  if (pathname?.includes('/chat')) {
    return null;
  }
  return (
    <footer className="bg-brand text-brand-foreground mt-auto">
      <div className="container py-12 grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-4">
          <Image
            src="/logo.png"
            alt="Viva Leve"
            width={200}
            height={60}
            className="h-12 w-auto object-contain"
          />
          <p className="font-museo text-2xl leading-tight max-w-xs">
            <span className="block">{dict.footer.tagline1}</span>
            <span className="block text-white/80">{dict.footer.tagline2}</span>
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.headingKey} className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider text-white/80">
              {dict.footer[col.headingKey]}
            </h4>
            <ul className="space-y-2 text-sm">
              {col.links.map((link) => (
                <li key={link.labelKey}>
                  <LocaleLink
                    href={link.href}
                    lang={lang}
                    className="text-white/90 hover:text-white transition-colors"
                  >
                    {dict.footer[link.labelKey]}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container py-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-white/70">
          <span>© {year} Viva Leve. {dict.footer.copyright}</span>
          <span className="flex items-center gap-1.5">
            {dict.footer.builtWith}
            <Heart className="size-3.5 fill-white/80 text-white/80" />
            {dict.footer.forConnection}
          </span>
        </div>
      </div>
    </footer>
  );
}
