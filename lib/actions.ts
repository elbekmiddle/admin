"use server"

import { connectToDatabase } from "@/lib/mongodb"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import Product from "@/models/Product"
import Category from "@/models/Category"
import User from "@/models/User"
import bcrypt from "bcryptjs"

// Product actions
export async function createProduct(data: any) {
  try {
    await connectToDatabase()

    // Create product in database using the Product model
    const product = await Product.create(data)

    console.log("Created product:", product)

    revalidatePath("/dashboard/products")
    return { success: true, product }
  } catch (error) {
    console.error("Error creating product:", error)
    return {
      success: false,
      error: "Failed to create product",
      details: String(error),
    }
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    await connectToDatabase()

    // Update product in database
    const product = await Product.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })

    if (!product) {
      return {
        success: false,
        error: "Product not found",
      }
    }

    console.log("Updated product:", product)

    revalidatePath("/dashboard/products")
    return { success: true, product }
  } catch (error) {
    console.error("Error updating product:", error)
    return {
      success: false,
      error: "Failed to update product",
      details: String(error),
    }
  }
}

export async function deleteProduct(id: string) {
  try {
    await connectToDatabase()

    // Delete product from database
    const product = await Product.findByIdAndDelete(id)

    if (!product) {
      return {
        success: false,
        error: "Product not found",
      }
    }

    console.log("Deleted product:", product)

    revalidatePath("/dashboard/products")
    return { success: true }
  } catch (error) {
    console.error("Error deleting product:", error)
    return {
      success: false,
      error: "Failed to delete product",
      details: String(error),
    }
  }
}

// Category actions
export async function createCategory(formData: FormData) {
  try {
    await connectToDatabase()

    const label = formData.get("label") as string
    const value = formData.get("value") as string
    const description = formData.get("description") as string

    try {
      // Create category in database using the Category model
      const category = await Category.create({
        label,
        value,
        description,
      })

      console.log("Created category:", category)

      revalidatePath("/dashboard/categories")
      redirect("/dashboard/categories")
    } catch (dbError) {
      console.error("Database error creating category:", dbError)
      return {
        success: false,
        error: "Failed to create category in database",
        details: String(dbError),
      }
    }
  } catch (error) {
    console.error("Error creating category:", error)
    return {
      success: false,
      error: "Failed to create category",
      details: String(error),
    }
  }
}

// User actions
export async function createUser(data: any) {
  try {
    await connectToDatabase()

    // Check if user with same email already exists
    const existingUser = await User.findOne({ email: data.email })
    if (existingUser) {
      return {
        success: false,
        error: "User with this email already exists",
      }
    }

    // Hash password
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10)
    }

    // Create user in database
    const user = await User.create(data)

    console.log("Created user:", user)

    revalidatePath("/dashboard/users")
    return { success: true, user }
  } catch (error) {
    console.error("Error creating user:", error)
    return {
      success: false,
      error: "Failed to create user",
      details: String(error),
    }
  }
}

export async function updateUser(id: string, data: any) {
  try {
    await connectToDatabase()

    // Check if email is being changed and if it already exists
    if (data.email) {
      const existingUser = await User.findOne({
        email: data.email,
        _id: { $ne: id },
      })

      if (existingUser) {
        return {
          success: false,
          error: "User with this email already exists",
        }
      }
    }

    // Hash password if provided
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10)
    } else {
      // Remove password field if empty to avoid overwriting with empty string
      delete data.password
    }

    // Update user in database
    const user = await User.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })

    if (!user) {
      return {
        success: false,
        error: "User not found",
      }
    }

    console.log("Updated user:", user)

    revalidatePath("/dashboard/users")
    return { success: true, user }
  } catch (error) {
    console.error("Error updating user:", error)
    return {
      success: false,
      error: "Failed to update user",
      details: String(error),
    }
  }
}

export async function deleteUser(id: string) {
  try {
    await connectToDatabase()

    // Delete user from database
    const user = await User.findByIdAndDelete(id)

    if (!user) {
      return {
        success: false,
        error: "User not found",
      }
    }

    console.log("Deleted user:", user)

    revalidatePath("/dashboard/users")
    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    return {
      success: false,
      error: "Failed to delete user",
      details: String(error),
    }
  }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    await connectToDatabase()

    try {
      // Update user role in database using the User model
      const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true })

      console.log(`Updated user ${userId} role to ${role}`)

      revalidatePath("/dashboard/users")
      return { success: true, user: updatedUser }
    } catch (dbError) {
      console.error("Database error updating user role:", dbError)
      return {
        success: false,
        error: "Failed to update user role in database",
        details: String(dbError),
      }
    }
  } catch (error) {
    console.error("Error updating user role:", error)
    return {
      success: false,
      error: "Failed to update user role",
      details: String(error),
    }
  }
}
