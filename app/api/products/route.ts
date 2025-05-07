import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Product from "@/models/Product"

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const searchParams = req.nextUrl.searchParams
    const query: any = {}

    // Handle filtering by status
    const status = searchParams.get("status")
    if (status) {
      query.status = status
    }

    // Handle filtering by category
    const categoryId = searchParams.get("categoryId")
    if (categoryId) {
      query.categoryId = categoryId
    }

    // Handle pagination
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    try {
      // Get products
      const products = await Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()

      // Get total count for pagination
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
    } catch (dbError) {
      console.error("Database operation failed:", dbError)
      // Return empty results instead of failing
      return NextResponse.json({
        products: [],
        pagination: {
          total: 0,
          page,
          limit,
          pages: 0,
        },
      })
    }
  } catch (error) {
    console.error("Error in products API:", error)
    return NextResponse.json({ error: "Failed to fetch products", details: String(error) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()

    const body = await req.json()

    try {
      // Create new product
      const product = await Product.create(body)
      return NextResponse.json(product, { status: 201 })
    } catch (dbError) {
      console.error("Failed to create product:", dbError)
      return NextResponse.json(
        {
          error: "Failed to create product",
          details: String(dbError),
          message: "Database operation failed. Check your MongoDB connection.",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in products API:", error)
    return NextResponse.json({ error: "Failed to create product", details: String(error) }, { status: 500 })
  }
}
