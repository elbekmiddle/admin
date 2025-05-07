// Environment variable configuration with fallbacks

// MongoDB
export const MONGODB_URI = process.env.MONGODB_URI || ""

// Cloudinary
export const CLOUDINARY = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  apiKey: process.env.CLOUDINARY_API_KEY || "",
  apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  isConfigured: !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ),
}

// Authentication
export const AUTH = {
  jwtSecret: process.env.JWT_SECRET || "fallback-jwt-secret-do-not-use-in-production",
  nextAuthSecret: process.env.NEXTAUTH_SECRET || "fallback-nextauth-secret-do-not-use-in-production",
  nextAuthUrl: process.env.NEXTAUTH_URL || "http://localhost:3001",
}

// Environment
export const IS_PRODUCTION = process.env.NODE_ENV === "production"
export const IS_DEVELOPMENT = process.env.NODE_ENV === "development"
export const IS_TEST = process.env.NODE_ENV === "test"

// Check if all required environment variables are set
export const checkRequiredEnvVars = () => {
  const missingVars = []

  if (!MONGODB_URI) missingVars.push("MONGODB_URI")
  if (!CLOUDINARY.cloudName) missingVars.push("CLOUDINARY_CLOUD_NAME")
  if (!CLOUDINARY.apiKey) missingVars.push("CLOUDINARY_API_KEY")
  if (!CLOUDINARY.apiSecret) missingVars.push("CLOUDINARY_API_SECRET")

  return {
    allPresent: missingVars.length === 0,
    missingVars,
  }
}
