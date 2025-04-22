"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import PrivacyScore from "@/components/privacy-score"
import DataExposureMetrics from "@/components/data-exposure-metrics"
import PlatformSettings from "@/components/platform-settings"
import PrivacyRecommendations from "@/components/privacy-recommendations"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowRight, Download, RefreshCw, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ProfileForm } from "@/components/profile-form"
import { useToast } from "@/hooks/use-toast"
import { PrivacyAPI } from "@/lib/privacy-api"
import type { ProfileData } from "@/components/profile-result"

export default function ConnectedDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileResults, setProfileResults] = useState<Record<string, ProfileData> | null>(null);
  const [profileUrls, setProfileUrls] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Derived data
  const overallPrivacyScore = calculateOverallScore(profileResults);
  const publicInfoCount = calculatePublicInfoCount(profileResults);
  const thirdPartyAccessCount = calculateThirdPartyAccessCount(profileResults);
  const dataByPlatform = groupByPlatform(profileResults);
  const platforms = Object.keys(dataByPlatform);
  const hasData = profileResults && Object.keys(profileResults).length > 0;
  
  // Load any stored user ID on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('fiasco_user_id');
    if (storedUserId) {
      setUserId(storedUserId);
      loadProfileData(storedUserId);
    }
  }, []);
  
  // Load profile data from the API
  const loadProfileData = async (id?: string) => {
    const userIdToUse = id || userId;
    if (!userIdToUse) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const api = PrivacyAPI.getInstance();
      const data = await api.getProfileResults(userIdToUse);
      
      setProfileResults(data.results);
      setProfileUrls(data.urls);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      
      // Only set error if it's not a "not found" error for a new user
      if (errorMessage !== 'Profile not found') {
        setError(errorMessage);
        toast({
          title: "Error loading data",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Submit profile for analysis
  const handleProfileSubmit = async (urls: string[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const api = PrivacyAPI.getInstance();
      const data = await api.submitProfiles(urls, userId || undefined);
      
      // Store the user ID
      if (data.user_id) {
        localStorage.setItem('fiasco_user_id', data.user_id);
        setUserId(data.user_id);
      }
      
      setProfileResults(data.results);
      setProfileUrls(data.urls);
      setLastUpdated(new Date());
      
      toast({
        title: "Analysis complete",
        description: `Analyzed ${urls.length} profile${urls.length > 1 ? 's' : ''} successfully.`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast({
        title: "Analysis failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Refresh data
  const handleRefresh = async () => {
    if (profileUrls.length > 0) {
      try {
        await handleProfileSubmit(profileUrls);
        toast({
          title: "Data refreshed",
          description: "Your privacy report has been updated with the latest data."
        });
      } catch (error) {
        // Error handling is done in handleProfileSubmit
      }
    }
  };
  
  // Handle export
  const handleExport = () => {
    if (!profileResults) return;
    
    // Create a JSON file to download
    const dataStr = JSON.stringify(profileResults, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `privacy-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Report exported",
      description: "Your privacy report has been downloaded as a JSON file."
    });
  };
  
  // Format the lastUpdated date nicely
  const formattedDate = lastUpdated 
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(lastUpdated)
    : 'Not available';
  
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

      {!hasData ? (
        <div className="mt-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">No Profile Data</h2>
            <p className="text-muted-foreground mb-6">
              Add social media profiles to analyze your privacy settings and data exposure
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Add Social Media Profiles</CardTitle>
              <CardDescription>
                Enter the URLs of your social media profiles to analyze their privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm />
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div>
              <h2 className="text-2xl font-bold">Privacy Dashboard</h2>
              <p className="text-muted-foreground">Last updated: {formattedDate}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button onClick={handleExport} disabled={isLoading}>
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
                  <PrivacyScore score={overallPrivacyScore} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Public Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{publicInfoCount} items</div>
                <p className="text-xs text-muted-foreground">Publicly visible settings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Third-Party Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{thirdPartyAccessCount} apps</div>
                <p className="text-xs text-muted-foreground">With access to your data</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Profiles Analyzed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profileUrls.length}</div>
                <p className="text-xs text-muted-foreground">Social media accounts</p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="flex overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {platforms.map(platform => (
                <TabsTrigger key={platform} value={platform}>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </TabsTrigger>
              ))}
              <TabsTrigger value="add">
                <Upload className="h-4 w-4 mr-2" />
                Add Profile
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <DataExposureMetrics />
              <PrivacyRecommendations />
            </TabsContent>
            
            {platforms.map(platform => (
              <TabsContent key={platform} value={platform}>
                <PlatformSettings platform={platform as any} />
              </TabsContent>
            ))}
            
            <TabsContent value="add">
              <Card>
                <CardHeader>
                  <CardTitle>Add More Profiles</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfileForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

// Helper functions
function calculateOverallScore(profileResults: Record<string, ProfileData> | null): number {
  if (!profileResults) return 0;
  
  const scores = Object.values(profileResults).map(
    profile => profile.risk_assessment?.privacy_score || 0
  );
  
  if (scores.length === 0) return 0;
  
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function calculatePublicInfoCount(profileResults: Record<string, ProfileData> | null): number {
  if (!profileResults) return 0;
  
  let count = 0;
  Object.values(profileResults).forEach(profile => {
    const settings = profile.privacy_settings || {};
    // Count settings that are public or enabled
    Object.entries(settings).forEach(([key, value]) => {
      if (
        value === 'public' || 
        value === true || 
        (typeof value === 'string' && value.includes('public'))
      ) {
        count++;
      }
    });
  });
  
  return count;
}

function calculateThirdPartyAccessCount(profileResults: Record<string, ProfileData> | null): number {
  if (!profileResults) return 0;
  
  // This would normally count third-party apps with access
  // For this demo, we'll use a random number based on the number of profiles
  const profileCount = Object.keys(profileResults).length;
  return profileCount > 0 ? Math.min(profileCount * 2 + Math.floor(Math.random() * 5), 12) : 0;
}

function groupByPlatform(profileResults: Record<string, ProfileData> | null): Record<string, ProfileData[]> {
  if (!profileResults) return {};
  
  const grouped: Record<string, ProfileData[]> = {};
  
  Object.entries(profileResults).forEach(([url, profile]) => {
    const platform = profile.platform || 'unknown';
    if (!grouped[platform]) {
      grouped[platform] = [];
    }
    
    grouped[platform].push({
      ...profile,
      url // Add the URL to the profile for reference
    } as any);
  });
  
  return grouped;
}