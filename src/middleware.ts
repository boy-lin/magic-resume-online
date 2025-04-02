import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { updateSession } from "@/utils/supabase/middleware";

import { routing } from "./i18n/routing.public";

const i18nMatcher = ["/", "/zh", "/en", "/zh/changelog"];

export default async function middleware(request: NextRequest) {
  // request.headers.;

  const pathname = request.nextUrl.pathname;
  console.log("middleware:request.url", request.nextUrl.pathname);

  if (i18nMatcher.includes(pathname)) {
    const i18nMiddleware = createMiddleware(routing);
    return i18nMiddleware(request);
  }

  return await updateSession(request);

  // if (!res.data.user) {
  //   return NextResponse.redirect(new URL("/account/signin", request.url));
  // }

  // return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!account/signup|account/signin|account/forgot-pwd|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|webmanifest)$).*)",
    // "/",
    // "/(zh|en)/:path*",
    // {
    //   source: "/app/:path*"
    // },
  ],
};
