# Fiasco - Social Media Privacy Analyzer

A privacy analysis tool that crawls social media profiles and provides a privacy report dashboard.

## Project Structure

- `backend/`: Flask backend API and crawler
- `app/`, `components/`: Next.js frontend
- `.github/workflows/`: CI/CD configuration

## Setup

### Prerequisites

- Python 3.11+
- Node.js 20+
- pnpm
- uv (for Python dependency management)

### Backend Setup

```bash
# Create a virtual environment and install dependencies
make setup-backend
```

### Frontend Setup

```bash
# Install frontend dependencies
make setup-frontend
```

### All-in-one Setup

```bash
# Setup both backend and frontend
make setup
```

## Running the Application

### Backend Server

```bash
# Run the Flask backend server
make run-backend

# Or in development mode with hot reload
make run-backend-dev
```

### Frontend Server

```bash
# Run the Next.js frontend development server
make run-frontend
```

## Testing

```bash
# Run backend tests
make test-backend

# Run frontend tests
make test-frontend

# Run all tests
make test
```

## CI/CD

This project uses GitHub Actions for continuous integration:

- Backend CI: Runs Python tests for backend code changes
- Frontend CI: Runs linting and build checks for frontend code changes

## Development Workflow

1. Make changes to the code
2. Run tests locally: `make test`
3. Run CI checks locally: `make ci-checks`
4. Commit and push changes
5. CI will run on GitHub to verify your changes

## Available Make Commands

Run `make help` to see all available commands.