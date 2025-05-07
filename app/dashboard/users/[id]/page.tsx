import { notFound } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit } from "lucide-react"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface UserViewPageProps {
  params: {
    id: string
  }
}

async function getUser(id: string): Promise<{ _id: string; createdAt: string; imageUrl?: string; name?: string; email?: string; role?: string; orders?: any[]; cart?: any[] } | null> {
  try {
    await connectToDatabase()
    const user = await User.findById(id).lean() as { _id: any; createdAt: Date; imageUrl?: string; name?: string; email?: string; role?: string; orders?: any[]; cart?: any[] } | null

    if (!user) {
      return null
    }

    return {
      ...user,
      _id: user._id.toString(),
      createdAt: user.createdAt ? user.createdAt.toISOString() : new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export default async function UserViewPage({ params }: UserViewPageProps) {
  const user = await getUser(params.id)

  if (!user) {
    notFound()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard/users">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">User Details</h1>
          </div>
          <Link href={`/dashboard/users/${params.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit User
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Detailed information about this user.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.imageUrl || ""} alt={user.name || "User"} />
                  <AvatarFallback className="text-lg">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-medium">{user.name || "Unnamed User"}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                <Badge className="mt-1" variant={user.role === "admin" ? "default" : "secondary"}>
                  {user.role || "user"}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Member Since</h3>
                <p className="text-base">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Orders</h3>
                <p className="text-base">{user.orders?.length || 0} orders</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cart Items</CardTitle>
              <CardDescription>Items currently in user's cart.</CardDescription>
            </CardHeader>
            <CardContent>
              {user.cart && user.cart.length > 0 ? (
                <div className="space-y-4">
                  {user.cart.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Product ID: {item.productId}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No items in cart</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
