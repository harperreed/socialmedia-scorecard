"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define type for crawler results
type CrawlerResult = {
  [url: string]: {
    fakeData: string;
    [key: string]: any;
  };
};

export function ProfileForm() {
  const [urls, setUrls] = useState<string[]>([""]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CrawlerResult | null>(null);
  const { toast } = useToast();

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
      const response = await fetch("http://localhost:5000/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urls: validUrls }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: `Processed ${data.urls.length} profile URLs`,
        });
        
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
                    disabled={isLoading}
                  />
                </div>
                {urls.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeUrlField(index)}
                    disabled={isLoading}
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
              disabled={isLoading}
              className="w-full"
            >
              Add Another URL
            </Button>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Processing..." : "Analyze Profiles"}
            </Button>
            {results && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleReset}
                disabled={isLoading}
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
            <CardTitle>Crawler Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(results).map(([url, data]) => (
              <Alert key={url}>
                <AlertTitle className="text-sm font-medium truncate">{url}</AlertTitle>
                <AlertDescription>
                  <pre className="mt-2 w-full overflow-auto text-xs p-2 bg-muted rounded-md">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}