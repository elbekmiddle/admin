import { notFound } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit } from "lucide-react"
import { connectToDatabase } from "@/lib/mongodb"
import Product from "@/models/Product"
import Category from "@/models/Category"
import { formatPrice } from "@/lib/utils"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface ProductViewPageProps {
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

    // Get category name
    const category = await Category.findById(product.categoryId).lean()

    return {
      ...product,
      _id: product._id.toString(),
      categoryId: product.categoryId.toString(),
      categoryName: category ? category.label : "Unknown Category",
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export default async function ProductViewPage({ params }: ProductViewPageProps) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard/products">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Product Details</h1>
          </div>
          <Link href={`/dashboard/products/${params.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Detailed information about this product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Title</h3>
                <p className="text-base">{product.title}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="text-base whitespace-pre-wrap">{product.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
                  <p className="text-base">{formatPrice(product.price)}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <Badge
                    className="mt-1"
                    variant={
                      product.status === "active" ? "default" : product.status === "draft" ? "secondary" : "outline"
                    }
                  >
                    {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                <p className="text-base">{product.categoryName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                  <p className="text-base">{new Date(product.createdAt).toLocaleDateString()}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                  <p className="text-base">{new Date(product.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              {product.imageUrl ? (
                <div className="relative w-full h-64 overflow-hidden rounded-md">
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-64 bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">No image available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
