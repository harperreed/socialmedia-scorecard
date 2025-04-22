import pytest
from crawler import crawl_profile

def test_crawl_profile():
    """Test that the crawler returns the expected mock data."""
    url = "https://example.com/profile"
    result = crawl_profile(url)
    
    assert isinstance(result, dict)
    assert "fakeData" in result
    assert result["fakeData"] == f"mocked for {url}"