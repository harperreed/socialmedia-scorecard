/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConnectedDashboard from '@/components/connected-dashboard';
import { MockPrivacyAPI } from '@/lib/mocks/api-mock';
import { ToastProvider } from '@/components/ui/toast';

// Mock the local storage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock the fetch function
global.fetch = jest.fn();

// Helper to render with toast context
function renderWithToast(ui: React.ReactElement) {
  return render(
    <ToastProvider>{ui}</ToastProvider>
  );
}

describe('ConnectedDashboard Component', () => {
  let mockApi: MockPrivacyAPI;
  
  beforeEach(() => {
    // Reset mocks
    localStorage.clear();
    jest.mocked(global.fetch).mockReset();
    
    mockApi = MockPrivacyAPI.getInstance();
    mockApi.clearData();
  });
  
  it('shows the initial empty state with profile form', () => {
    renderWithToast(<ConnectedDashboard />);
    
    // Should show the "No Profile Data" text
    expect(screen.getByText('No Profile Data')).toBeInTheDocument();
    
    // Should have a form to add profiles
    expect(screen.getByText('Add Social Media Profiles')).toBeInTheDocument();
  });
  
  it('loads stored profile data on mount if user_id exists', async () => {
    // Set up localStorage with a user_id
    const userId = 'test-user-123';
    localStorage.setItem('fiasco_user_id', userId);
    
    // Mock API response
    const mockUrls = ['https://twitter.com/testuser'];
    await mockApi.submitProfiles(mockUrls, userId);
    
    // Mock fetch to use our mockApi
    jest.mocked(global.fetch).mockImplementation(async (url) => {
      if (url.includes(`/profiles/${userId}`)) {
        const results = await mockApi.getProfileResults(userId);
        return {
          ok: true,
          json: async () => results,
        } as Response;
      }
      return {
        ok: false,
        json: async () => ({}),
      } as Response;
    });
    
    renderWithToast(<ConnectedDashboard />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('No Profile Data')).not.toBeInTheDocument();
    });
    
    // Should show privacy score and other metrics
    expect(screen.getByText('Overall Privacy Score')).toBeInTheDocument();
    expect(screen.getByText('Public Information')).toBeInTheDocument();
    
    // Should show platform tabs once loaded
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /Twitter/i })).toBeInTheDocument();
    });
  });
  
  it('submits new profile URLs and displays results', async () => {
    // Mock fetch for profile submission
    jest.mocked(global.fetch).mockImplementation(async (url, options) => {
      if (typeof url === 'string' && url.includes('/profiles') && options?.method === 'POST') {
        const body = JSON.parse(options.body as string);
        const results = await mockApi.submitProfiles(body.urls);
        return {
          ok: true,
          json: async () => results,
        } as Response;
      }
      return {
        ok: false,
        json: async () => ({}),
      } as Response;
    });
    
    renderWithToast(<ConnectedDashboard />);
    
    // Find the URL input in the form
    const urlInput = screen.getByPlaceholderText('https://twitter.com/username');
    fireEvent.change(urlInput, { target: { value: 'https://twitter.com/testuser' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Analyze Profiles/i });
    fireEvent.click(submitButton);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('No Profile Data')).not.toBeInTheDocument();
    });
    
    // Should show privacy score and platform-specific tabs
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /Twitter/i })).toBeInTheDocument();
    });
  });
});