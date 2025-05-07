"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, X } from "lucide-react"

interface ImageUploadProps {
  onImageChange: (imageUrl: string | null) => void
  defaultImage?: string
}

export function ImageUpload({ onImageChange, defaultImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null)
  const [isUploading, setIsUploading] = useState(false)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview immediately
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // In a real app, you would upload to Cloudinary here
    setIsUploading(true)
    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would get the URL from Cloudinary response
      // and pass it to the parent component
      onImageChange(preview)
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = () => {
    setPreview(null)
    onImageChange(null)
  }

  return (
    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 h-64">
      {preview ? (
        <div className="relative w-full h-full">
          <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-contain" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={removeImage}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">Drag and drop an image, or click to browse</p>
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="image-upload"
            onChange={handleImageChange}
            disabled={isUploading}
          />
          <Label htmlFor="image-upload" className="cursor-pointer">
            <Button type="button" variant="secondary" size="sm" disabled={isUploading}>
              {isUploading ? "Uploading..." : "Select Image"}
            </Button>
          </Label>
        </div>
      )}
    </div>
  )
}
