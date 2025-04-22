"""
Tests for the Flask API with mocked crawler functionality.
"""

import pytest
import json
from unittest.mock import patch, MagicMock
from app import app as flask_app, crawler_results

@pytest.fixture
def app():
    return flask_app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture(autouse=True)
def clear_crawler_results():
    # Clear the crawler_results before each test
    crawler_results.clear()
    yield

def test_profiles_endpoint_with_mocked_crawler():
    """Test the /profiles endpoint with a mocked crawler function."""
    
    # Create a test client
    client = flask_app.test_client()
    
    # Mock data that would be returned by the crawler
    mock_profile_data = {
        "platform": "twitter",
        "username": "testuser",
        "privacy_settings": {
            "account_privacy": "public",
            "location_sharing": True
        },
        "activity_data": {
            "post_count": 150,
            "follower_count": 500
        },
        "risk_assessment": {
            "privacy_score": 65,
            "risk_level": "medium",
            "risk_factors": ["Public account exposes your content to anyone"],
            "recommendations": ["Set your account to private"]
        }
    }
    
    # Patch the crawler function to return our mock data
    with patch('app.crawl_profile', return_value=mock_profile_data):
        # Test data
        urls = ["https://twitter.com/testuser"]
        
        # Send POST request
        response = client.post(
            '/profiles',
            data=json.dumps({"urls": urls}),
            content_type='application/json'
        )
        
        # Check status code and response structure
        assert response.status_code == 200
        data = response.json
        
        assert "status" in data
        assert "user_id" in data
        assert "results" in data
        
        # Check if our mock data is in the results
        assert urls[0] in data["results"]
        assert data["results"][urls[0]]["platform"] == "twitter"
        assert data["results"][urls[0]]["username"] == "testuser"
        
        # Get the user_id to use in the next test
        user_id = data["user_id"]
        
        # Now test the GET endpoint using the same user_id
        get_response = client.get(f'/profiles/{user_id}')
        
        assert get_response.status_code == 200
        get_data = get_response.json
        
        # Check that the same data was stored
        assert urls[0] in get_data["results"]
        assert get_data["results"][urls[0]]["platform"] == "twitter"

def test_user_id_creation_and_retrieval():
    """Test user_id creation, data storage and retrieval."""
    
    # Create a test client
    client = flask_app.test_client()
    
    # Test with a provided user_id
    user_id = "test-user-123"
    
    # Send POST request with user_id
    response = client.post(
        '/profiles',
        data=json.dumps({
            "urls": ["https://twitter.com/testuser"],
            "user_id": user_id
        }),
        content_type='application/json'
    )
    
    # Verify the response contains the same user_id
    assert response.status_code == 200
    assert response.json["user_id"] == user_id
    
    # Verify we can retrieve the data with that user_id
    get_response = client.get(f'/profiles/{user_id}')
    assert get_response.status_code == 200
    
    # Test with a non-existent user_id
    not_found_response = client.get('/profiles/nonexistent-user-id')
    assert not_found_response.status_code == 404
    
def test_crawler_accepts_any_domain():
    """Test that the API works with any domain name."""
    
    # Create a test client
    client = flask_app.test_client()
    
    # Test with various domain types
    domains = [
        "https://twitter.com/user123",
        "https://facebook.com/user123",
        "https://instagram.com/user123",
        "https://linkedin.com/in/user123",
        "https://tiktok.com/@user123",
        "https://youtube.com/user123",
        "https://example.com/user123",  # Should work with unknown domains too
    ]
    
    # Send POST request with all domains
    response = client.post(
        '/profiles',
        data=json.dumps({"urls": domains}),
        content_type='application/json'
    )
    
    # Check that each domain has a result
    assert response.status_code == 200
    for domain in domains:
        assert domain in response.json["results"]
        
        # Each result should have a platform property
        assert "platform" in response.json["results"][domain]
        
        # Each result should have a username property
        assert "username" in response.json["results"][domain]