import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PrivacyDashboard from "@/components/privacy-dashboard";
import ConnectedDashboard from "@/components/connected-dashboard";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Social Media Privacy Report</h1>
        <p className="mb-8 text-muted-foreground">
          Review and analyze your privacy settings and data exposure across social media platforms
        </p>
        
        <Tabs defaultValue="connected" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="connected">Connected Dashboard</TabsTrigger>
            <TabsTrigger value="demo">Demo Dashboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connected">
            <ConnectedDashboard />
          </TabsContent>
          
          <TabsContent value="demo">
            <PrivacyDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}