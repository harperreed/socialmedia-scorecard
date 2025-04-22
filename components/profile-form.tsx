"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function ProfileForm() {
  const [urls, setUrls] = useState<string[]>([""]);
  const [isLoading, setIsLoading] = useState(false);
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
          description: `Received ${data.urls.length} profile URLs`,
        });
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
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Submitting..." : "Analyze Profiles"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}