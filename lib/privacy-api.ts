import { ProfileData } from "@/components/profile-result";

/**
 * API service for interacting with the privacy backend
 */
export class PrivacyAPI {
  private static instance: PrivacyAPI;
  private baseUrl: string;
  
  private constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  }
  
  /**
   * Get singleton instance of the API
   */
  public static getInstance(): PrivacyAPI {
    if (!PrivacyAPI.instance) {
      PrivacyAPI.instance = new PrivacyAPI();
    }
    return PrivacyAPI.instance;
  }
  
  /**
   * Submit profiles for analysis
   */
  public async submitProfiles(urls: string[], userId?: string): Promise<{
    status: string;
    user_id: string;
    urls: string[];
    results: Record<string, ProfileData>;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls,
          ...(userId ? { user_id: userId } : {}),
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error submitting profiles:', error);
      throw error;
    }
  }
  
  /**
   * Get profile analysis by ID
   */
  public async getProfileResults(userId: string): Promise<{
    urls: string[];
    results: Record<string, ProfileData>;
    timestamp?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/profiles/${userId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Profile not found');
        }
        throw new Error(`HTTP error ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting profile results:', error);
      throw error;
    }
  }
}