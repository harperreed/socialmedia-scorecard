.PHONY: setup-backend setup-frontend run-backend run-backend-dev run-frontend test-backend test-frontend

# Setup commands
setup-backend:
	cd backend && uv venv && . .venv/bin/activate && uv pip install -r requirements.txt

setup-frontend:
	pnpm install

setup: setup-backend setup-frontend

# Run commands
run-backend:
	cd backend && . .venv/bin/activate && python run.py

run-backend-dev:
	cd backend && . .venv/bin/activate && FLASK_APP=app.py FLASK_ENV=development python -m flask run --host=0.0.0.0 --port=5000

run-frontend:
	pnpm dev

# Test commands
test-backend:
	cd backend && . .venv/bin/activate && python -m pytest tests/

test-frontend:
	pnpm test

# All tests
test: test-backend test-frontend

# CI checks
ci-checks:
	pnpm lint
	cd backend && . .venv/bin/activate && python -m pytest tests/

# Default command when just running 'make'
all: setup test

# Help command
help:
	@echo "Available commands:"
	@echo "  make setup-backend      - Setup Python backend environment"
	@echo "  make setup-frontend     - Setup Node.js frontend environment"
	@echo "  make setup              - Setup both backend and frontend"
	@echo "  make run-backend        - Run the Flask backend server"
	@echo "  make run-backend-dev    - Run the Flask backend server in development mode"
	@echo "  make run-frontend       - Run the Next.js frontend development server"
	@echo "  make test-backend       - Run backend tests"
	@echo "  make test-frontend      - Run frontend tests"
	@echo "  make test               - Run all tests"
	@echo "  make ci-checks          - Run CI checks locally"
	@echo "  make all                - Setup and test everything"
	@echo "  make help               - Show this help message"