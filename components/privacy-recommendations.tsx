import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Shield } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const recommendations = [
  {
    id: 1,
    title: "Enable Two-Factor Authentication",
    description: "Add an extra layer of security to your accounts by enabling 2FA on all platforms.",
    platforms: ["Facebook", "Instagram", "Twitter", "LinkedIn"],
    impact: "high",
    implemented: false,
    instructions: [
      {
        platform: "Facebook",
        steps: [
          "Go to Settings & Privacy > Settings",
          "Click on Security and Login",
          "Scroll to Two-Factor Authentication and click Edit",
          "Choose an authentication method (Authentication App recommended)",
          "Follow the on-screen instructions to complete setup",
        ],
      },
      {
        platform: "Instagram",
        steps: [
          "Go to your profile and tap the menu icon",
          "Tap Settings > Security",
          "Tap Two-Factor Authentication",
          "Choose an authentication method",
          "Follow the on-screen instructions",
        ],
      },
      {
        platform: "Twitter",
        steps: [
          "Go to Settings and privacy > Security and account access > Security",
          "Tap on Two-factor authentication",
          "Choose your preferred method",
          "Follow the on-screen instructions",
        ],
      },
      {
        platform: "LinkedIn",
        steps: [
          "Click on your profile icon > Settings & Privacy",
          "Click on Sign in & security",
          "Click on Two-step verification",
          "Follow the on-screen instructions",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Review Third-Party App Access",
    description: "Remove access for unused or suspicious third-party applications.",
    platforms: ["Facebook", "Twitter"],
    impact: "high",
    implemented: false,
    instructions: [
      {
        platform: "Facebook",
        steps: [
          "Go to Settings & Privacy > Settings",
          "Click on Apps and Websites",
          "Review the list of active apps",
          "Remove any apps you no longer use or don't recognize",
          "For apps you keep, review and limit their permissions",
        ],
      },
      {
        platform: "Twitter",
        steps: [
          "Go to Settings and privacy > Security and account access",
          "Tap Apps and sessions > Connected apps",
          "Review the list and revoke access for any apps you don't use",
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Make Your Facebook Profile Private",
    description: "Limit who can see your posts and personal information on Facebook.",
    platforms: ["Facebook"],
    impact: "high",
    implemented: true,
    instructions: [
      {
        platform: "Facebook",
        steps: [
          "Go to Settings & Privacy > Settings",
          "Click on Privacy",
          "Under 'Your Activity', set 'Who can see your future posts?' to Friends",
          "Use the Privacy Checkup tool to review other privacy settings",
          "Review the visibility of your profile information in the 'Profile and Tagging' section",
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Disable Location Tagging",
    description: "Prevent apps from automatically tagging your location in posts.",
    platforms: ["Facebook", "Instagram", "Twitter"],
    impact: "medium",
    implemented: false,
    instructions: [
      {
        platform: "Facebook",
        steps: [
          "Go to Settings & Privacy > Settings",
          "Click on Location",
          "Turn off Location History",
          "Review Location Access permissions for the Facebook app in your phone settings",
        ],
      },
      {
        platform: "Instagram",
        steps: [
          "Go to your profile and tap the menu icon",
          "Tap Settings > Privacy > Location Services",
          "Ensure Location Services is set to 'Never'",
        ],
      },
      {
        platform: "Twitter",
        steps: [
          "Go to Settings and privacy > Privacy and safety",
          "Scroll to Location information",
          "Uncheck 'Add location information to your Tweets'",
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Opt Out of Ad Personalization",
    description: "Limit how your data is used for targeted advertising.",
    platforms: ["Facebook", "Instagram", "Twitter", "LinkedIn"],
    impact: "medium",
    implemented: true,
    instructions: [
      {
        platform: "Facebook",
        steps: [
          "Go to Settings & Privacy > Settings",
          "Click on Ads",
          "Review and adjust all ad preferences",
          "Turn off 'Ads based on data from partners'",
          "Turn off 'Ads based on your activity on Facebook Company Products'",
        ],
      },
      {
        platform: "Instagram",
        steps: [
          "Go to your profile and tap the menu icon",
          "Tap Settings > Ads",
          "Tap 'Ad Preferences' and adjust settings",
          "Turn off 'Data About Your Activity From Partners'",
        ],
      },
      {
        platform: "Twitter",
        steps: [
          "Go to Settings and privacy > Privacy and safety",
          "Tap Ads preferences",
          "Turn off 'Personalized ads'",
        ],
      },
      {
        platform: "LinkedIn",
        steps: [
          "Click on your profile icon > Settings & Privacy",
          "Click on Advertising data",
          "Turn off all personalization options",
        ],
      },
    ],
  },
]

export default function PrivacyRecommendations() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy Recommendations
            </CardTitle>
            <CardDescription>Actionable steps to improve your social media privacy</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`rounded-lg border p-4 ${
                rec.implemented
                  ? "border-green-100 bg-green-50"
                  : rec.impact === "high"
                    ? "border-amber-100 bg-amber-50"
                    : ""
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {rec.implemented ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : rec.impact === "high" ? (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      ) : (
                        <Shield className="h-5 w-5 text-blue-500" />
                      )}
                      <h3 className="font-medium">{rec.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {rec.platforms.map((platform) => (
                        <span
                          key={platform}
                          className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Badge
                    className={
                      rec.implemented ? "bg-green-500" : rec.impact === "high" ? "bg-amber-500" : "bg-blue-500"
                    }
                  >
                    {rec.implemented ? "Implemented" : rec.impact === "high" ? "High Priority" : "Recommended"}
                  </Badge>
                </div>

                {!rec.implemented && (
                  <Accordion type="single" collapsible className="mt-2">
                    <AccordionItem value="instructions">
                      <AccordionTrigger className="text-sm font-medium">How to implement</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          {rec.instructions.map((instruction) => (
                            <div key={instruction.platform} className="space-y-2">
                              <h4 className="font-medium">{instruction.platform}</h4>
                              <ol className="ml-5 list-decimal space-y-1 text-sm text-muted-foreground">
                                {instruction.steps.map((step, index) => (
                                  <li key={index}>{step}</li>
                                ))}
                              </ol>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
