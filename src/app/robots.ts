import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";
import { locales } from "@/i18n/config";

const PRIVATE_PATHS = [
  "/auth/",
  "/onboarding",
  "/settings",
  "/chat",
  "/my-profile",
  "/my-list",
  "/myHome",
  "/discover",
  "/flame",
  "/payment/",
];

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl();
  const disallow = locales.flatMap((lang) =>
    PRIVATE_PATHS.map((path) => `/${lang}${path}`),
  );

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
