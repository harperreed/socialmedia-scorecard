from flask import Flask, jsonify, request
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

@app.route('/ping', methods=['GET'])
def ping():
    return "pong"

@app.route('/profiles', methods=['POST'])
def submit_profiles():
    data = request.get_json()
    urls = data.get('urls', [])
    
    logger.info(f"Received URLs: {urls}")
    
    response = {
        "status": "received",
        "urls": urls
    }
    
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)