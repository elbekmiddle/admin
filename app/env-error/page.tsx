import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function EnvErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <CardTitle>Environment Configuration Error</CardTitle>
          </div>
          <CardDescription>The application is missing required environment variables.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            To fix this issue, please make sure the following environment variables are set in your deployment
            environment:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">MONGODB_URI</code> - MongoDB connection string
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">CLOUDINARY_CLOUD_NAME</code> - Cloudinary cloud name
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">CLOUDINARY_API_KEY</code> - Cloudinary API key
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">CLOUDINARY_API_SECRET</code> - Cloudinary API secret
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            For local development, add these variables to your <code>.env.local</code> file. For production, add them to
            your hosting provider&apos;s environment variables configuration.
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/dashboard" className="w-full">
            <Button className="w-full">Try Again</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
