import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const searchParams = req.nextUrl.searchParams
    const query: any = {}

    // Handle filtering by role
    const role = searchParams.get("role")
    if (role) {
      query.role = role
    }

    // Handle pagination
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Get users (exclude password)
    const users = await User.find(query, { password: 0 }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()

    // Get total count for pagination
    const total = await User.countDocuments(query)

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()

    const body = await req.json()

    // Check if user with same email already exists
    const existingUser = await User.findOne({ email: body.email })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10)
    }

    // Create new user
    const user = await User.create(body)

    // Return user without password
    const userWithoutPassword = { ...user.toObject() }
    delete userWithoutPassword.password

    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
