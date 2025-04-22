from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
import uuid
import os
from crawler import crawl_profile
from models import db, User, Profile, PrivacySetting, ActivityData, RiskAssessment

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///fiasco.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Create tables when the app starts
with app.app_context():
    db.create_all()

# For testing: access to the in-memory storage
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
    
    # Find or create user
    user = db.session.get(User, user_id)
    if not user:
        user = User(id=user_id)
        db.session.add(user)
    
    # Process each URL with the crawler
    results = {}
    for url in urls:
        logger.info(f"Crawling URL: {url}")
        try:
            # Call crawler
            profile_data = crawl_profile(url)
            results[url] = profile_data
            
            # Check if profile already exists for this URL and user
            existing_profile = Profile.query.filter_by(user_id=user_id, url=url).first()
            
            if existing_profile:
                # Update existing profile
                existing_profile.platform = profile_data.get('platform', 'unknown')
                existing_profile.username = profile_data.get('username', 'unknown')
                
                # Delete old data
                for setting in existing_profile.privacy_settings:
                    db.session.delete(setting)
                for data in existing_profile.activity_data:
                    db.session.delete(data)
                for assessment in existing_profile.risk_assessment:
                    db.session.delete(assessment)
                
                profile = existing_profile
            else:
                # Create new profile
                profile = Profile(
                    url=url,
                    user_id=user_id,
                    platform=profile_data.get('platform', 'unknown'),
                    username=profile_data.get('username', 'unknown')
                )
                db.session.add(profile)
            
            # Save privacy settings
            if 'privacy_settings' in profile_data:
                for key, value in profile_data['privacy_settings'].items():
                    setting = PrivacySetting(profile=profile, key=key)
                    setting.set_value(value)
                    db.session.add(setting)
            
            # Save activity data
            if 'activity_data' in profile_data:
                for key, value in profile_data['activity_data'].items():
                    activity = ActivityData(profile=profile, key=key)
                    activity.set_value(value)
                    db.session.add(activity)
            
            # Save risk assessment
            if 'risk_assessment' in profile_data:
                risk_data = profile_data['risk_assessment']
                risk = RiskAssessment(
                    profile=profile,
                    privacy_score=risk_data.get('privacy_score', 0),
                    risk_level=risk_data.get('risk_level', 'unknown')
                )
                risk.set_risk_factors(risk_data.get('risk_factors', []))
                risk.set_recommendations(risk_data.get('recommendations', []))
                db.session.add(risk)
            
            # Commit after each profile to ensure partial success
            db.session.commit()
            
        except Exception as e:
            logger.error(f"Error crawling {url}: {str(e)}")
            results[url] = {"error": str(e)}
            db.session.rollback()
    
    # Also store in-memory for compatibility with tests
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
    # Check if user exists
    user = db.session.get(User, user_id)
    if not user:
        logger.warning(f"User ID not found: {user_id}")
        return jsonify({"error": "User ID not found"}), 404
    
    logger.info(f"Retrieving results for user_id: {user_id}")
    
    # Get all profiles for this user
    profiles = Profile.query.filter_by(user_id=user_id).all()
    
    # Build response
    results = {}
    for profile in profiles:
        results[profile.url] = profile.to_dict()
    
    response = {
        "urls": [profile.url for profile in profiles],
        "results": results,
        "timestamp": user.updated_at.isoformat() if user.updated_at else None
    }
    
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)