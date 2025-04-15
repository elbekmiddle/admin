import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public paths that don't require authentication
  const publicPaths = ["/auth/login", "/auth/register", "/auth/forgot-password"]
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  // Check if the path is for API routes
  if (pathname.startsWith("/api")) {
    // For API routes, we'll let the API handlers handle authentication
    return NextResponse.next()
  }

  // Check if the path is for Next.js resources
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico") || pathname.includes(".")) {
    return NextResponse.next()
  }

  // For auth pages, redirect to dashboard if already logged in
  if (isPublicPath) {
    const token = await getToken({ req: request })
    if (token) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  // For all other routes, check if the user is authenticated
  const token = await getToken({ req: request })

  if (!token && !isPublicPath) {
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
