# Testing the Full Application

This document provides instructions for testing both the backend and frontend components.

## Backend Tests

The backend tests use pytest to verify the Flask API and crawler functionality.

### Running Backend Tests

To run the backend tests:

```bash
cd backend
. .venv/bin/activate
pytest tests/
```

### Mock Tests

The `test_mocks.py` file contains tests that mock the crawler functionality to ensure the API works correctly:

1. `test_profiles_endpoint_with_mocked_crawler`: Tests the `/profiles` endpoint with a mocked crawler function
2. `test_user_id_creation_and_retrieval`: Tests user_id creation, storage, and retrieval
3. `test_crawler_accepts_any_domain`: Tests that the API works with any domain name

## Frontend Tests

The frontend tests use Jest and React Testing Library to verify the React components.

### Setting Up Frontend Tests

First, install the required dependencies:

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @types/jest
```

### Running Frontend Tests

To run the frontend tests:

```bash
npm test
```

Or to run tests in watch mode:

```bash
npm run test:watch
```

### Mock API

The `lib/mocks/api-mock.ts` file contains a mock implementation of the PrivacyAPI for testing purposes. This mock:

1. Simulates the API responses without making actual HTTP requests
2. Provides realistic mock data for different platforms
3. Allows storing and retrieving profile data with user IDs

### Component Tests

The frontend tests verify the following components:

1. `ProfileForm`: Tests form submission, validation, and API integration
2. `ConnectedDashboard`: Tests data loading, storage, and display

## Integration Testing

To test the full integration between frontend and backend:

1. Start both services:
   ```bash
   # Terminal 1
   cd backend
   . .venv/bin/activate
   python run.py
   
   # Terminal 2
   npm run dev
   ```

2. Visit http://localhost:3000/connected in your browser
3. Submit profile URLs and verify results
4. Check browser localStorage for the saved user_id
5. Refresh the page to verify data persistence

## Running All Tests

To run both backend and frontend tests in sequence:

```bash
# Make sure to update package.json with this script first
npm run test:all
```

This will run the Jest tests for the frontend and then the pytest tests for the backend.

## Continuous Integration

For CI environments, you can use the following steps:

1. Install backend dependencies:
   ```bash
   cd backend
   python -m pip install -r requirements.txt
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Run tests:
   ```bash
   npm run test:all
   ```

## Troubleshooting

### Backend Tests

- If you get import errors, make sure you're running the tests from the backend directory
- Verify that your virtual environment is activated

### Frontend Tests

- For Jest configuration issues, check the `jest.config.js` file
- For component rendering issues, check the mock implementations in `jest.setup.js`

### Integration Testing

- Check browser network tab to debug API request/response issues
- Use console.log in component code to trace data flow