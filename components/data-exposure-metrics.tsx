"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const exposureData = [
  {
    category: "Personal Information",
    exposed: 65,
    items: [
      { name: "Full Name", platforms: ["Facebook", "LinkedIn", "Twitter", "Instagram"] },
      { name: "Profile Picture", platforms: ["Facebook", "LinkedIn", "Twitter", "Instagram"] },
      { name: "Location", platforms: ["Facebook", "LinkedIn"] },
      { name: "Email Address", platforms: ["LinkedIn"] },
      { name: "Phone Number", platforms: [] },
    ],
  },
  {
    category: "Activity Data",
    exposed: 78,
    items: [
      { name: "Posts & Comments", platforms: ["Facebook", "Twitter", "Instagram"] },
      { name: "Likes & Reactions", platforms: ["Facebook", "Instagram"] },
      { name: "Shared Content", platforms: ["Facebook", "LinkedIn", "Twitter"] },
      { name: "Tagged Photos", platforms: ["Facebook", "Instagram"] },
    ],
  },
  {
    category: "Connection Data",
    exposed: 92,
    items: [
      { name: "Friends & Connections", platforms: ["Facebook", "LinkedIn"] },
      { name: "Following/Followers", platforms: ["Twitter", "Instagram", "LinkedIn"] },
      { name: "Groups & Communities", platforms: ["Facebook", "LinkedIn"] },
    ],
  },
  {
    category: "Behavioral Data",
    exposed: 45,
    items: [
      { name: "Browsing History", platforms: ["Facebook"] },
      { name: "Ad Interactions", platforms: ["Facebook", "Instagram", "Twitter"] },
      { name: "Search History", platforms: [] },
    ],
  },
]

export default function DataExposureMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Exposure Analysis</CardTitle>
        <CardDescription>Overview of your personal data exposure across social platforms</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {exposureData.map((category) => (
            <div key={category.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{category.category}</h3>
                <span className="text-sm text-muted-foreground">{category.exposed}% exposed</span>
              </div>
              <Progress value={category.exposed} className="h-2" />
              <div className="mt-2 space-y-1">
                {category.items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <span>{item.name}</span>
                    <div className="flex items-center">
                      <span
                        className={`mr-2 h-2 w-2 rounded-full ${item.platforms.length > 0 ? "bg-orange-500" : "bg-green-500"}`}
                      ></span>
                      <span className="text-xs text-muted-foreground">
                        {item.platforms.length > 0
                          ? `Visible on ${item.platforms.length} platform${item.platforms.length > 1 ? "s" : ""}`
                          : "Not visible"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
