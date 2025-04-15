"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data - in a real app, this would come from MongoDB
const products = [
  {
    id: "1",
    name: "Premium Headphones",
    price: 199.99,
    category: "Electronics",
    stock: 45,
    image: "/placeholder.svg?height=40&width=40",
    status: "In Stock",
  },
  {
    id: "2",
    name: "Wireless Keyboard",
    price: 59.99,
    category: "Electronics",
    stock: 32,
    image: "/placeholder.svg?height=40&width=40",
    status: "In Stock",
  },
  {
    id: "3",
    name: "Ergonomic Mouse",
    price: 39.99,
    category: "Electronics",
    stock: 18,
    image: "/placeholder.svg?height=40&width=40",
    status: "Low Stock",
  },
  {
    id: "4",
    name: "4K Monitor",
    price: 349.99,
    category: "Electronics",
    stock: 7,
    image: "/placeholder.svg?height=40&width=40",
    status: "Low Stock",
  },
  {
    id: "5",
    name: "Laptop Stand",
    price: 29.99,
    category: "Accessories",
    stock: 0,
    image: "/placeholder.svg?height=40&width=40",
    status: "Out of Stock",
  },
  {
    id: "6",
    name: "Bluetooth Speaker",
    price: 79.99,
    category: "Electronics",
    stock: 23,
    image: "/placeholder.svg?height=40&width=40",
    status: "In Stock",
  },
  {
    id: "7",
    name: "USB-C Hub",
    price: 49.99,
    category: "Accessories",
    stock: 15,
    image: "/placeholder.svg?height=40&width=40",
    status: "In Stock",
  },
]

export function ProductsTable() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId],
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Out of Stock":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                onChange={() => {
                  if (selectedProducts.length === products.length) {
                    setSelectedProducts([])
                  } else {
                    setSelectedProducts(products.map((product) => product.id))
                  }
                }}
                checked={selectedProducts.length === products.length && products.length > 0}
              />
            </TableHead>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => toggleProductSelection(product.id)}
                />
              </TableCell>
              <TableCell>
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={40}
                  height={40}
                  className="rounded-md object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(product.status)} variant="outline">
                  {product.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href={`/products/${product.id}`} className="flex items-center">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
