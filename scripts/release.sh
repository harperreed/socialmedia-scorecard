#!/bin/bash
set -e

# Get the new version from the command line
if [ -z "$1" ]; then
  echo "Please provide a version number (e.g. 1.0.0)"
  exit 1
fi

NEW_VERSION=$1
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Ensure we're on the main branch
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "Please switch to the main branch before releasing"
  exit 1
fi

# Ensure the working directory is clean
if [ -n "$(git status --porcelain)" ]; then
  echo "Working directory is not clean. Please commit or stash changes."
  exit 1
fi

# Pull latest changes
git pull origin main

# Run tests
echo "Running tests..."
make test

# Update version in package.json
echo "Updating version to $NEW_VERSION..."
sed -i '' "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" package.json

# Create a release commit
git add package.json
git commit -m "Release v$NEW_VERSION"

# Create a git tag
git tag -a "v$NEW_VERSION" -m "Version $NEW_VERSION"

# Push changes and tag
echo "Pushing changes and tag..."
git push origin main
git push origin "v$NEW_VERSION"

echo "Release v$NEW_VERSION completed successfully!"
echo "Remember to update the release notes on GitHub: https://github.com/yourusername/fiasco/releases/new?tag=v$NEW_VERSION"