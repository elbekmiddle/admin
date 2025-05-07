import mongoose from "mongoose"

// Check if we're running on the server side
const isServer = typeof window === "undefined"

// Initialize connection variable
let cached: {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
} = { conn: null, promise: null }

// If running on server side, set up global cache
if (isServer) {
  // @ts-ignore
  if (!global.mongoose) {
    // @ts-ignore
    global.mongoose = { conn: null, promise: null }
  }
  // @ts-ignore
  cached = global.mongoose
}

export async function connectToDatabase() {
  // If already connected, return the existing connection
  if (cached.conn) {
    return cached.conn
  }

  // Check for MongoDB URI
  const MONGODB_URI = process.env.MONGODB_URI

  // If no connection promise exists and we have a URI, create one
  if (!cached.promise && MONGODB_URI) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("MongoDB connected successfully")
      return mongoose
    })
  } else if (!MONGODB_URI) {
    // Handle missing MongoDB URI more gracefully
    console.warn("MongoDB URI is not defined. Database operations will not work.")

    // Return a dummy connection object that won't break the app
    // but will log errors when database operations are attempted
    return {
      connection: {
        readyState: 0, // 0 = disconnected
      },
      models: {
        User: createDummyModel("User"),
        Product: createDummyModel("Product"),
        Category: createDummyModel("Category"),
      },
    } as unknown as typeof mongoose
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error("MongoDB connection error:", e)

    // Return a dummy connection that won't break the app
    return {
      connection: {
        readyState: 0,
      },
      models: {
        User: createDummyModel("User"),
        Product: createDummyModel("Product"),
        Category: createDummyModel("Category"),
      },
    } as unknown as typeof mongoose
  }

  return cached.conn
}

// Helper function to create dummy models that log errors instead of crashing
function createDummyModel(modelName: string) {
  return {
    find: () => {
      console.error(`Database operation attempted on ${modelName} but MongoDB is not connected`)
      return {
        sort: () => ({ skip: () => ({ limit: () => ({ lean: () => [] }) }) }),
        lean: () => [],
      }
    },
    findById: () => {
      console.error(`Database operation attempted on ${modelName} but MongoDB is not connected`)
      return { lean: () => null }
    },
    findOne: () => {
      console.error(`Database operation attempted on ${modelName} but MongoDB is not connected`)
      return { lean: () => null }
    },
    countDocuments: () => {
      console.error(`Database operation attempted on ${modelName} but MongoDB is not connected`)
      return Promise.resolve(0)
    },
    create: () => {
      console.error(`Database operation attempted on ${modelName} but MongoDB is not connected`)
      return Promise.resolve(null)
    },
    findByIdAndUpdate: () => {
      console.error(`Database operation attempted on ${modelName} but MongoDB is not connected`)
      return { lean: () => null }
    },
    findByIdAndDelete: () => {
      console.error(`Database operation attempted on ${modelName} but MongoDB is not connected`)
      return { lean: () => null }
    },
  }
}
