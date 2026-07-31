import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, locales, isLocale } from "@/i18n/config";

function pickLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language") ?? "";
  const preferred = header
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase().split("-")[0])
    .find((tag) => isLocale(tag));
  return preferred ?? defaultLocale;
}

const protectedRoutes = [
  "/myHome",
  "/my-profile",
  "/my-list",
  "/chat",
  "/settings",
  "/discover",
  "/flame",
  "/profile",
  "/onboarding",
  "/events",
  "/payment",
  "/subscription",
];

const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/otp-verification",
  "/auth/forgot-password",
];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Bypass for Next.js internal requests and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  let currentLocale: string = defaultLocale;
  let pathWithoutLocale = pathname;

  if (!hasLocale) {
    // If no locale in URL, redirect to a URL with the picked locale
    currentLocale = pickLocale(request);
    const target = new URL(
      `/${currentLocale}${pathname === "/" ? "" : pathname}${search}`,
      request.url,
    );
    return NextResponse.redirect(target);
  } else {
    // URL already has a locale, extract it
    const segments = pathname.split("/");
    currentLocale = segments[1];
    pathWithoutLocale = "/" + segments.slice(2).join("/");
  }

  const accessToken = request.cookies.get("accessToken")?.value;

  // Check if it's a protected route
  const isProtected = protectedRoutes.some(
    (route) =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`),
  );

  const isAuthRoute = authRoutes.some(
    (route) =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`),
  );

  if (isProtected && !accessToken) {
    // Redirect to login if not authenticated
    const loginUrl = new URL(`/${currentLocale}/auth/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && accessToken) {
    // Redirect to myHome if already authenticated
    const homeUrl = new URL(`/${currentLocale}/myHome`, request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
