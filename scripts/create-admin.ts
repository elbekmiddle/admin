import { MongoClient } from "mongodb"
import { hash } from "bcrypt"

// This script creates an admin user in the database
// Run it with: npx tsx scripts/create-admin.ts

async function createAdminUser() {
  // Replace with your MongoDB connection string
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error("MONGODB_URI environment variable is not set")
    process.exit(1)
  }

  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("ecommerce")
    const usersCollection = db.collection("users")

    // Check if admin user already exists
    const existingAdmin = await usersCollection.findOne({ email: "admin@example.com" })

    if (existingAdmin) {
      console.log("Admin user already exists")
      return
    }

    // Create admin user
    const hashedPassword = await hash("adminpassword", 10)

    await usersCollection.insertOne({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
    })

    console.log("Admin user created successfully")
  } catch (error) {
    console.error("Error creating admin user:", error)
  } finally {
    await client.close()
    console.log("MongoDB connection closed")
  }
}

createAdminUser()
