"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ImageUpload } from "@/components/image-upload"
import { updateProduct, createProduct } from "@/lib/actions"
import { toast } from "sonner"

const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(100, {
      message: "Title cannot exceed 100 characters.",
    }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(1000, {
      message: "Description cannot exceed 1000 characters.",
    }),
  price: z.coerce.number().min(0, {
    message: "Price cannot be negative.",
  }),
  categoryId: z.string({
    required_error: "Please select a category.",
  }),
  status: z.enum(["active", "inactive", "draft"], {
    required_error: "Please select a status.",
  }),
  imageUrl: z.string().optional(),
})

interface Category {
  _id: string
  label: string
  value: string
}

interface ProductFormProps {
  initialData?: any
  categories: Category[]
  isEditing?: boolean
}

export function ProductForm({ initialData, categories, isEditing = false }: ProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.imageUrl || null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      price: 0,
      status: "draft",
      imageUrl: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)

      // Add the image URL to the form values
      if (imageUrl) {
        values.imageUrl = imageUrl
      }

      if (isEditing) {
        // Update existing product
        const result = await updateProduct(initialData._id, values)

        if (result.success) {
          toast.success("Product updated successfully")
          router.push("/dashboard/products")
          router.refresh()
        } else {
          toast.error(result.error || "Failed to update product")
        }
      } else {
        // Create new product
        const result = await createProduct(values)

        if (result.success) {
          toast.success("Product created successfully")
          router.push("/dashboard/products")
          router.refresh()
        } else {
          toast.error(result.error || "Failed to create product")
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (url: string | null) => {
    setImageUrl(url)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Enter the basic information about your product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Product title" {...field} />
                    </FormControl>
                    <FormDescription>The name of your product as it will appear in the store.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your product" className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormDescription>Provide a detailed description of your product.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>Set the price for your product.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Choose the category that best fits your product.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Set the current status of your product.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
              <CardDescription>Upload an image for your product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUpload onImageChange={handleImageChange} defaultImage={initialData?.imageUrl} />
              <p className="text-xs text-muted-foreground">
                Recommended image size: 1200 x 1200 pixels. Max file size: 5MB.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardFooter className="flex justify-end gap-2 pt-6">
            <Button variant="outline" type="button" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                  ? "Update Product"
                  : "Create Product"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
