"use client"

import type React from "react"

import { useState } from "react"
import { Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

export function BulkImportProducts() {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if it's a CSV file
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Please upload a CSV file")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/products/bulk-import", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to import products")
      }

      const data = await response.json()

      toast({
        title: "Import successful",
        description: `${data.imported} products were imported successfully.`,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast({
        variant: "destructive",
        title: "Import failed",
        description: err instanceof Error ? err.message : "Failed to import products",
      })
    } finally {
      setIsUploading(false)
      // Reset the file input
      e.target.value = ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Import Products</CardTitle>
        <CardDescription>
          Upload a CSV file to import multiple products at once. Download the template to see the required format.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <a href="/templates/product-import-template.csv" download>
                Download Template
              </a>
            </Button>

            <div className="relative">
              <input
                type="file"
                id="csv-upload"
                accept=".csv"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              <Button disabled={isUploading}>
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload CSV"}
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>The CSV file should include the following columns:</p>
            <ul className="list-disc list-inside mt-2">
              <li>name (required)</li>
              <li>description</li>
              <li>price (required)</li>
              <li>category</li>
              <li>stock (required)</li>
              <li>sku</li>
              <li>status</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
