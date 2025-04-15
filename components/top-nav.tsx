"use client"

import Link from "next/link"
import { useState } from "react"
import { Package, Menu, X, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function TopNav() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <Package className="h-6 w-6" />
            <span className="font-semibold">Admin</span>
          </Link>
        </div>

        <nav
          className={`${
            showMobileMenu ? "flex" : "hidden"
          } absolute left-0 top-[60px] z-50 w-full flex-col border-b bg-background p-4 lg:static lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-6 lg:border-0 lg:p-0`}
        >
          {/* Mobile navigation items */}
          <div className="lg:hidden space-y-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-2 text-lg font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              Products
            </Link>
            <Link
              href="/orders"
              className="flex items-center gap-2 text-lg font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              Orders
            </Link>
            <Link
              href="/customers"
              className="flex items-center gap-2 text-lg font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              Customers
            </Link>
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <User className="h-4 w-4" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
