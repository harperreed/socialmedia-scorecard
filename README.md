# FIASCO - Social Media Privacy Analyzer 🛡️

FIASCO is a comprehensive privacy analysis tool that crawls your social media profiles and provides detailed reports about your digital privacy exposure. Get insights, recommendations, and actionable steps to secure your online presence.

## Summary of Project 🔍

FIASCO combines a Next.js frontend with a Flask backend to analyze privacy settings across various social media platforms. The application crawls profile data, identifies potential privacy risks, and generates a comprehensive privacy report with specific recommendations for improving your online security posture.

Key features include:
- 📊 Overall privacy score calculation
- 🔒 Platform-specific privacy analysis
- 📱 Support for multiple social media platforms (Twitter, Facebook, Instagram, LinkedIn)
- 📋 Detailed reports on data exposure metrics
- 📈 Visual representation of privacy risks
- 💡 Actionable privacy recommendations

## How to Use 💻

### Prerequisites

To run FIASCO, you'll need:
- Python 3.11+
- Node.js 20+
- pnpm
- uv (for Python dependency management)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/harperreed/fiasco.git
   cd fiasco
   ```

2. **Set up the backend:**
   ```bash
   make setup-backend
   ```

3. **Set up the frontend:**
   ```bash
   make setup-frontend
   ```

4. **Start the services:**

   In one terminal, start the backend:
   ```bash
   make run-backend
   ```
   
   In another terminal, start the frontend:
   ```bash
   make run-frontend
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000/connected` to access the dashboard.

### Using the Application

1. **Submit Profile URLs:**
   - Enter the URLs of your social media profiles (e.g., `https://twitter.com/username`)
   - Click "Analyze Profiles"

2. **View the Privacy Report:**
   - The dashboard will display your overall privacy score
   - Navigate through the tabs to see platform-specific analyses
   - Review recommendations to improve your privacy

3. **Export Reports:**
   - Click the "Export Report" button to download your privacy analysis as a JSON file

## Tech Information 🧰

### Architecture

FIASCO uses a client-server architecture:

- **Frontend**: Next.js with React, TypeScript, and Tailwind CSS
  - Component library: Shadcn UI
  - State management: React context
  
- **Backend**: Flask with Python
  - Database: SQLite with SQLAlchemy ORM
  - Crawling: Custom crawler with mock data generation

### Key Components

#### Frontend
- `ConnectedDashboard`: Main dashboard component for the connected experience
- `ProfileForm`: User interface for submitting social media profiles
- `PrivacyContext`: Context provider for managing privacy data state
- `ProfileResult`: Component for displaying individual profile analysis results

#### Backend
- `app.py`: Flask application with API endpoints
- `crawler.py`: Core logic for crawling and analyzing social media profiles
- `models.py`: Database models for storing user profiles and analysis

### API Endpoints

- `POST /profiles`: Submit URLs for analysis
- `GET /profiles/<user_id>`: Retrieve analysis for a specific user

### Testing

Run tests with:

```bash
# Backend tests
make test-backend

# Frontend tests
make test-frontend

# All tests
make test
```

### Development Workflow

1. Make changes to the code
2. Run tests locally: `make test`
3. Run CI checks locally: `make ci-checks`
4. Commit and push changes
5. CI will run on GitHub to verify your changes

## Contributing 👥

Contributions are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📝

FIASCO is available under the MIT license. See the LICENSE file for more info.

---

Created with ❤️ by [harperreed](https://github.com/harperreed)
