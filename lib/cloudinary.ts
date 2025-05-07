import { v2 as cloudinary } from "cloudinary"

// Check if Cloudinary credentials are available
const hasCloudinaryConfig =
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET

// Only configure if all credentials are available
if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
} else {
  console.warn("Cloudinary credentials are not fully defined. Image uploads will not work.")
}

export async function uploadImage(file: string): Promise<string> {
  try {
    // Check if Cloudinary is configured
    if (!hasCloudinaryConfig) {
      console.warn("Cloudinary is not configured. Returning placeholder image.")
      return "https://via.placeholder.com/500x500?text=Image+Placeholder"
    }

    const result = await cloudinary.uploader.upload(file, {
      folder: "e-commerce",
    })
    return result.secure_url
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)
    // Return a placeholder image instead of throwing an error
    return "https://via.placeholder.com/500x500?text=Upload+Failed"
  }
}

export default cloudinary
