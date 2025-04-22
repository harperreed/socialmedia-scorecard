/**
 * Mock implementation of the PrivacyAPI for testing purposes
 */

import { ProfileData } from "@/components/profile-result";

// Mock data for different platforms
const mockPlatformData: Record<string, any> = {
  twitter: {
    platform: "twitter",
    privacy_settings: {
      account_privacy: "public",
      who_can_message: "everyone",
      location_sharing: true,
      data_personalization: true,
      tagged_photo_review: false
    },
    activity_data: {
      post_count: 423,
      follower_count: 1245,
      following_count: 867,
      retweet_count: 256,
      like_count: 1782,
      lists_count: 5,
      verification_status: false,
      tweets_with_media: 73
    },
    risk_assessment: {
      privacy_score: 35,
      risk_level: "high",
      risk_factors: [
        "Public account exposes your content to anyone",
        "Location data attached to multiple posts",
        "Data personalization enabled allows platform to track preferences"
      ],
      recommendations: [
        "Set your account to private",
        "Disable location sharing",
        "Disable data personalization in settings"
      ]
    }
  },
  facebook: {
    platform: "facebook",
    privacy_settings: {
      profile_visibility: "public",
      friend_list_visibility: "friends",
      future_post_privacy: "public",
      tagged_photo_review: true,
      face_recognition: true
    },
    activity_data: {
      post_count: 278,
      follower_count: 843,
      following_count: 462,
      friend_count: 732,
      page_likes: 156,
      group_memberships: 12,
      events_attended: 34,
      photos_uploaded: 189
    },
    risk_assessment: {
      privacy_score: 42,
      risk_level: "high",
      risk_factors: [
        "Public profile visibility exposes your information to anyone",
        "Face recognition enabled can reduce privacy",
        "High post count creates a detailed digital footprint"
      ],
      recommendations: [
        "Set your profile to friends only",
        "Turn off face recognition",
        "Review and limit past post visibility"
      ]
    }
  },
  instagram: {
    platform: "instagram",
    privacy_settings: {
      account_privacy: "private",
      activity_status: true,
      story_sharing: "close friends only",
      mentioned_story_sharing: false,
      data_sharing_with_partners: true
    },
    activity_data: {
      post_count: 156,
      follower_count: 925,
      following_count: 534,
      average_likes: 112,
      highlight_reels: 8,
      saved_posts: 43,
      tagged_photos: 27,
      stories_posted: 312
    },
    risk_assessment: {
      privacy_score: 65,
      risk_level: "medium",
      risk_factors: [
        "Data sharing with partners enabled",
        "Activity status visible to all followers"
      ],
      recommendations: [
        "Disable data sharing with partners",
        "Turn off activity status"
      ]
    }
  }
};

// Generate username based on the platform and URL
function generateUsername(url: string, platform: string): string {
  const parts = url.split('/');
  const username = parts[parts.length - 1] || `user_${Math.floor(Math.random() * 10000)}`;
  return username;
}

// Determine platform from URL
function getPlatformFromUrl(url: string): string {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
    return 'twitter';
  } else if (lowerUrl.includes('facebook.com')) {
    return 'facebook';
  } else if (lowerUrl.includes('instagram.com')) {
    return 'instagram';
  } else if (lowerUrl.includes('linkedin.com')) {
    return 'linkedin';
  } else if (lowerUrl.includes('tiktok.com')) {
    return 'tiktok';
  } else if (lowerUrl.includes('youtube.com')) {
    return 'youtube';
  } else {
    return 'unknown';
  }
}

// Simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockPrivacyAPI {
  private static instance: MockPrivacyAPI;
  private storedData: Record<string, any> = {};
  
  private constructor() {}
  
  public static getInstance(): MockPrivacyAPI {
    if (!MockPrivacyAPI.instance) {
      MockPrivacyAPI.instance = new MockPrivacyAPI();
    }
    return MockPrivacyAPI.instance;
  }
  
  public async submitProfiles(urls: string[], userId?: string): Promise<{
    status: string;
    user_id: string;
    urls: string[];
    results: Record<string, ProfileData>;
  }> {
    // Simulate API delay
    await delay(1000);
    
    // Generate or use existing user ID
    const user_id = userId || `user_${Date.now()}`;
    
    // Process URLs
    const results: Record<string, ProfileData> = {};
    
    for (const url of urls) {
      const platform = getPlatformFromUrl(url);
      const username = generateUsername(url, platform);
      
      // Get mock data for this platform or default to twitter
      const mockData = mockPlatformData[platform] || mockPlatformData.twitter;
      
      // Create profile data
      results[url] = {
        ...mockData,
        platform,
        username,
        timestamp: new Date().toISOString()
      } as ProfileData;
    }
    
    // Store the results
    this.storedData[user_id] = {
      urls,
      results,
      timestamp: new Date().toISOString()
    };
    
    return {
      status: "processed",
      user_id,
      urls,
      results
    };
  }
  
  public async getProfileResults(userId: string): Promise<{
    urls: string[];
    results: Record<string, ProfileData>;
    timestamp?: string;
  }> {
    // Simulate API delay
    await delay(500);
    
    if (!this.storedData[userId]) {
      throw new Error("Profile not found");
    }
    
    return this.storedData[userId];
  }
  
  // Clear all stored data (useful for testing)
  public clearData(): void {
    this.storedData = {};
  }
}