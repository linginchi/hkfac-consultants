import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

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

  // Always send the bare hostname root to English to avoid 404/blank routes on any CDN path.
  if (pathname === "/" || pathname === "") {
    const url = request.nextUrl.clone();
    // With next.config trailingSlash, prefer /en/ so the host and Next stay consistent.
    url.pathname = "/en/";
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
    // Root: locale redirect in middleware
    "/",
    // next-intl + admin logic only on app routes. Exclude /api, Next internals, /static (public), and file-like paths (e.g. /favicon.ico)
    "/((?!api|_next|_vercel|static|.*\\..*).*)",
  ],
};
