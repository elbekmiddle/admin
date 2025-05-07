import { NextResponse } from "next/server"

export async function GET() {
  // Check for required environment variables
  const requiredVars = ["MONGODB_URI", "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"]

  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    return NextResponse.json(
      {
        status: "error",
        message: "Missing required environment variables",
        missingVars,
      },
      { status: 500 },
    )
  }

  return NextResponse.json({
    status: "success",
    message: "All required environment variables are set",
  })
}
