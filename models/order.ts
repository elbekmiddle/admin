import mongoose, { Schema, type Document, type Model } from "mongoose"

// Interface for Order document
export interface IOrder extends Document {
  orderNumber: string
  user: mongoose.Types.ObjectId
  items: Array<{
    product: mongoose.Types.ObjectId
    name: string
    price: number
    quantity: number
    imageUrl?: string
  }>
  totalAmount: number
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
    phone?: string
  }
  paymentMethod: string
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded"
  orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled"
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Order schema definition
const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        imageUrl: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      phone: String,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    notes: String,
  },
  {
    timestamps: true,
  },
)

// Indexes for faster queries
OrderSchema.index({ orderNumber: 1 }, { unique: true })
OrderSchema.index({ user: 1 })
OrderSchema.index({ paymentStatus: 1 })
OrderSchema.index({ orderStatus: 1 })
OrderSchema.index({ createdAt: -1 })

// Generate a unique order number before saving
OrderSchema.pre<IOrder>("save", async function (next) {
  if (!this.orderNumber) {
    // Generate a unique order number (e.g., ORD-YYYYMMDD-XXXX)
    const date = new Date()
    const dateStr =
      date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      date.getDate().toString().padStart(2, "0")

    // Get the count of orders for today to generate a sequential number
    const Order = mongoose.model("Order")
    const count = await Order.countDocuments({
      orderNumber: { $regex: `^ORD-${dateStr}` },
    })

    this.orderNumber = `ORD-${dateStr}-${(count + 1).toString().padStart(4, "0")}`
  }
  next()
})

// Type for Order model
type OrderModel = Model<IOrder>

// Check if the model exists to prevent overwriting during hot reloads
const Order: OrderModel =
  (mongoose.models.Order as OrderModel) || mongoose.model<IOrder, OrderModel>("Order", OrderSchema)

export default Order
