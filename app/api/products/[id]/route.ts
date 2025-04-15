import { type NextRequest, NextResponse } from "next/server"
import { getProduct, updateProduct, deleteProduct } from "@/lib/db"
import { deleteImage } from "@/lib/cloudinary"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await getProduct(params.id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const existingProduct = await getProduct(params.id)

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Handle image updates if needed
    if (data.imageUrls && existingProduct.imageUrls) {
      // Find images that were removed
      const removedImages = existingProduct.imageUrls.filter((url: string) => !data.imageUrls.includes(url))

      // Delete removed images from Cloudinary
      for (const imageUrl of removedImages) {
        // Extract public ID from Cloudinary URL
        const publicId = imageUrl.split("/").pop()?.split(".")[0]
        if (publicId) {
          await deleteImage(`ecommerce/${publicId}`)
        }
      }
    }

    const success = await updateProduct(params.id, data)

    if (!success) {
      return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await getProduct(params.id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Delete product images from Cloudinary
    if (product.imageUrls && product.imageUrls.length > 0) {
      for (const imageUrl of product.imageUrls) {
        // Extract public ID from Cloudinary URL
        const publicId = imageUrl.split("/").pop()?.split(".")[0]
        if (publicId) {
          await deleteImage(`ecommerce/${publicId}`)
        }
      }
    }

    const success = await deleteProduct(params.id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
