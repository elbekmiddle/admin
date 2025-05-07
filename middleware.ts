import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if we're in a development environment
  const isDevelopment = process.env.NODE_ENV === "development"

  // Only run this check in development
  if (isDevelopment) {
    // Check for required environment variables
    const missingVars = []

    if (!process.env.MONGODB_URI) missingVars.push("MONGODB_URI")
    if (!process.env.CLOUDINARY_CLOUD_NAME) missingVars.push("CLOUDINARY_CLOUD_NAME")
    if (!process.env.CLOUDINARY_API_KEY) missingVars.push("CLOUDINARY_API_KEY")
    if (!process.env.CLOUDINARY_API_SECRET) missingVars.push("CLOUDINARY_API_SECRET")

    // If there are missing variables and this is an API route, show a warning
    if (missingVars.length > 0 && request.nextUrl.pathname.startsWith("/api")) {
      console.warn(`⚠️ Missing environment variables: ${missingVars.join(", ")}`)

      // For API routes, return a JSON response
      return NextResponse.json(
        {
          error: "Server configuration issue",
          message: `Missing required environment variables: ${missingVars.join(", ")}`,
          tip: "Add these variables to your .env.local file or deployment environment",
        },
        { status: 500 },
      )
    }
  }

  return NextResponse.next()
}

// Only run the middleware on API routes
export const config = {
  matcher: "/api/:path*",
}
