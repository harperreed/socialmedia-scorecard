import pytest
import json
import uuid
from app import app as flask_app, crawler_results
from unittest.mock import patch, Mock

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

def test_health_endpoint(client):
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json == {"status": "ok"}

def test_ping_endpoint(client):
    response = client.get('/ping')
    assert response.status_code == 200
    assert response.data == b"pong"

def test_profiles_endpoint_with_crawler():
    # Create a test client
    client = flask_app.test_client()
    
    # Test data
    urls = ["https://twitter.com/testuser", "https://facebook.com/testuser"]
    
    # Send POST request
    response = client.post(
        '/profiles',
        data=json.dumps({"urls": urls}),
        content_type='application/json'
    )
    
    # Check status code
    assert response.status_code == 200
    
    # Check response structure
    response_data = response.json
    assert response_data.get("status") == "processed"
    assert "urls" in response_data
    assert len(response_data["urls"]) == 2
    assert response_data["urls"] == urls
    assert "user_id" in response_data
    
    # Check that results were returned
    assert "results" in response_data
    assert len(response_data["results"]) == 2
    
    # Check that each URL has the expected structured result
    for url in urls:
        assert url in response_data["results"]
        assert "platform" in response_data["results"][url]
        assert "username" in response_data["results"][url]
        assert "privacy_settings" in response_data["results"][url]
        assert "activity_data" in response_data["results"][url]
        assert "risk_assessment" in response_data["results"][url]

def test_profiles_endpoint_with_provided_user_id():
    # Create a test client
    client = flask_app.test_client()
    
    # Test data
    user_id = str(uuid.uuid4())
    urls = ["https://twitter.com/testuser"]
    
    # Send POST request with user_id
    response = client.post(
        '/profiles',
        data=json.dumps({"urls": urls, "user_id": user_id}),
        content_type='application/json'
    )
    
    # Check response
    assert response.status_code == 200
    response_data = response.json
    assert response_data.get("user_id") == user_id
    
    # Verify the results were stored with the provided user_id
    assert user_id in crawler_results

def test_get_profiles_endpoint():
    # Create a test client
    client = flask_app.test_client()
    
    # First, submit some profiles to create a user_id
    urls = ["https://twitter.com/testuser"]
    
    # Send POST request
    post_response = client.post(
        '/profiles',
        data=json.dumps({"urls": urls}),
        content_type='application/json'
    )
    
    user_id = post_response.json.get("user_id")
    assert user_id is not None
    
    # Now try to retrieve the profiles
    get_response = client.get(f'/profiles/{user_id}')
    
    # Check response
    assert get_response.status_code == 200
    get_data = get_response.json
    
    # Verify the data structure
    assert "urls" in get_data
    assert "results" in get_data
    assert get_data["urls"] == urls
    
    # Verify the results content
    for url in urls:
        assert url in get_data["results"]
        assert "platform" in get_data["results"][url]
        assert "privacy_settings" in get_data["results"][url]
        assert "activity_data" in get_data["results"][url]
        assert "risk_assessment" in get_data["results"][url]

def test_get_profiles_with_nonexistent_user_id():
    # Create a test client
    client = flask_app.test_client()
    
    # Try to retrieve profiles for a non-existent user_id
    get_response = client.get('/profiles/nonexistent-id')
    
    # Check response is 404
    assert get_response.status_code == 404
    assert "error" in get_response.json