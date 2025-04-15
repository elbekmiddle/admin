import { NextResponse } from "next/server"
import { parse } from "csv-parse/sync"
import clientPromise from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Read the file content
    const fileContent = await file.text()

    // Parse CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    // Validate and transform records
    const products = records.map((record: any) => {
      // Basic validation
      if (!record.name) throw new Error("Product name is required")
      if (!record.price || isNaN(Number(record.price))) throw new Error("Valid price is required")
      if (!record.stock || isNaN(Number(record.stock))) throw new Error("Valid stock is required")

      return {
        name: record.name,
        description: record.description || "",
        price: Number(record.price),
        category: record.category || "Uncategorized",
        stock: Number(record.stock),
        sku: record.sku || "",
        status: record.status || "In Stock",
        imageUrls: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })

    // Insert into database
    const client = await clientPromise
    const db = client.db("ecommerce")
    const result = await db.collection("products").insertMany(products)

    return NextResponse.json({
      success: true,
      imported: result.insertedCount,
    })
  } catch (error) {
    console.error("Error importing products:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to import products" },
      { status: 500 },
    )
  }
}
