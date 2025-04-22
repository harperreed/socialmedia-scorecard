"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, Shield, Activity, Settings, User } from "lucide-react";

type PrivacySettings = {
  [key: string]: string | boolean;
};

type ActivityData = {
  post_count: number;
  follower_count: number;
  following_count: number;
  last_active: string;
  account_created: string;
  [key: string]: number | string | boolean;
};

type RiskAssessment = {
  privacy_score: number;
  risk_level: "low" | "medium" | "high";
  risk_factors: string[];
  recommendations: string[];
};

export type ProfileData = {
  platform: string;
  username: string;
  timestamp: string;
  privacy_settings: PrivacySettings;
  activity_data: ActivityData;
  risk_assessment: RiskAssessment;
  error?: string;
};

interface ProfileResultProps {
  url: string;
  data: ProfileData;
}

export function ProfileResult({ url, data }: ProfileResultProps) {
  const [tab, setTab] = useState("overview");

  // If there was an error crawling this profile
  if (data.error) {
    return (
      <Card className="mb-4 border-destructive">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            Error crawling {url}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{data.error}</p>
        </CardContent>
      </Card>
    );
  }

  const { platform, username, privacy_settings, activity_data, risk_assessment } = data;
  const platformIcon = getPlatformIcon(platform);
  const privacyScoreColor = getPrivacyScoreColor(risk_assessment.privacy_score);

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {platformIcon}
            <CardTitle className="text-base">
              {platform.charAt(0).toUpperCase() + platform.slice(1)}:{" "}
              <span className="font-normal">{username}</span>
            </CardTitle>
          </div>
          <Badge variant={getRiskVariant(risk_assessment.risk_level)}>
            {risk_assessment.risk_level.toUpperCase()} RISK
          </Badge>
        </div>
        <CardDescription>
          <div className="mt-2">
            <div className="flex justify-between mb-1">
              <span className="text-xs">Privacy Score</span>
              <span className="text-xs font-medium">{risk_assessment.privacy_score}/100</span>
            </div>
            <Progress value={risk_assessment.privacy_score} className={`h-2 ${privacyScoreColor}`} />
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full" value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="risks">Risks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4" /> Privacy Score: {risk_assessment.privacy_score}/100
              </h4>
              <p className="text-xs text-muted-foreground">
                This account has a {risk_assessment.risk_level} risk level based on privacy settings and activity.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> Top Risks
              </h4>
              <ul className="text-xs space-y-1 pl-6 list-disc">
                {risk_assessment.risk_factors.slice(0, 3).map((factor, i) => (
                  <li key={i}>{factor}</li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> Top Recommendations
              </h4>
              <ul className="text-xs space-y-1 pl-6 list-disc">
                {risk_assessment.recommendations.slice(0, 3).map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Settings className="h-4 w-4" /> Privacy Settings
            </h4>
            <div className="space-y-2">
              {Object.entries(privacy_settings).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="text-xs">{formatKey(key)}</span>
                  <Badge variant={value === true || value === "public" ? "destructive" : "success"}>
                    {formatValue(value)}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4" /> Account Activity
            </h4>
            <div className="space-y-2">
              {Object.entries(activity_data).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="text-xs">{formatKey(key)}</span>
                  <span className="text-xs font-medium">{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="risks" className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> Risk Factors
              </h4>
              <ul className="text-xs space-y-1 pl-6 list-disc">
                {risk_assessment.risk_factors.map((factor, i) => (
                  <li key={i}>{factor}</li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> Recommendations
              </h4>
              <ul className="text-xs space-y-1 pl-6 list-disc">
                {risk_assessment.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Helper functions
function getPlatformIcon(platform: string) {
  // You would typically use real platform icons here
  return <User className="h-4 w-4" />;
}

function getRiskVariant(riskLevel: string): "default" | "destructive" | "outline" | "secondary" | "success" {
  switch (riskLevel.toLowerCase()) {
    case "high":
      return "destructive";
    case "medium":
      return "secondary";
    case "low":
      return "success";
    default:
      return "default";
  }
}

function getPrivacyScoreColor(score: number): string {
  if (score < 40) return "bg-destructive";
  if (score < 70) return "bg-yellow-500";
  return "bg-green-500";
}

function formatKey(key: string): string {
  return key
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatValue(value: string | boolean): string {
  if (typeof value === "boolean") {
    return value ? "Enabled" : "Disabled";
  }
  return value.toString().charAt(0).toUpperCase() + value.toString().slice(1);
}