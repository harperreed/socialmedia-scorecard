import pytest
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