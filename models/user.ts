import { Schema, model, models } from "mongoose"

const UserSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
  orders: [String],
  role: { type: String, enum: ["user", "admin"], default: "user" },
  cart: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
    },
  ],
})

// Define the IUser interface
interface IUser {
  _id: any
  name: string
  email: string
  password: string
  role?: string
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, default: "admin" },
})

const User = models?.User || model("User", UserSchema)

export default User
export type { IUser }
