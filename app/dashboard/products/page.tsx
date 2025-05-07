import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, MoreHorizontal, Edit, Trash, Eye } from "lucide-react"
import { connectToDatabase } from "@/lib/mongodb"
import Product from "@/models/Product"
import Category from "@/models/Category"
import { formatPrice } from "@/lib/utils"

export const dynamic = "force-dynamic"
export const revalidate = 0

async function getProducts() {
  try {
    await connectToDatabase()

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean() as unknown as Array<{
        _id: unknown
        categoryId: unknown
        title: string
        price: number
        status?: string
        imageUrl?: string
      }>

    const categoryIds = products
      .map((product) => product.categoryId)
      .filter((id) => id !== undefined && id !== null)

    const categories = await Category.find({ _id: { $in: categoryIds } }).lean()

    const categoryMap = categories.reduce((map: Record<string, string>, category) => {
      if (category._id && typeof category._id.toString === 'function') {
        map[category._id.toString()] = category.label
      }
      return map
    }, {})

    const productsWithCategories = products.map((product) => ({
      ...product,
      _id: product._id?.toString?.() || '',
      categoryId: product.categoryId?.toString?.() || '',
      categoryName: product.categoryId ? categoryMap[product.categoryId.toString()] || "Unknown Category" : "Unknown Category",
      status: product.status || 'unknown',
    }))

    return productsWithCategories
  } catch (error) {
      console.error("Error fetching products:", error)
    return []
  }
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Products</h1>
          <Link href="/dashboard/products/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product List</CardTitle>
            <CardDescription>Manage your products, edit details, or remove products from your store.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search products..." className="pl-8" />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No products found. Add your first product!
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell>
                          {product.imageUrl ? (
                            <div className="h-10 w-10 rounded-md overflow-hidden">
                              <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-muted" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{product.title}</TableCell>
                        <TableCell>{product.categoryName}</TableCell>
                        <TableCell>{formatPrice(product.price)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              product.status === "active"
                                ? "default"
                                : product.status === "draft"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {product.status
                              ? product.status.charAt(0).toUpperCase() + product.status.slice(1)
                              : "Unknown"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/products/${product._id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/products/${product._id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <form action={`/api/products/${product._id}/delete`} method="POST">
                                  <button type="submit" className="flex items-center w-full">
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                  </button>
                                </form>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
