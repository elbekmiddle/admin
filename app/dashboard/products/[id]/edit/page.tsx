import { notFound } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { connectToDatabase } from "@/lib/mongodb"
import Product from "@/models/Product"
import Category from "@/models/Category"
import { ProductForm } from "@/components/product-form"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface ProductEditPageProps {
  params: {
    id: string
  }
}

async function getProduct(id: string) {
  try {
    await connectToDatabase()
    const product = await Product.findById(id).lean()

    if (!product) {
      return null
    }

    return {
      ...product,
      _id: product._id.toString(),
      categoryId: product.categoryId.toString(),
    }
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

async function getCategories() {
  try {
    await connectToDatabase()
    const categories = await Category.find().sort({ label: 1 }).lean()

    return categories.map((category) => ({
      ...category,
      _id: category._id.toString(),
    }))
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  const categories = await getCategories()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Edit Product</h1>
        </div>

        <ProductForm initialData={product} categories={categories} isEditing={true} />
      </div>
    </DashboardLayout>
  )
}
