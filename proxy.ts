import { NextResponse, type NextRequest } from "next/server";
import { isDevAutoLoginEnabled } from "@/lib/dev-auth";
import { updateSession } from "@/lib/supabase/middleware";

function redirectPreservingCookies(url: URL, sessionResponse: NextResponse) {
  const redirect = NextResponse.redirect(url);
  sessionResponse.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const path = request.nextUrl.pathname;
  const isPublic = path === "/login" || path.startsWith("/auth/");
  const devAutoLogin = isDevAutoLoginEnabled({
    NODE_ENV: process.env.NODE_ENV,
    DEV_AUTO_LOGIN: process.env.DEV_AUTO_LOGIN,
    DEV_LOGIN_PASSWORD: process.env.DEV_LOGIN_PASSWORD,
    ALLOWED_EMAIL: process.env.ALLOWED_EMAIL,
  });

  // Local bypass: protected routes → password sign-in. Leave /login alone so failures
  // can show an error instead of looping back into /auth/dev-login.
  if (!user && devAutoLogin && !isPublic) {
    return redirectPreservingCookies(new URL("/auth/dev-login", request.url), response);
  }
  if (!user && !isPublic) {
    return redirectPreservingCookies(new URL("/login", request.url), response);
  }
  if (user && user.email !== process.env.ALLOWED_EMAIL && !path.startsWith("/auth/signout")) {
    return redirectPreservingCookies(new URL("/auth/signout", request.url), response);
  }
  if (user && path === "/login") {
    return redirectPreservingCookies(new URL("/", request.url), response);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
