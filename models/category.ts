import mongoose, { Schema, type Document, type Model } from "mongoose"

// Interface for Category document
export interface ICategory extends Document {
  value: string
  label: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

// Category schema definition
const CategorySchema = new Schema<ICategory>(
  {
    value: {
      type: String,
      required: [true, "Value is required"],
      unique: true,
      trim: true,
      minlength: [2, "Value must be at least 2 characters"],
      maxlength: [50, "Value cannot exceed 50 characters"],
    },
    label: {
      type: String,
      required: [true, "Label is required"],
      trim: true,
      minlength: [2, "Label must be at least 2 characters"],
      maxlength: [100, "Label cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
)

// Index for faster queries
CategorySchema.index({ value: 1 }, { unique: true })
CategorySchema.index({ label: 1 })

// Pre-save hook for additional validation
CategorySchema.pre<ICategory>("save", (next) => {
  // You can add any pre-save logic here
  next()
})

// Type for Category model
type CategoryModel = Model<ICategory>

// Export the model
const Category: CategoryModel =
  (mongoose.models.Category as CategoryModel) || mongoose.model<ICategory, CategoryModel>("Category", CategorySchema)

export default Category
