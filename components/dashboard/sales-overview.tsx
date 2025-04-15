"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard/overview"

// In a real app, this would come from your API
const salesData = {
  daily: [
    { name: "12AM", total: 400 },
    { name: "3AM", total: 300 },
    { name: "6AM", total: 200 },
    { name: "9AM", total: 278 },
    { name: "12PM", total: 189 },
    { name: "3PM", total: 239 },
    { name: "6PM", total: 349 },
    { name: "9PM", total: 491 },
  ],
  weekly: [
    { name: "Mon", total: 4000 },
    { name: "Tue", total: 3000 },
    { name: "Wed", total: 2000 },
    { name: "Thu", total: 2780 },
    { name: "Fri", total: 1890 },
    { name: "Sat", total: 2390 },
    { name: "Sun", total: 3490 },
  ],
  monthly: [
    { name: "Jan", total: 4000 },
    { name: "Feb", total: 3000 },
    { name: "Mar", total: 2000 },
    { name: "Apr", total: 2780 },
    { name: "May", total: 1890 },
    { name: "Jun", total: 2390 },
    { name: "Jul", total: 3490 },
    { name: "Aug", total: 4000 },
    { name: "Sep", total: 3300 },
    { name: "Oct", total: 2900 },
    { name: "Nov", total: 3800 },
    { name: "Dec", total: 4300 },
  ],
}

export function SalesOverview() {
  const [period, setPeriod] = useState("weekly")

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>View your sales performance over time</CardDescription>
        <Tabs defaultValue="weekly" className="mt-2" onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pl-2">
        <Overview data={salesData[period as keyof typeof salesData]} />
      </CardContent>
    </Card>
  )
}
