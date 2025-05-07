import { notFound } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import { UserForm } from "@/components/user-form"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface UserEditPageProps {
  params: {
    id: string
  }
}

async function getUser(id: string) {
  try {
    await connectToDatabase()
    const user = await User.findById(id).lean()

    if (!user) {
      return null
    }

    return {
      ...user,
      _id: user._id.toString(),
    }
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export default async function UserEditPage({ params }: UserEditPageProps) {
  const user = await getUser(params.id)

  if (!user) {
    notFound()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Edit User</h1>
        </div>

        <UserForm initialData={user} isEditing={true} />
      </div>
    </DashboardLayout>
  )
}
