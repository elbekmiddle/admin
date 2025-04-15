import clientPromise from "./mongodb"
import type { Product } from "./db-schema"

export async function getDatabase() {
  const client = await clientPromise
  return client.db("ecommerce")
}

// Product functions
export async function getProducts() {
  const db = await getDatabase()
  return db.collection("products").find({}).sort({ createdAt: -1 }).toArray()
}

export async function getProduct(id: string) {
  const db = await getDatabase()
  return db.collection("products").findOne({ _id: id })
}

export async function createProduct(productData: Omit<Product, "_id" | "createdAt" | "updatedAt">) {
  const db = await getDatabase()
  const now = new Date()

  const product = {
    ...productData,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection("products").insertOne(product)
  return { id: result.insertedId, ...product }
}

export async function updateProduct(id: string, productData: Partial<Product>) {
  const db = await getDatabase()
  const now = new Date()

  const result = await db.collection("products").updateOne(
    { _id: id },
    {
      $set: {
        ...productData,
        updatedAt: now,
      },
    },
  )

  return result.modifiedCount > 0
}

export async function deleteProduct(id: string) {
  const db = await getDatabase()
  const result = await db.collection("products").deleteOne({ _id: id })
  return result.deletedCount > 0
}

// Order functions
export async function getOrders() {
  const db = await getDatabase()
  return db.collection("orders").find({}).sort({ createdAt: -1 }).toArray()
}

export async function getOrder(id: string) {
  const db = await getDatabase()
  return db.collection("orders").findOne({ _id: id })
}

// Customer functions
export async function getCustomers() {
  const db = await getDatabase()
  return db.collection("customers").find({}).sort({ createdAt: -1 }).toArray()
}

export async function getCustomer(id: string) {
  const db = await getDatabase()
  return db.collection("customers").findOne({ _id: id })
}
