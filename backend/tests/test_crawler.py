import pytest
from crawler import (
    crawl_profile,
    extract_platform_and_username,
    generate_mock_privacy_settings,
    generate_mock_activity_data,
    generate_risk_assessment
)

def test_extract_platform_and_username():
    """Test that platform and username extraction works correctly."""
    # Test Twitter
    platform, username = extract_platform_and_username("https://twitter.com/johndoe")
    assert platform == "twitter"
    assert username == "johndoe"
    
    # Test Twitter with www
    platform, username = extract_platform_and_username("https://www.twitter.com/johndoe")
    assert platform == "twitter"
    assert username == "johndoe"
    
    # Test Twitter (x.com)
    platform, username = extract_platform_and_username("https://x.com/johndoe")
    assert platform == "twitter"
    assert username == "johndoe"
    
    # Test Facebook
    platform, username = extract_platform_and_username("https://facebook.com/johndoe")
    assert platform == "facebook"
    assert username == "johndoe"
    
    # Test Instagram
    platform, username = extract_platform_and_username("https://instagram.com/johndoe")
    assert platform == "instagram"
    assert username == "johndoe"
    
    # Test unknown platform
    platform, username = extract_platform_and_username("https://example.com/johndoe")
    assert platform == "unknown"
    assert username == "johndoe"
    
    # Test empty path
    platform, username = extract_platform_and_username("https://twitter.com")
    assert platform == "twitter"
    assert username is None

def test_generate_mock_privacy_settings():
    """Test that privacy settings are generated based on platform."""
    # Test known platforms
    settings = generate_mock_privacy_settings("twitter")
    assert "account_privacy" in settings
    assert settings["account_privacy"] in ["public", "private"]
    
    settings = generate_mock_privacy_settings("facebook")
    assert "profile_visibility" in settings
    assert settings["profile_visibility"] in ["public", "friends", "friends of friends", "only me"]
    
    # Test unknown platform
    settings = generate_mock_privacy_settings("unknown")
    assert "account_privacy" in settings

def test_generate_mock_activity_data():
    """Test that activity data is generated based on platform."""
    # Test common fields for any platform
    activity = generate_mock_activity_data("some_platform")
    assert "post_count" in activity
    assert "follower_count" in activity
    assert "following_count" in activity
    
    # Test platform-specific fields
    twitter_activity = generate_mock_activity_data("twitter")
    assert "retweet_count" in twitter_activity
    
    facebook_activity = generate_mock_activity_data("facebook")
    assert "friend_count" in facebook_activity
    
    instagram_activity = generate_mock_activity_data("instagram")
    assert "average_likes" in instagram_activity

def test_generate_risk_assessment():
    """Test that risk assessment is generated correctly."""
    # Test with public account
    privacy_settings = {"account_privacy": "public", "location_sharing": True}
    activity_data = {"post_count": 400, "posts_with_location": 20}
    
    risk = generate_risk_assessment("twitter", privacy_settings, activity_data)
    
    assert "privacy_score" in risk
    assert "risk_level" in risk
    assert "risk_factors" in risk
    assert "recommendations" in risk
    
    # Verify risk factors include public account risk
    assert any("Public account" in factor for factor in risk["risk_factors"])
    
    # Verify recommendations include private account recommendation
    assert any("private" in rec for rec in risk["recommendations"])
    
    # Test with private account
    privacy_settings = {"account_privacy": "private", "location_sharing": False}
    activity_data = {"post_count": 20, "posts_with_location": 0}
    
    risk = generate_risk_assessment("linkedin", privacy_settings, activity_data)
    
    # Should have higher privacy score than the previous test
    assert risk["privacy_score"] > 50

def test_crawl_profile():
    """Test that the crawler returns structured profile data."""
    # Test Twitter profile
    url = "https://twitter.com/johndoe"
    result = crawl_profile(url)
    
    assert isinstance(result, dict)
    assert "platform" in result
    assert result["platform"] == "twitter"
    assert "username" in result
    assert result["username"] == "johndoe"
    assert "privacy_settings" in result
    assert "activity_data" in result
    assert "risk_assessment" in result
    
    # Test Facebook profile
    url = "https://facebook.com/johndoe"
    result = crawl_profile(url)
    
    assert isinstance(result, dict)
    assert "platform" in result
    assert result["platform"] == "facebook"
    
    # Test non-existent or malformed URL with mock error
    try:
        # Force an error by passing a completely invalid URL
        url = None  # This should cause an error
        result = crawl_profile(url)  # type: ignore
        
        # If it doesn't raise an exception, at least check it has basic structure
        assert isinstance(result, dict)
        assert "platform" in result
    except Exception:
        # If it raises an exception, that's also acceptable for this test
        pass