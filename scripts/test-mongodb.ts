import mongoose from "mongoose"

async function testMongoDBConnection() {
  try {
    // Get MongoDB URI from environment variable
    const uri = process.env.MONGODB_URI

    if (!uri) {
      console.error("❌ MONGODB_URI environment variable is not set")
      process.exit(1)
    }

    console.log("🔄 Connecting to MongoDB...")

    // Connect to MongoDB
    await mongoose.connect(uri)

    console.log("✅ Successfully connected to MongoDB!")

    // Get list of collections
    const collections = await mongoose.connection.db.collections()
    console.log("\n📋 Available collections:")

    if (collections.length === 0) {
      console.log("   No collections found")
    } else {
      for (const collection of collections) {
        const count = await collection.countDocuments()
        console.log(`   - ${collection.collectionName} (${count} documents)`)
      }
    }

    // Test creating a temporary document
    console.log("\n🔄 Testing document creation...")

    const TestModel = mongoose.model(
      "TestModel",
      new mongoose.Schema({
        name: String,
        testDate: { type: Date, default: Date.now },
      }),
      "_test_connection",
    )

    const testDoc = new TestModel({ name: "Connection Test" })
    await testDoc.save()
    console.log("✅ Successfully created test document")

    // Clean up
    await mongoose.connection.db.dropCollection("_test_connection")
    console.log("🧹 Cleaned up test collection")

    console.log("\n✅ MongoDB connection is working properly!")
  } catch (error) {
    console.error("❌ MongoDB connection test failed:", error)
  } finally {
    // Close the connection
    await mongoose.disconnect()
    console.log("👋 Disconnected from MongoDB")
  }
}

testMongoDBConnection()
