import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const user = await User.findById(params.id, { password: 0 }).lean()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const body = await req.json()

    // If email is being updated, check if it already exists
    if (body.email) {
      const existingUser = await User.findOne({
        email: body.email,
        _id: { $ne: params.id },
      })

      if (existingUser) {
        return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
      }
    }

    // Hash password if it's being updated
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10)
    }

    const user = await User.findByIdAndUpdate(params.id, { $set: body }, { new: true, runValidators: true })
      .select("-password")
      .lean()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const user = await User.findByIdAndDelete(params.id).lean()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
