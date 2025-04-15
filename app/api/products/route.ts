import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { uploadImage } from "@/lib/cloudinary"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("ecommerce")

    const products = await db.collection("products").find({}).toArray()

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("ecommerce")

    const data = await request.json()

    // Handle image uploads if present
    if (data.images && data.images.length > 0) {
      const uploadPromises = data.images.map((image: string) => uploadImage(image))
      data.imageUrls = await Promise.all(uploadPromises)
    }

    const result = await db.collection("products").insertOne(data)

    return NextResponse.json({ id: result.insertedId, ...data }, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
