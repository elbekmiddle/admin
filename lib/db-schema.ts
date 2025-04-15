// This file defines the schema for your MongoDB collections

export interface Product {
  _id?: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  sku?: string
  status: "In Stock" | "Low Stock" | "Out of Stock" | "Backorder"
  imageUrls: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  _id?: string
  orderNumber: string
  customer: {
    name: string
    email: string
    address?: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
  }
  products: Array<{
    productId: string
    name: string
    price: number
    quantity: number
  }>
  total: number
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled"
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded"
  createdAt: Date
  updatedAt: Date
}

export interface Customer {
  _id?: string
  name: string
  email: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  orders: string[] // Array of order IDs
  createdAt: Date
  updatedAt: Date
}
