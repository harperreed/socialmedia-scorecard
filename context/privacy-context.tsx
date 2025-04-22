"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PrivacyAPI } from '@/lib/privacy-api';
import { ProfileData } from '@/components/profile-result';

type PrivacyContextType = {
  userId: string | null;
  profileResults: Record<string, ProfileData> | null;
  profileUrls: string[];
  isLoading: boolean;
  lastUpdated: Date | null;
  error: string | null;
  loadProfileData: () => Promise<void>;
  submitProfiles: (urls: string[]) => Promise<void>;
  clearData: () => void;
  overallPrivacyScore: number;
  publicInfoCount: number;
  thirdPartyAccessCount: number;
  dataByPlatform: Record<string, ProfileData[]>;
  refreshData: () => Promise<void>;
};

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export const PrivacyProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [profileResults, setProfileResults] = useState<Record<string, ProfileData> | null>(null);
  const [profileUrls, setProfileUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Derived state
  const overallPrivacyScore = calculateOverallScore(profileResults);
  const publicInfoCount = calculatePublicInfoCount(profileResults);
  const thirdPartyAccessCount = calculateThirdPartyAccessCount(profileResults);
  const dataByPlatform = groupByPlatform(profileResults);
  
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
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Submit new profiles for analysis
  const submitProfiles = async (urls: string[]) => {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Refresh data
  const refreshData = async () => {
    if (profileUrls.length > 0 && userId) {
      await submitProfiles(profileUrls);
    }
  };
  
  // Clear all data
  const clearData = () => {
    localStorage.removeItem('fiasco_user_id');
    setUserId(null);
    setProfileResults(null);
    setProfileUrls([]);
    setLastUpdated(null);
  };
  
  return (
    <PrivacyContext.Provider
      value={{
        userId,
        profileResults,
        profileUrls,
        isLoading,
        lastUpdated,
        error,
        loadProfileData: () => loadProfileData(),
        submitProfiles,
        clearData,
        overallPrivacyScore,
        publicInfoCount,
        thirdPartyAccessCount,
        dataByPlatform,
        refreshData,
      }}
    >
      {children}
    </PrivacyContext.Provider>
  );
};

export const usePrivacy = () => {
  const context = useContext(PrivacyContext);
  if (context === undefined) {
    throw new Error('usePrivacy must be used within a PrivacyProvider');
  }
  return context;
};

// Helper functions for derived state
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
    } as ProfileData);
  });
  
  return grouped;
}