# Testing the Frontend-Backend Connection

This document explains how to test the connection between the Next.js frontend and the Flask backend.

## Prerequisites

1. Make sure both the backend and frontend services are running:

```bash
# Terminal 1: Run the Flask backend
cd backend
. .venv/bin/activate
python run.py
```

```bash
# Terminal 2: Run the Next.js frontend
npm run dev
```

## Testing Steps

### 1. Access the Connected Dashboard

Visit [http://localhost:3000/connected](http://localhost:3000/connected) to access the connected dashboard that integrates with the Flask backend.

### 2. Submit Profiles for Analysis

1. You should see a form to enter social media profile URLs
2. Enter URLs like:
   - `https://twitter.com/someusername`
   - `https://facebook.com/someusername`
   - `https://instagram.com/someusername`
   - `https://linkedin.com/in/someusername`
3. Click "Analyze Profiles"

### 3. Check Backend Logs

In your Flask terminal, you should see logs indicating:
- Received URLs
- Crawling activity for each URL
- Storage of results with a user_id

### 4. Verify Frontend Display

After submission, the frontend should:
1. Show a success toast
2. Display the privacy analysis results
3. Store the user_id in localStorage
4. Show tabs for each platform detected

### 5. Test Data Persistence

1. Refresh the page
2. The application should automatically fetch previously analyzed profiles
3. Your session ID should be visible near the top of the dashboard

### 6. Test Refresh Functionality

1. Click the "Refresh" button
2. The backend should re-analyze the same URLs
3. The frontend should update with new results

### 7. Test Export Functionality

1. Click the "Export Report" button
2. A JSON file should download containing your profile analysis data

## Troubleshooting

### CORS Issues

If you're experiencing CORS errors:
1. Verify the Flask backend has CORS properly enabled
2. Check the backend is running on http://localhost:5000
3. Ensure proper headers are being sent in the requests

### Connection Issues

If the frontend can't connect to the backend:
1. Check that both services are running
2. Verify the API URL in `lib/privacy-api.ts` is correctly set to `http://localhost:5000`
3. Check your browser console for network errors

### Data Issues

If data is not displaying correctly:
1. Use browser developer tools to inspect the network requests
2. Check the response data format from the backend
3. Verify the frontend components are properly using the data structure

## Manual Testing of Backend API

You can also directly test the backend API using curl:

```bash
# Submit profiles for analysis
curl -X POST http://localhost:5000/profiles \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://twitter.com/someuser", "https://facebook.com/someuser"]}'

# Get stored results for a user ID
curl http://localhost:5000/profiles/YOUR_USER_ID_HERE
```