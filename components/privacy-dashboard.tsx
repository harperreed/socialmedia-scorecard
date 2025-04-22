"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PrivacyScore from "@/components/privacy-score"
import DataExposureMetrics from "@/components/data-exposure-metrics"
import PlatformSettings from "@/components/platform-settings"
import PrivacyRecommendations from "@/components/privacy-recommendations"
import { Button } from "@/components/ui/button"
import { AlertCircle, Download, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function PrivacyDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Read-Only Report</AlertTitle>
        <AlertDescription>
          This is an analysis of your current privacy settings. To change settings, you'll need to visit each platform
          directly.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div>
          <h2 className="text-2xl font-bold">Privacy Dashboard</h2>
          <p className="text-muted-foreground">Last updated: April 22, 2025</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Privacy Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <PrivacyScore score={68} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Public Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24 items</div>
            <p className="text-xs text-muted-foreground">+2 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Third-Party Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 apps</div>
            <p className="text-xs text-muted-foreground">-3 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Data Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 requests</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="facebook">Facebook</TabsTrigger>
          <TabsTrigger value="instagram">Instagram</TabsTrigger>
          <TabsTrigger value="twitter">Twitter</TabsTrigger>
          <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <DataExposureMetrics />
          <PrivacyRecommendations />
        </TabsContent>
        <TabsContent value="facebook">
          <PlatformSettings platform="facebook" />
        </TabsContent>
        <TabsContent value="instagram">
          <PlatformSettings platform="instagram" />
        </TabsContent>
        <TabsContent value="twitter">
          <PlatformSettings platform="twitter" />
        </TabsContent>
        <TabsContent value="linkedin">
          <PlatformSettings platform="linkedin" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
