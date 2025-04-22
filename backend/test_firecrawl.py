"""
Test script for the Firecrawl integration.
"""

import os
import sys
import json
from crawler import crawl_profile

def test_firecrawl_integration():
    """Test the Firecrawl integration with a sample URL."""
    
    # Check if API key is set
    api_key = os.environ.get("FIRECRAWL_API_KEY")
    if not api_key:
        print("WARNING: No FIRECRAWL_API_KEY environment variable found.")
        print("Running in mock data mode.")
    else:
        print(f"Found FIRECRAWL_API_KEY: {api_key[:4]}...{api_key[-4:]}")
    
    # List of URLs to test
    test_urls = [
        "https://twitter.com/elonmusk",
        "https://www.instagram.com/beyonce/",
        "https://www.facebook.com/zuck",
        "https://www.linkedin.com/in/billgates/",
    ]
    
    # Test each URL
    results = {}
    
    for url in test_urls:
        print(f"\nTesting crawl for {url}...")
        try:
            result = crawl_profile(url)
            print(f"Crawl successful. Data source: {result.get('data_source', 'unknown')}")
            print(f"Platform: {result.get('platform')}")
            print(f"Username: {result.get('username')}")
            
            # Print privacy score
            risk_assessment = result.get('risk_assessment', {})
            print(f"Privacy Score: {risk_assessment.get('privacy_score', 'N/A')}")
            
            # Store result
            results[url] = result
        except Exception as e:
            print(f"Error crawling {url}: {str(e)}")
    
    # Save results to file
    with open("firecrawl_test_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print("\nTest completed. Results saved to firecrawl_test_results.json")

if __name__ == "__main__":
    test_firecrawl_integration()