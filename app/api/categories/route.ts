import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Category from "@/models/Category"

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const categories = await Category.find().sort({ label: 1 }).lean()

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()

    const body = await req.json()

    // Check if category with same value already exists
    const existingCategory = await Category.findOne({ value: body.value })
    if (existingCategory) {
      return NextResponse.json({ error: "Category with this value already exists" }, { status: 400 })
    }

    // Create new category
    const category = await Category.create(body)

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
