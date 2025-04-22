import PrivacyDashboard from "@/components/privacy-dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Social Media Privacy Report</h1>
        <p className="mb-8 text-muted-foreground">
          Review and analyze your privacy settings and data exposure across social media platforms
        </p>
        <PrivacyDashboard />
      </div>
    </main>
  )
}
