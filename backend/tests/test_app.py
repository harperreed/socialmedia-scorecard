import pytest
import json
from app import app as flask_app

@pytest.fixture
def app():
    return flask_app

@pytest.fixture
def client(app):
    return app.test_client()

def test_health_endpoint(client):
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json == {"status": "ok"}

def test_ping_endpoint(client):
    response = client.get('/ping')
    assert response.status_code == 200
    assert response.data == b"pong"

def test_profiles_endpoint(client):
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
    assert response_data.get("status") == "received"
    assert "urls" in response_data
    assert len(response_data["urls"]) == 2
    assert response_data["urls"] == urls