import mongoose, { Schema, type Document, model } from "mongoose"

export interface IProduct extends Document {
  title: string
  description: string
  price: number
  categoryId: Schema.Types.ObjectId
  imageUrl: string
  status: "active" | "inactive" | "draft"
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      validate: {
        validator: (value: string) => {
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/.test(value)
        },
        message: "Invalid image URL format",
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Product || model<IProduct>("Product", ProductSchema)
