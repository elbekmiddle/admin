import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongoose"
import Product from "@/models/product"
import { uploadImage } from "@/lib/cloudinary"

export async function GET(request: Request) {
  try {
    await dbConnect()

    // Get query parameters
    const url = new URL(request.url)
    const category = url.searchParams.get("category")
    const featured = url.searchParams.get("featured")
    const search = url.searchParams.get("search")
    const limit = Number.parseInt(url.searchParams.get("limit") || "50")
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    // Build query
    const query: any = {}
    if (category) query.category = category
    if (featured === "true") query.featured = true
    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Execute query
    const products = await Product.find(query)
      .populate("category", "value label")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Product.countDocuments(query)

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products", details: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Connect to database
    await dbConnect()
    console.log("Connected to MongoDB")

    // Parse request body
    const data = await request.json()
    console.log("Received product data:", data)

    // Handle image uploads if present
    if (data.imageUrls && data.imageUrls.length > 0) {
      console.log("Processing images:", data.imageUrls.length)
      try {
        const uploadPromises = data.imageUrls.map((image: string) => {
          // Skip already uploaded images (those that start with http)
          if (image.startsWith("http")) {
            return image
          }
          return uploadImage(image)
        })
        data.imageUrls = await Promise.all(uploadPromises)
        console.log("Images processed successfully")
      } catch (imageError) {
        console.error("Error uploading images:", imageError)
        return NextResponse.json({ error: "Failed to upload images", details: imageError.message }, { status: 500 })
      }
    }

    // Create product
    console.log("Creating product in database")
    const product = new Product(data)
    const savedProduct = await product.save()
    console.log("Product saved successfully:", savedProduct._id)

    return NextResponse.json(savedProduct, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      {
        error: "Failed to create product",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
