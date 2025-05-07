import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Category from "@/models/Category"
import Product from "@/models/Product"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const category = await Category.findById(params.id).lean()

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const body = await req.json()

    // If value is being updated, check if it already exists
    if (body.value) {
      const existingCategory = await Category.findOne({
        value: body.value,
        _id: { $ne: params.id },
      })

      if (existingCategory) {
        return NextResponse.json({ error: "Category with this value already exists" }, { status: 400 })
      }
    }

    const category = await Category.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true },
    ).lean()

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    // Check if any products are using this category
    const productsUsingCategory = await Product.countDocuments({
      categoryId: params.id,
    })

    if (productsUsingCategory > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete category that is in use",
          productsCount: productsUsingCategory,
        },
        { status: 400 },
      )
    }

    const category = await Category.findByIdAndDelete(params.id).lean()

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
