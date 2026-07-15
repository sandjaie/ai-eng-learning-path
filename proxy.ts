import { NextResponse, type NextRequest } from "next/server";
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
