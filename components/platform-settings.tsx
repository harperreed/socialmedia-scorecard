"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, ExternalLink, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface PlatformSettingsProps {
  platform: "facebook" | "instagram" | "twitter" | "linkedin"
}

const platformData = {
  facebook: {
    name: "Facebook",
    icon: Facebook,
    color: "#1877F2",
    url: "https://www.facebook.com/settings",
    settings: [
      {
        id: "profile_visibility",
        name: "Profile Visibility",
        description: "Who can see your profile information",
        status: "Public",
        recommended: "Friends only",
        critical: true,
      },
      {
        id: "post_visibility",
        name: "Post Visibility",
        description: "Who can see your posts and updates",
        status: "Public",
        recommended: "Friends only",
        critical: false,
      },
      {
        id: "friend_list",
        name: "Friend List Visibility",
        description: "Who can see your list of friends",
        status: "Public",
        recommended: "Only me",
        critical: false,
      },
      {
        id: "tagging",
        name: "Tagging Controls",
        description: "Review tags people add to your content",
        status: "Off",
        recommended: "On",
        critical: true,
      },
      {
        id: "facial_recognition",
        name: "Facial Recognition",
        description: "Allow Facebook to recognize you in photos",
        status: "On",
        recommended: "Off",
        critical: true,
      },
      {
        id: "ad_targeting",
        name: "Ad Targeting",
        description: "Allow personalized ads based on your data",
        status: "On",
        recommended: "Limited",
        critical: false,
      },
      {
        id: "location_history",
        name: "Location History",
        description: "Track and store your precise location",
        status: "Off",
        recommended: "Off",
        critical: true,
      },
    ],
  },
  instagram: {
    name: "Instagram",
    icon: Instagram,
    color: "#E1306C",
    url: "https://www.instagram.com/accounts/privacy_and_security/",
    settings: [
      {
        id: "account_privacy",
        name: "Private Account",
        description: "Only approved followers can see your content",
        status: "Off",
        recommended: "On",
        critical: true,
      },
      {
        id: "activity_status",
        name: "Activity Status",
        description: "Show when you're active on Instagram",
        status: "On",
        recommended: "Off",
        critical: false,
      },
      {
        id: "story_sharing",
        name: "Story Sharing",
        description: "Allow others to share your stories",
        status: "On",
        recommended: "Off",
        critical: false,
      },
      {
        id: "tagged_content",
        name: "Tagged Content Review",
        description: "Review posts you're tagged in",
        status: "Off",
        recommended: "On",
        critical: true,
      },
      {
        id: "data_sharing",
        name: "Data Sharing with Facebook",
        description: "Share your Instagram data with Facebook",
        status: "On",
        recommended: "Off",
        critical: true,
      },
    ],
  },
  twitter: {
    name: "Twitter",
    icon: Twitter,
    color: "#1DA1F2",
    url: "https://twitter.com/settings/privacy_and_safety",
    settings: [
      {
        id: "tweet_privacy",
        name: "Tweet Privacy",
        description: "Protect your tweets from public view",
        status: "Off",
        recommended: "On",
        critical: true,
      },
      {
        id: "location_tagging",
        name: "Location Tagging",
        description: "Add location information to your tweets",
        status: "On",
        recommended: "Off",
        critical: false,
      },
      {
        id: "discoverability",
        name: "Discoverability",
        description: "Let others find you by email or phone",
        status: "On",
        recommended: "Off",
        critical: true,
      },
      {
        id: "personalization",
        name: "Personalization and Data",
        description: "Control how Twitter uses your data",
        status: "On",
        recommended: "Limited",
        critical: false,
      },
      {
        id: "direct_messages",
        name: "Direct Message Privacy",
        description: "Who can send you direct messages",
        status: "Anyone",
        recommended: "Following only",
        critical: false,
      },
    ],
  },
  linkedin: {
    name: "LinkedIn",
    icon: Linkedin,
    color: "#0A66C2",
    url: "https://www.linkedin.com/psettings/",
    settings: [
      {
        id: "profile_visibility",
        name: "Profile Visibility",
        description: "Who can see your profile",
        status: "Public",
        recommended: "Connections only",
        critical: true,
      },
      {
        id: "connections_visibility",
        name: "Connections Visibility",
        description: "Who can see your connections",
        status: "Anyone",
        recommended: "Only you",
        critical: false,
      },
      {
        id: "activity_broadcast",
        name: "Activity Broadcasts",
        description: "Share profile changes with your network",
        status: "On",
        recommended: "Off",
        critical: false,
      },
      {
        id: "data_visibility",
        name: "Data Visibility",
        description: "How your data is used for research",
        status: "On",
        recommended: "Off",
        critical: true,
      },
      {
        id: "messaging_preferences",
        name: "Messaging Preferences",
        description: "Who can send you messages",
        status: "Anyone",
        recommended: "Connections only",
        critical: false,
      },
    ],
  },
}

export default function PlatformSettings({ platform }: PlatformSettingsProps) {
  const data = platformData[platform]

  const criticalIssuesCount = data.settings.filter((s) => s.critical && s.status !== s.recommended).length

  const PlatformIcon = data.icon

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: data.color }}
        >
          <PlatformIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{data.name} Privacy Settings</h2>
          <p className="text-sm text-muted-foreground">Analysis of your current privacy settings for {data.name}</p>
        </div>
      </div>

      {criticalIssuesCount > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Privacy Risk Detected</AlertTitle>
          <AlertDescription>
            You have {criticalIssuesCount} critical privacy {criticalIssuesCount === 1 ? "setting" : "settings"} that
            may expose your personal data.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {data.settings.map((setting) => {
          const isRisky = setting.critical && setting.status !== setting.recommended
          return (
            <Card key={setting.id} className={isRisky ? "border-red-200 bg-red-50" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{setting.name}</CardTitle>
                    <CardDescription>{setting.description}</CardDescription>
                  </div>
                  <Badge variant={setting.status === setting.recommended ? "outline" : "destructive"}>
                    {setting.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  {setting.status === setting.recommended ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  <span className={setting.status === setting.recommended ? "text-green-500" : "text-red-500"}>
                    {setting.status === setting.recommended ? "Optimal setting" : `Recommended: ${setting.recommended}`}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-center">
        <Button onClick={() => window.open(data.url, "_blank")}>
          <ExternalLink className="mr-2 h-4 w-4" />
          Visit {data.name} Settings
        </Button>
      </div>
    </div>
  )
}
