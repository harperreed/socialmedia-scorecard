from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
from crawler import crawl_profile

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
    
    # Process each URL with the crawler
    results = {}
    for url in urls:
        logger.info(f"Crawling URL: {url}")
        try:
            profile_data = crawl_profile(url)
            results[url] = profile_data
        except Exception as e:
            logger.error(f"Error crawling {url}: {str(e)}")
            results[url] = {"error": str(e)}
    
    response = {
        "status": "processed",
        "urls": urls,
        "results": results
    }
    
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)