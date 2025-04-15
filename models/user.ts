import mongoose, { Schema, type Document, type Model } from "mongoose"
import { hash, compare } from "bcryptjs" // Changed from bcrypt to bcryptjs

// Interface for User document
export interface IUser extends Document {
  name: string
  email: string
  password: string
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
  orders?: string[]
  role: "user" | "admin"
  cart?: Array<{
    productId: mongoose.Types.ObjectId
    quantity: number
  }>
  comparePassword(candidatePassword: string): Promise<boolean>
}

// User schema definition
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Don't include password in query results by default
    },
    imageUrl: String,
    orders: [String],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    cart: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1, min: 1 },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
)

// Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    this.password = await hash(this.password, 10)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return compare(candidatePassword, this.password)
}

// Index for faster queries
UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ role: 1 })

// Type for User model
type UserModel = Model<IUser>

// Check if the model exists to prevent overwriting during hot reloads
const User: UserModel = (mongoose.models.User as UserModel) || mongoose.model<IUser, UserModel>("User", UserSchema)

export default User
