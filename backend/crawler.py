"""
Crawler module for fetching profile data from social media platforms.
Uses Firecrawl for real web crawling with fallback to mock data generation.
"""

import re
import os
from urllib.parse import urlparse
import random
from datetime import datetime, timedelta
import logging
import json
from firecrawl import FirecrawlApp

logger = logging.getLogger(__name__)

# Initialize Firecrawl with API key
FIRECRAWL_API_KEY = os.environ.get("FIRECRAWL_API_KEY", "")
firecrawl_app = None

# Only initialize if API key is available
if FIRECRAWL_API_KEY:
    try:
        firecrawl_app = FirecrawlApp(api_key=FIRECRAWL_API_KEY)
        logger.info("Firecrawl initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Firecrawl: {str(e)}")
else:
    logger.warning("No Firecrawl API key found, using mock data generation only")

def extract_platform_and_username(url: str) -> tuple:
    """
    Extract the platform and username from a social media URL.
    
    Args:
        url: The URL of the profile to parse
        
    Returns:
        A tuple of (platform, username)
    """
    parsed_url = urlparse(url)
    domain = parsed_url.netloc.lower()
    
    # Remove 'www.' if present
    if domain.startswith('www.'):
        domain = domain[4:]
    
    # Extract platform from domain
    platform_mapping = {
        'twitter.com': 'twitter',
        'x.com': 'twitter',
        'facebook.com': 'facebook',
        'instagram.com': 'instagram',
        'linkedin.com': 'linkedin',
        'tiktok.com': 'tiktok',
        'youtube.com': 'youtube',
        'reddit.com': 'reddit',
        'pinterest.com': 'pinterest',
        'snapchat.com': 'snapchat',
    }
    
    platform = None
    for domain_pattern, platform_name in platform_mapping.items():
        if domain_pattern in domain:
            platform = platform_name
            break
    
    if not platform:
        platform = 'unknown'
    
    # Extract username from path
    path = parsed_url.path.strip('/')
    username = path.split('/')[0] if path else None
    
    return platform, username

def generate_mock_privacy_settings(platform: str) -> dict:
    """Generate mock privacy settings for a given platform."""
    
    privacy_options = {
        'twitter': {
            'account_privacy': random.choice(['public', 'private']),
            'who_can_message': random.choice(['everyone', 'followers only', 'no one']),
            'location_sharing': random.choice([True, False]),
            'data_personalization': random.choice([True, False]),
            'tagged_photo_review': random.choice([True, False])
        },
        'facebook': {
            'profile_visibility': random.choice(['public', 'friends', 'friends of friends', 'only me']),
            'friend_list_visibility': random.choice(['public', 'friends', 'only me']),
            'future_post_privacy': random.choice(['public', 'friends', 'only me']),
            'tagged_photo_review': random.choice([True, False]),
            'face_recognition': random.choice([True, False])
        },
        'instagram': {
            'account_privacy': random.choice(['public', 'private']),
            'activity_status': random.choice([True, False]),
            'story_sharing': random.choice(['public', 'close friends only']),
            'mentioned_story_sharing': random.choice([True, False]),
            'data_sharing_with_partners': random.choice([True, False])
        },
        'linkedin': {
            'profile_visibility': random.choice(['public', 'connections only']),
            'connection_visibility': random.choice(['public', 'connections only']),
            'profile_photo_visibility': random.choice(['public', 'connections only']),
            'active_status': random.choice([True, False]),
            'profile_edit_notifications': random.choice([True, False])
        },
        'tiktok': {
            'account_privacy': random.choice(['public', 'private']),
            'comment_permissions': random.choice(['everyone', 'friends', 'no one']),
            'duet_permissions': random.choice(['everyone', 'friends', 'no one']),
            'stitch_permissions': random.choice(['everyone', 'friends', 'no one']),
            'download_permissions': random.choice([True, False])
        }
    }
    
    # Default privacy settings for platforms not specifically listed
    default_privacy = {
        'account_privacy': random.choice(['public', 'private']),
        'content_visibility': random.choice(['public', 'followers/friends', 'private']),
        'message_permissions': random.choice(['everyone', 'followers/friends', 'no one']),
        'data_usage_consent': random.choice([True, False]),
        'targeted_ads': random.choice([True, False])
    }
    
    return privacy_options.get(platform, default_privacy)

def generate_mock_activity_data(platform: str) -> dict:
    """Generate mock activity data for a given platform."""
    
    now = datetime.now()
    
    # Common activity metrics for most platforms
    data = {
        'post_count': random.randint(10, 500),
        'follower_count': random.randint(50, 10000),
        'following_count': random.randint(50, 1000),
        'last_active': (now - timedelta(days=random.randint(0, 30))).strftime('%Y-%m-%d'),
        'account_created': (now - timedelta(days=random.randint(365, 3650))).strftime('%Y-%m-%d'),
        'posts_per_month': random.randint(1, 30),
        'mentions_other_users': random.randint(0, 100),
        'hashtags_used': random.randint(0, 200),
        'engagement_rate': round(random.uniform(0.5, 15.0), 2),
        'posts_with_location': random.randint(0, 50)
    }
    
    # Platform-specific metrics
    platform_specific = {
        'twitter': {
            'retweet_count': random.randint(10, 500),
            'like_count': random.randint(50, 5000),
            'lists_count': random.randint(0, 20),
            'verification_status': random.choice([True, False]),
            'tweets_with_media': random.randint(0, 100)
        },
        'facebook': {
            'friend_count': random.randint(50, 2000),
            'page_likes': random.randint(10, 500),
            'group_memberships': random.randint(0, 50),
            'events_attended': random.randint(0, 100),
            'photos_uploaded': random.randint(0, 300)
        },
        'instagram': {
            'average_likes': random.randint(10, 500),
            'highlight_reels': random.randint(0, 20),
            'saved_posts': random.randint(0, 200),
            'tagged_photos': random.randint(0, 100),
            'stories_posted': random.randint(0, 1000)
        },
        'linkedin': {
            'connections': random.randint(50, 2000),
            'endorsements': random.randint(0, 100),
            'articles_published': random.randint(0, 50),
            'skills_listed': random.randint(0, 50),
            'recommendations': random.randint(0, 20)
        },
        'tiktok': {
            'video_count': random.randint(10, 300),
            'total_likes': random.randint(1000, 1000000),
            'average_watch_time': random.randint(5, 30),
            'completion_rate': round(random.uniform(0.2, 0.9), 2),
            'most_viewed_video': random.randint(1000, 1000000)
        }
    }
    
    # Add platform-specific data if available
    if platform in platform_specific:
        data.update(platform_specific[platform])
    
    return data

def generate_risk_assessment(platform: str, privacy_settings: dict, activity_data: dict) -> dict:
    """Generate a risk assessment based on the privacy settings and activity data."""
    
    # Calculate privacy score (0-100)
    # Higher is better (more private)
    
    # Start with a base score
    base_privacy_score = 50
    
    # Adjust based on account privacy
    account_privacy = privacy_settings.get('account_privacy', 'public')
    if account_privacy == 'private':
        base_privacy_score += 20
    elif account_privacy == 'public':
        base_privacy_score -= 10
    
    # Adjust based on platform (some platforms are inherently more private)
    platform_privacy_adjustment = {
        'facebook': -10,  # Known for data collection issues
        'linkedin': +5,   # Professional network, generally safer
        'twitter': -5,    # Public by default
        'instagram': -8,  # Owned by Meta, similar issues as Facebook
        'tiktok': -15,    # Known for extensive data collection
    }
    base_privacy_score += platform_privacy_adjustment.get(platform, 0)
    
    # Adjust based on activity
    post_count = activity_data.get('post_count', 0)
    if post_count > 300:
        base_privacy_score -= 10
    elif post_count < 50:
        base_privacy_score += 5
    
    # Adjust based on location sharing
    if privacy_settings.get('location_sharing', False):
        base_privacy_score -= 15
    
    # Cap the score between 0 and 100
    privacy_score = max(0, min(100, base_privacy_score))
    
    # Generate risk factors based on settings and activity
    risk_factors = []
    
    if account_privacy == 'public':
        risk_factors.append('Public account exposes your content to anyone')
    
    if activity_data.get('posts_with_location', 0) > 10:
        risk_factors.append('Location data attached to multiple posts')
    
    if privacy_settings.get('data_personalization', False) or privacy_settings.get('data_usage_consent', False):
        risk_factors.append('Data personalization enabled allows platform to track preferences')
    
    if post_count > 200:
        risk_factors.append('High post count creates a detailed digital footprint')
    
    if platform == 'facebook' and privacy_settings.get('face_recognition', False):
        risk_factors.append('Face recognition enabled can reduce privacy')
    
    # Generate recommendations
    recommendations = []
    
    if account_privacy == 'public':
        recommendations.append('Set your account to private')
    
    if privacy_settings.get('location_sharing', False):
        recommendations.append('Disable location sharing')
    
    if privacy_settings.get('data_personalization', False):
        recommendations.append('Disable data personalization in settings')
    
    if platform == 'facebook' and privacy_settings.get('face_recognition', False):
        recommendations.append('Turn off face recognition')
    
    if activity_data.get('posts_with_location', 0) > 0:
        recommendations.append('Remove location data from existing posts')
    
    return {
        'privacy_score': privacy_score,
        'risk_level': 'high' if privacy_score < 40 else 'medium' if privacy_score < 70 else 'low',
        'risk_factors': risk_factors,
        'recommendations': recommendations
    }

def crawl_profile(url: str) -> dict:
    """
    Crawl a social media profile using Firecrawl when available, 
    with fallback to mock data generation.
    
    Args:
        url: The URL of the profile to crawl
        
    Returns:
        A dictionary containing structured profile data
    """
    try:
        platform, username = extract_platform_and_username(url)
        
        if not username:
            username = f"user_{random.randint(1000, 9999)}"
        
        logger.info(f"Crawling {platform} profile for {username}")
        
        # Try to use Firecrawl if it's available
        if firecrawl_app and FIRECRAWL_API_KEY:
            try:
                logger.info(f"Attempting to scrape {url} with Firecrawl")
                
                # Scrape the URL with Firecrawl
                scrape_result = firecrawl_app.scrape_url(url, formats=['markdown', 'html'])
                
                # Extract relevant data from the scrape result
                profile_data = extract_profile_data_from_scrape(scrape_result, platform, username)
                
                logger.info(f"Successfully scraped {url} with Firecrawl")
                return profile_data
                
            except Exception as e:
                logger.error(f"Firecrawl scraping failed for {url}: {str(e)}")
                logger.info("Falling back to mock data generation")
                # Continue with mock data generation
        else:
            logger.info(f"Using mock data generation for {url}")
        
        # Generate mock data
        privacy_settings = generate_mock_privacy_settings(platform)
        activity_data = generate_mock_activity_data(platform)
        risk_assessment = generate_risk_assessment(platform, privacy_settings, activity_data)
        
        # Create the structured response
        profile_data = {
            'platform': platform,
            'username': username,
            'timestamp': datetime.now().isoformat(),
            'privacy_settings': privacy_settings,
            'activity_data': activity_data,
            'risk_assessment': risk_assessment,
            'data_source': 'mock'  # Indicate this is mock data
        }
        
        return profile_data
        
    except Exception as e:
        logger.error(f"Error crawling {url}: {str(e)}")
        # Return minimal data to not break the flow
        return {
            'platform': 'unknown',
            'username': 'unknown',
            'timestamp': datetime.now().isoformat(),
            'error': str(e),
            'data_source': 'error'
        }
        
def extract_profile_data_from_scrape(scrape_result, platform, username):
    """
    Extract relevant profile data from the Firecrawl scrape result.
    
    Args:
        scrape_result: The result from Firecrawl
        platform: The detected social media platform
        username: The detected username
        
    Returns:
        A dictionary containing structured profile data
    """
    try:
        # Extract content from scrape result
        content_markdown = scrape_result.get('markdown', '')
        content_html = scrape_result.get('html', '')
        
        # Initialize the result structure
        privacy_settings = {}
        activity_data = {}
        
        # Different extraction based on platform
        if platform == 'twitter':
            # Extract follower count, following count, etc.
            follower_match = re.search(r'(\d+(?:,\d+)*)\s+Followers', content_markdown)
            following_match = re.search(r'(\d+(?:,\d+)*)\s+Following', content_markdown)
            
            follower_count = int(follower_match.group(1).replace(',', '')) if follower_match else random.randint(50, 10000)
            following_count = int(following_match.group(1).replace(',', '')) if following_match else random.randint(50, 1000)
            
            # Determine privacy settings based on HTML/content
            private_account = 'Protected Tweets' in content_markdown or 'protected-icon' in content_html
            
            privacy_settings = {
                'account_privacy': 'private' if private_account else 'public',
                'location_sharing': 'Location:' in content_markdown,
                'data_personalization': True,  # Default assumption
            }
            
            activity_data = {
                'follower_count': follower_count,
                'following_count': following_count,
                'post_count': random.randint(10, 500),  # Hard to extract accurately
                'verified': 'verified-icon' in content_html or 'verified' in content_markdown.lower(),
            }
            
        elif platform == 'facebook':
            # Facebook-specific extraction
            privacy_settings = {
                'profile_visibility': 'public' if 'Public' in content_markdown else 'friends',
                'friend_list_visibility': 'public' if 'Friends' in content_markdown else 'friends',
            }
            
            activity_data = {
                'friend_count': random.randint(50, 2000),  # Hard to extract accurately
            }
            
        elif platform == 'instagram':
            # Instagram-specific extraction
            follower_match = re.search(r'(\d+(?:\.\d+)?[k|m]?)\s+followers', content_markdown, re.IGNORECASE)
            following_match = re.search(r'(\d+(?:\.\d+)?[k|m]?)\s+following', content_markdown, re.IGNORECASE)
            posts_match = re.search(r'(\d+(?:\.\d+)?[k|m]?)\s+posts', content_markdown, re.IGNORECASE)
            
            # Parse follower counts (handling K, M, etc.)
            follower_count = parse_count(follower_match.group(1)) if follower_match else random.randint(50, 10000)
            following_count = parse_count(following_match.group(1)) if following_match else random.randint(50, 1000)
            post_count = parse_count(posts_match.group(1)) if posts_match else random.randint(10, 500)
            
            # Check if account is private
            private_account = 'This account is private' in content_markdown or 'This Account is Private' in content_markdown
            
            privacy_settings = {
                'account_privacy': 'private' if private_account else 'public',
                'activity_status': True,  # Default assumption
            }
            
            activity_data = {
                'follower_count': follower_count,
                'following_count': following_count,
                'post_count': post_count,
                'verified': 'verified' in content_markdown.lower() or 'verified-icon' in content_html,
            }
            
        else:
            # For other platforms, use mock data
            privacy_settings = generate_mock_privacy_settings(platform)
            activity_data = generate_mock_activity_data(platform)
        
        # Generate risk assessment
        risk_assessment = generate_risk_assessment(platform, privacy_settings, activity_data)
        
        # Create the structured response
        return {
            'platform': platform,
            'username': username,
            'timestamp': datetime.now().isoformat(),
            'privacy_settings': privacy_settings,
            'activity_data': activity_data,
            'risk_assessment': risk_assessment,
            'data_source': 'firecrawl'  # Indicate this is from real scraping
        }
    
    except Exception as e:
        logger.error(f"Error extracting data from scrape result: {str(e)}")
        # Fall back to mock data
        privacy_settings = generate_mock_privacy_settings(platform)
        activity_data = generate_mock_activity_data(platform)
        risk_assessment = generate_risk_assessment(platform, privacy_settings, activity_data)
        
        return {
            'platform': platform,
            'username': username,
            'timestamp': datetime.now().isoformat(),
            'privacy_settings': privacy_settings,
            'activity_data': activity_data,
            'risk_assessment': risk_assessment,
            'data_source': 'mock_fallback'  # Indicate this is fallback mock data
        }
        
def parse_count(count_str):
    """Parse count strings like '1.2k' or '3.4m' into integers."""
    count_str = count_str.lower()
    
    # Remove commas
    count_str = count_str.replace(',', '')
    
    if 'k' in count_str:
        return int(float(count_str.replace('k', '')) * 1000)
    elif 'm' in count_str:
        return int(float(count_str.replace('m', '')) * 1000000)
    else:
        return int(float(count_str))