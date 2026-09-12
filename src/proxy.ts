import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, locales, isLocale } from "@/i18n/config";
import { isAccessTokenExpired } from "@/helpers/tokenExpiry";
import { ONBOARDING_COOKIE } from "@/helpers/onboardingCookie";

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

function clearAuthCookies(response: NextResponse) {
  const expired = { path: "/", maxAge: 0 };
  response.cookies.set("accessToken", "", expired);
  response.cookies.set("refreshToken", "", expired);
  response.cookies.set(ONBOARDING_COOKIE, "", expired);
  return response;
}

function withLocaleHeaders(
  request: NextRequest,
  locale: string,
  stripAuth: boolean,
) {
  const headers = new Headers(request.headers);
  headers.set("x-locale", locale);
  headers.set("x-url", request.url);

  if (stripAuth) {
    const leftover = request.headers
      .get("cookie")
      ?.split(";")
      .map((part) => part.trim())
      .filter(
        (part) =>
          part &&
          !part.startsWith("accessToken=") &&
          !part.startsWith("refreshToken=") &&
          !part.startsWith(`${ONBOARDING_COOKIE}=`),
      )
      .join("; ");

    if (leftover) headers.set("cookie", leftover);
    else headers.delete("cookie");
  }

  const response = NextResponse.next({ request: { headers } });
  if (stripAuth) clearAuthCookies(response);
  return response;
}

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
    const response = NextResponse.redirect(target);
    const token = request.cookies.get("accessToken")?.value;
    if (token && isAccessTokenExpired(token)) {
      return clearAuthCookies(response);
    }
    return response;
  } else {
    // URL already has a locale, extract it
    const segments = pathname.split("/");
    currentLocale = segments[1];
    pathWithoutLocale = "/" + segments.slice(2).join("/");
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const tokenExpired = Boolean(accessToken) && isAccessTokenExpired(accessToken);
  const isAuthenticated = Boolean(accessToken) && !tokenExpired;
  const onboardingIncomplete =
    request.cookies.get(ONBOARDING_COOKIE)?.value === "false";

  // Check if it's a protected route
  const isProtected = protectedRoutes.some(
    (route) =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`),
  );

  const isAuthRoute = authRoutes.some(
    (route) =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`),
  );

  const isOnboardingRoute =
    pathWithoutLocale === "/onboarding" ||
    pathWithoutLocale.startsWith("/onboarding/");

  const isHomeRoute =
    pathWithoutLocale === "/" ||
    pathWithoutLocale === "" ||
    pathWithoutLocale === "/myHome" ||
    pathWithoutLocale.startsWith("/myHome/");

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL(`/${currentLocale}/auth/login`, request.url);
    return clearAuthCookies(NextResponse.redirect(loginUrl));
  }

  if (isAuthenticated && onboardingIncomplete && !isOnboardingRoute) {
    if (isHomeRoute || (isProtected && !isAuthRoute)) {
      const onboardingUrl = new URL(
        `/${currentLocale}/onboarding`,
        request.url,
      );
      return NextResponse.redirect(onboardingUrl);
    }
  }

  if (isAuthRoute && isAuthenticated) {
    const nextPath = onboardingIncomplete ? "onboarding" : "myHome";
    const nextUrl = new URL(`/${currentLocale}/${nextPath}`, request.url);
    return NextResponse.redirect(nextUrl);
  }

  return withLocaleHeaders(request, currentLocale, tokenExpired);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
