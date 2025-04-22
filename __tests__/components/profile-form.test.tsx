/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfileForm } from '@/components/profile-form';
import { MockPrivacyAPI } from '@/lib/mocks/api-mock';
import { ToastProvider } from '@/components/ui/toast';

// Mock the fetch function
global.fetch = jest.fn();

// Helper to render with toast context
function renderWithToast(ui: React.ReactElement) {
  return render(
    <ToastProvider>{ui}</ToastProvider>
  );
}

describe('ProfileForm Component', () => {
  let mockSubmit: jest.Mock;
  
  beforeEach(() => {
    mockSubmit = jest.fn();
    
    // Reset the fetch mock
    jest.mocked(global.fetch).mockReset();
  });
  
  it('renders the form with initial empty URL field', () => {
    renderWithToast(<ProfileForm />);
    
    // Form should be visible
    expect(screen.getByText('Submit Profiles')).toBeInTheDocument();
    
    // Should have one URL input initially
    const urlInput = screen.getByPlaceholderText('https://twitter.com/username');
    expect(urlInput).toBeInTheDocument();
    expect(urlInput).toHaveValue('');
    
    // Should have an "Add Another URL" button
    expect(screen.getByText('Add Another URL')).toBeInTheDocument();
  });
  
  it('allows adding and removing URL fields', () => {
    renderWithToast(<ProfileForm />);
    
    // Initially one URL field
    expect(screen.getAllByPlaceholderText('https://twitter.com/username')).toHaveLength(1);
    
    // Click to add a field
    fireEvent.click(screen.getByText('Add Another URL'));
    
    // Now should have two URL fields
    expect(screen.getAllByPlaceholderText('https://twitter.com/username')).toHaveLength(2);
    
    // Remove button should exist for the second field
    const removeButtons = screen.getAllByRole('button', { name: /Remove URL/i });
    expect(removeButtons).toHaveLength(1);
    
    // Click to remove the field
    fireEvent.click(removeButtons[0]);
    
    // Back to one URL field
    expect(screen.getAllByPlaceholderText('https://twitter.com/username')).toHaveLength(1);
  });
  
  it('calls onSubmit with valid URLs when form is submitted', async () => {
    renderWithToast(<ProfileForm onSubmit={mockSubmit} />);
    
    // Enter a URL
    const urlInput = screen.getByPlaceholderText('https://twitter.com/username');
    fireEvent.change(urlInput, { target: { value: 'https://twitter.com/testuser' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Analyze Profiles/i }));
    
    // Check if onSubmit was called with the URLs
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(['https://twitter.com/testuser']);
    });
  });
  
  it('validates URLs before submission', async () => {
    const { container } = renderWithToast(<ProfileForm onSubmit={mockSubmit} />);
    
    // Submit with empty URL
    fireEvent.click(screen.getByRole('button', { name: /Analyze Profiles/i }));
    
    // Validate error message
    await waitFor(() => {
      expect(mockSubmit).not.toHaveBeenCalled();
      expect(screen.getByText('Please enter at least one valid URL')).toBeInTheDocument();
    });
  });
  
  it('integrates with MockPrivacyAPI', async () => {
    // Mock the API response
    const mockApi = MockPrivacyAPI.getInstance();
    const submitSpy = jest.spyOn(mockApi, 'submitProfiles');
    
    // Use the mock implementation for fetch
    jest.mocked(global.fetch).mockImplementation(async () => {
      const results = await mockApi.submitProfiles(['https://twitter.com/testuser']);
      return {
        ok: true,
        json: async () => results,
      } as Response;
    });
    
    renderWithToast(<ProfileForm />);
    
    // Enter a URL
    const urlInput = screen.getByPlaceholderText('https://twitter.com/username');
    fireEvent.change(urlInput, { target: { value: 'https://twitter.com/testuser' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Analyze Profiles/i }));
    
    // Check that loading state is shown
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    
    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/Success/i)).toBeInTheDocument();
    });
    
    // Clean up
    submitSpy.mockRestore();
  });
});