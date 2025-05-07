import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Product from "@/models/Product"
import { revalidatePath } from "next/cache"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    // Delete the product
    const product = await Product.findByIdAndDelete(params.id)

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    // Revalidate the products page
    revalidatePath("/dashboard/products")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 })
  }
}
