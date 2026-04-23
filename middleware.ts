import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

/** Map Accept-Language to next-intl locale (en | zh-HK | zh-CN). */
function negotiateLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language");
  if (!header) {
    return routing.defaultLocale;
  }

  const tags = header
    .split(",")
    .map((part) => part.trim().split(";")[0]?.toLowerCase())
    .filter(Boolean) as string[];

  for (const tag of tags) {
    if (tag.startsWith("zh-hk") || tag === "zh-tw" || tag.startsWith("yue")) {
      return "zh-HK";
    }
    if (tag.startsWith("zh-cn") || tag === "zh-hans") {
      return "zh-CN";
    }
  }

  for (const tag of tags) {
    if (tag === "zh" || tag.startsWith("zh-")) {
      return "zh-HK";
    }
  }

  return routing.defaultLocale;
}

// Admin routes that require authentication
const ADMIN_PROTECTED_ROUTES = [
  "/admin/dashboard",
  "/admin/team",
  "/admin/leads",
  "/admin/settings",
];

// Admin routes that should be accessible without auth (login, reset-password flow)
const ADMIN_PUBLIC_ROUTES = [
  "/admin/login",
  "/admin/reset-password",
];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const locale = negotiateLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  // Check if this is an admin route
  const isAdminRoute = pathname.startsWith("/admin") || 
                       pathname.match(/^\/[a-z]{2}(-[A-Z]{2})?\/admin/);

  if (isAdminRoute) {
    // Extract locale from pathname
    const localeMatch = pathname.match(/^\/[a-z]{2}(-[A-Z]{2})?/);
    const locale = localeMatch ? localeMatch[0] : "/en";

    // Check if this is a protected admin route
    const isProtectedRoute = ADMIN_PROTECTED_ROUTES.some((route) => 
      pathname.includes(route)
    );

    const isPublicAdminRoute = ADMIN_PUBLIC_ROUTES.some((route) =>
      pathname.includes(route)
    );

    // If it's a protected route, check for session
    if (isProtectedRoute) {
      const sessionToken = request.cookies.get("admin_session")?.value;

      if (!sessionToken) {
        // Redirect to login
        const loginUrl = new URL(`${locale}/admin/login`, request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Verify session with API (simplified - in production, verify JWT)
      try {
        const verifyResponse = await fetch(
          new URL("/api/admin/verify-session", request.url),
          {
            headers: {
              Cookie: `admin_session=${sessionToken}`,
            },
          }
        );

        if (!verifyResponse.ok) {
          // Session invalid, redirect to login
          const loginUrl = new URL(`${locale}/admin/login`, request.url);
          const response = NextResponse.redirect(loginUrl);
          response.cookies.delete("admin_session");
          return response;
        }

        const sessionData = await verifyResponse.json();

        // Check if first login and trying to access dashboard
        if (sessionData.isFirstLogin && !pathname.includes("/admin/reset-password")) {
          // Force password change
          const resetUrl = new URL(`${locale}/admin/reset-password?first=true`, request.url);
          return NextResponse.redirect(resetUrl);
        }
      } catch (error) {
        // Verification failed, redirect to login
        const loginUrl = new URL(`${locale}/admin/login`, request.url);
        return NextResponse.redirect(loginUrl);
      }
    }

    // If already logged in and trying to access login page, redirect to dashboard
    if (isPublicAdminRoute && !pathname.includes("/admin/reset-password")) {
      const sessionToken = request.cookies.get("admin_session")?.value;
      
      if (sessionToken) {
        try {
          const verifyResponse = await fetch(
            new URL("/api/admin/verify-session", request.url),
            {
              headers: {
                Cookie: `admin_session=${sessionToken}`,
              },
            }
          );

          if (verifyResponse.ok) {
            const sessionData = await verifyResponse.json();
            
            // Check if first login
            if (sessionData.isFirstLogin) {
              const resetUrl = new URL(`${locale}/admin/reset-password?first=true`, request.url);
              return NextResponse.redirect(resetUrl);
            }
            
            // Already logged in, redirect to dashboard
            const dashboardUrl = new URL(`${locale}/admin/dashboard`, request.url);
            return NextResponse.redirect(dashboardUrl);
          }
        } catch (error) {
          // Session verification failed, allow access to login
        }
      }
    }
  }

  // Apply next-intl middleware for locale handling
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - /api routes
    // - /_next (Next.js internals)
    // - /_vercel (Vercel internals)
    // - /static (inside /public)
    // - all root files inside /public (e.g. /favicon.ico)
    "/((?!api|_next|_vercel|static|.*\\..*).*)",
    // Also match admin routes explicitly
    "/admin/:path*",
    "/[a-z]{2}/admin/:path*",
    "/[a-z]{2}-[A-Z]{2}/admin/:path*",
  ],
};
