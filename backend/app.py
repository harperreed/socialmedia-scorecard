from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
import uuid
from crawler import crawl_profile

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory storage for crawler results
# In a production application, this would be a database
crawler_results = {}

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
    
    # Get or generate user_id
    user_id = data.get('user_id')
    if not user_id:
        user_id = str(uuid.uuid4())
    
    logger.info(f"Received URLs for user_id {user_id}: {urls}")
    
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
    
    # Store the results
    crawler_results[user_id] = {
        "urls": urls,
        "results": results,
        "timestamp": app.config.get('REQUEST_TIME', None)
    }
    
    logger.info(f"Stored results for user_id: {user_id}")
    
    response = {
        "status": "processed",
        "user_id": user_id,
        "urls": urls,
        "results": results
    }
    
    return jsonify(response)

@app.route('/profiles/<user_id>', methods=['GET'])
def get_profiles(user_id):
    if user_id not in crawler_results:
        logger.warning(f"User ID not found: {user_id}")
        return jsonify({"error": "User ID not found"}), 404
    
    logger.info(f"Retrieving results for user_id: {user_id}")
    return jsonify(crawler_results[user_id])

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)