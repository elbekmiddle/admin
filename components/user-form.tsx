"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ImageUpload } from "@/components/image-upload"
import { updateUser, createUser } from "@/lib/actions"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters.",
    })
    .optional()
    .or(z.literal("")),
  role: z.enum(["user", "admin"], {
    required_error: "Please select a role.",
  }),
  imageUrl: z.string().optional(),
})

interface UserFormProps {
  initialData?: any
  isEditing?: boolean
}

export function UserForm({ initialData, isEditing = false }: UserFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.imageUrl || null)

  // For editing, make password optional
  const validationSchema = isEditing
    ? formSchema
    : formSchema.extend({
        password: z.string().min(6, {
          message: "Password must be at least 6 characters.",
        }),
      })

  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      password: "",
      role: initialData?.role || "user",
      imageUrl: initialData?.imageUrl || "",
    },
  })

  const onSubmit = async (values: z.infer<typeof validationSchema>) => {
    try {
      setIsSubmitting(true)

      // Add the image URL to the form values
      if (imageUrl) {
        values.imageUrl = imageUrl
      }

      if (isEditing) {
        // Update existing user
        const result = await updateUser(initialData._id, values)

        if (result.success) {
          toast.success("User updated successfully")
          router.push("/dashboard/users")
          router.refresh()
        } else {
          toast.error(result.error || "Failed to update user")
        }
      } else {
        // Create new user
        const result = await createUser(values)

        if (result.success) {
          toast.success("User created successfully")
          router.push("/dashboard/users")
          router.refresh()
        } else {
          toast.error(result.error || "Failed to create user")
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
              <CardTitle>User Information</CardTitle>
              <CardDescription>Enter the basic information about the user.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="User name" {...field} />
                    </FormControl>
                    <FormDescription>The full name of the user.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="user@example.com" {...field} />
                    </FormControl>
                    <FormDescription>The email address of the user.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEditing ? "New Password (leave blank to keep current)" : "Password"}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormDescription>
                      {isEditing
                        ? "Enter a new password only if you want to change it."
                        : "The password must be at least 6 characters."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Set the user's role and permissions.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Image</CardTitle>
              <CardDescription>Upload a profile image for the user.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUpload onImageChange={handleImageChange} defaultImage={initialData?.imageUrl} />
              <p className="text-xs text-muted-foreground">
                Recommended image size: 400 x 400 pixels. Max file size: 2MB.
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
              {isSubmitting ? (isEditing ? "Updating..." : "Creating...") : isEditing ? "Update User" : "Create User"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
