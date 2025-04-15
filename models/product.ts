import mongoose, { Schema, type Document, type Model } from "mongoose"

// Interface for Product document
export interface IProduct extends Document {
  name: string
  description: string
  price: number
  comparePrice?: number
  category: string // Changed from ObjectId to string for simplicity
  sku: string
  stock: number
  imageUrls: string[]
  status: "In Stock" | "Low Stock" | "Out of Stock" | "Backorder"
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

// Product schema definition
const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    comparePrice: {
      type: Number,
      min: [0, "Compare price cannot be negative"],
    },
    category: {
      type: String, // Changed from ObjectId to String for simplicity
      required: [true, "Category is required"],
    },
    sku: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    imageUrls: [String],
    status: {
      type: String,
      enum: ["In Stock", "Low Stock", "Out of Stock", "Backorder"],
      default: "In Stock",
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
)

// Indexes for faster queries
ProductSchema.index({ name: "text", description: "text" }) // Text search index
ProductSchema.index({ category: 1 })
ProductSchema.index({ price: 1 })
ProductSchema.index({ status: 1 })
ProductSchema.index({ featured: 1 })

// Pre-save hook to update status based on stock
ProductSchema.pre<IProduct>("save", function (next) {
  if (this.stock <= 0) {
    this.status = "Out of Stock"
  } else if (this.stock <= 5) {
    this.status = "Low Stock"
  } else {
    this.status = "In Stock"
  }
  next()
})

// Type for Product model
type ProductModel = Model<IProduct>

// Check if the model exists to prevent overwriting during hot reloads
const Product: ProductModel =
  (mongoose.models.Product as ProductModel) || mongoose.model<IProduct, ProductModel>("Product", ProductSchema)

export default Product
