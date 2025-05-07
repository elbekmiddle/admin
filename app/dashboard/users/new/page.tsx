import { DashboardLayout } from "@/components/dashboard-layout"
import { UserForm } from "@/components/user-form"

export default function NewUserPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Add New User</h1>
        </div>

        <UserForm />
      </div>
    </DashboardLayout>
  )
}
