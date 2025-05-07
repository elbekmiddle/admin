import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import { revalidatePath } from "next/cache"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    // Delete the user
    const user = await User.findByIdAndDelete(params.id)

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Revalidate the users page
    revalidatePath("/dashboard/users")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ success: false, error: "Failed to delete user" }, { status: 500 })
  }
}
