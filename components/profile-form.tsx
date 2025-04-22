"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProfileResult } from "@/components/profile-result";

// Define types for crawler results
import type { ProfileData } from "@/components/profile-result";

type CrawlerResult = {
  [url: string]: ProfileData;
};

// Define type for profile API response
type ProfileResponse = {
  urls: string[];
  results: CrawlerResult;
  timestamp?: string;
};

export function ProfileForm() {
  const [urls, setUrls] = useState<string[]>([""]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CrawlerResult | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingStoredData, setIsLoadingStoredData] = useState(false);
  const { toast } = useToast();

  // On component mount, check for a stored user_id
  useEffect(() => {
    const storedUserId = localStorage.getItem("fiasco_user_id");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchStoredData(storedUserId);
    }
  }, []);

  // Fetch any stored data if user_id exists
  const fetchStoredData = async (id: string) => {
    setIsLoadingStoredData(true);
    try {
      const response = await fetch(`http://localhost:5000/profiles/${id}`);
      
      if (response.ok) {
        const data: ProfileResponse = await response.json();
        
        // Update state with the stored data
        if (data.results) {
          setResults(data.results);
          
          // If there are URLs in the stored data, use them
          if (data.urls && data.urls.length > 0) {
            setUrls(data.urls);
          }
          
          toast({
            title: "Data loaded",
            description: "Loaded your previously analyzed profiles",
          });
        }
      } else if (response.status !== 404) {
        // If not a 404 (no data found yet), show an error
        toast({
          title: "Error",
          description: "Failed to load previously analyzed profiles",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching stored data:", error);
    } finally {
      setIsLoadingStoredData(false);
    }
  };

  // Handle input change for each URL field
  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  // Add a new URL input field
  const addUrlField = () => {
    setUrls([...urls, ""]);
  };

  // Remove a URL input field
  const removeUrlField = (index: number) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
    }
  };

  // Reset the form and results
  const handleReset = () => {
    setUrls([""]);
    setResults(null);
    
    // Optionally clear the stored user_id to start fresh
    if (userId) {
      const shouldClear = window.confirm("Do you want to clear your saved data and start fresh?");
      if (shouldClear) {
        localStorage.removeItem("fiasco_user_id");
        setUserId(null);
        toast({
          title: "Data cleared",
          description: "Your saved data has been cleared",
        });
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous results
    setResults(null);
    
    // Filter out empty URLs
    const validUrls = urls.filter(url => url.trim() !== "");
    
    if (validUrls.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one valid URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Include user_id if we have one from previous requests
      const requestData = {
        urls: validUrls,
        ...(userId ? { user_id: userId } : {})
      };

      const response = await fetch("http://localhost:5000/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: `Processed ${data.urls.length} profile URLs`,
        });
        
        // Store the user_id if it's new
        if (data.user_id && (!userId || userId !== data.user_id)) {
          localStorage.setItem("fiasco_user_id", data.user_id);
          setUserId(data.user_id);
        }
        
        // Store the results
        if (data.results) {
          setResults(data.results);
        }
      } else {
        throw new Error("Failed to submit profiles");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to the server",
        variant: "destructive",
      });
      console.error("Error submitting profiles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Submit Profiles</CardTitle>
          <CardDescription>
            Enter the URLs of the social media profiles you want to analyze
            {userId && 
              <div className="mt-2 text-xs text-muted-foreground">
                Session ID: {userId}
              </div>
            }
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            {urls.map((url, index) => (
              <div key={index} className="flex items-center gap-2 mb-4">
                <div className="flex-1">
                  <Label htmlFor={`url-${index}`} className="sr-only">
                    Profile URL
                  </Label>
                  <Input
                    id={`url-${index}`}
                    placeholder="https://twitter.com/username"
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    disabled={isLoading || isLoadingStoredData}
                  />
                </div>
                {urls.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeUrlField(index)}
                    disabled={isLoading || isLoadingStoredData}
                    aria-label="Remove URL"
                  >
                    &times;
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addUrlField}
              disabled={isLoading || isLoadingStoredData}
              className="w-full"
            >
              Add Another URL
            </Button>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button 
              type="submit" 
              disabled={isLoading || isLoadingStoredData} 
              className="flex-1"
            >
              {isLoading ? "Processing..." : isLoadingStoredData ? "Loading..." : "Analyze Profiles"}
            </Button>
            {(results || userId) && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleReset}
                disabled={isLoading || isLoadingStoredData}
              >
                Reset
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>

      {/* Display Results */}
      {results && (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Privacy Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(results).map(([url, data]) => (
              <ProfileResult key={url} url={url} data={data as any} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}