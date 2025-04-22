"""
Database models for the Flask application.
"""
from flask_sqlalchemy import SQLAlchemy
import json
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    """Model for user data."""
    id = db.Column(db.String(36), primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    profiles = db.relationship('Profile', backref='user', lazy=True, cascade="all, delete-orphan")
    
    def __repr__(self):
        return f'<User {self.id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'profiles': [profile.to_dict() for profile in self.profiles]
        }

class Profile(db.Model):
    """Model for profile data."""
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(255), nullable=False)
    platform = db.Column(db.String(50))
    username = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign keys
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    
    # Relationships
    privacy_settings = db.relationship('PrivacySetting', backref='profile', lazy=True, cascade="all, delete-orphan")
    activity_data = db.relationship('ActivityData', backref='profile', lazy=True, cascade="all, delete-orphan")
    risk_assessment = db.relationship('RiskAssessment', backref='profile', lazy=True, cascade="all, delete-orphan")
    
    def __repr__(self):
        return f'<Profile {self.url}>'
    
    def to_dict(self):
        privacy_settings = {}
        for setting in self.privacy_settings:
            privacy_settings[setting.key] = setting.get_value()
            
        activity_data = {}
        for data in self.activity_data:
            activity_data[data.key] = data.get_value()
            
        # There should be only one risk assessment
        risk_data = self.risk_assessment[0] if self.risk_assessment else None
        
        return {
            'platform': self.platform,
            'username': self.username,
            'timestamp': self.updated_at.isoformat() if self.updated_at else None,
            'privacy_settings': privacy_settings,
            'activity_data': activity_data,
            'risk_assessment': risk_data.to_dict() if risk_data else None
        }

class PrivacySetting(db.Model):
    """Model for privacy settings data."""
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), nullable=False)
    value_type = db.Column(db.String(20), nullable=False)  # boolean, string, number
    value_string = db.Column(db.String(255))
    value_boolean = db.Column(db.Boolean)
    value_number = db.Column(db.Float)
    
    # Foreign keys
    profile_id = db.Column(db.Integer, db.ForeignKey('profile.id'), nullable=False)
    
    def __repr__(self):
        return f'<PrivacySetting {self.key}>'
    
    def get_value(self):
        if self.value_type == 'string':
            return self.value_string
        elif self.value_type == 'boolean':
            return self.value_boolean
        elif self.value_type == 'number':
            return self.value_number
        return None
    
    def set_value(self, value):
        if isinstance(value, str):
            self.value_type = 'string'
            self.value_string = value
        elif isinstance(value, bool):
            self.value_type = 'boolean'
            self.value_boolean = value
        elif isinstance(value, (int, float)):
            self.value_type = 'number'
            self.value_number = float(value)

class ActivityData(db.Model):
    """Model for activity data."""
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), nullable=False)
    value_type = db.Column(db.String(20), nullable=False)  # boolean, string, number
    value_string = db.Column(db.String(255))
    value_boolean = db.Column(db.Boolean)
    value_number = db.Column(db.Float)
    
    # Foreign keys
    profile_id = db.Column(db.Integer, db.ForeignKey('profile.id'), nullable=False)
    
    def __repr__(self):
        return f'<ActivityData {self.key}>'
    
    def get_value(self):
        if self.value_type == 'string':
            return self.value_string
        elif self.value_type == 'boolean':
            return self.value_boolean
        elif self.value_type == 'number':
            return self.value_number
        return None
    
    def set_value(self, value):
        if isinstance(value, str):
            self.value_type = 'string'
            self.value_string = value
        elif isinstance(value, bool):
            self.value_type = 'boolean'
            self.value_boolean = value
        elif isinstance(value, (int, float)):
            self.value_type = 'number'
            self.value_number = float(value)

class RiskAssessment(db.Model):
    """Model for risk assessment data."""
    id = db.Column(db.Integer, primary_key=True)
    privacy_score = db.Column(db.Integer)
    risk_level = db.Column(db.String(20))
    risk_factors = db.Column(db.Text)  # Stored as JSON
    recommendations = db.Column(db.Text)  # Stored as JSON
    
    # Foreign keys
    profile_id = db.Column(db.Integer, db.ForeignKey('profile.id'), nullable=False)
    
    def __repr__(self):
        return f'<RiskAssessment {self.id}>'
    
    def to_dict(self):
        return {
            'privacy_score': self.privacy_score,
            'risk_level': self.risk_level,
            'risk_factors': json.loads(self.risk_factors) if self.risk_factors else [],
            'recommendations': json.loads(self.recommendations) if self.recommendations else []
        }
    
    def set_risk_factors(self, factors):
        self.risk_factors = json.dumps(factors)
    
    def set_recommendations(self, recommendations):
        self.recommendations = json.dumps(recommendations)