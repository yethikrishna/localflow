#!/bin/bash

# LocalFlow One-Click Setup Script

echo "--- LocalFlow Setup ---"

# 1. Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running. Please start Docker and try again."
  exit 1
fi

# 2. Setup .env file
if [ ! -f .env ]; then
  echo "Copying .env.example to .env..."
  cp .env.example .env
  echo "Please check your .env file and adjust as needed."
else
  echo ".env file already exists. Skipping copy."
fi

# 3. Pull and Up
echo "Pulling images and starting services..."
docker compose pull
docker compose up -d

# 4. Wait for health checks
echo "Waiting for services to be healthy..."
# We wait for the main app to be healthy
max_attempts=30
attempt=1
while [ $attempt -le $max_attempts ]; do
  status=$(docker inspect --format='{{.State.Health.Status}}' localflow-app 2>/dev/null)
  if [ "$status" == "healthy" ]; then
    echo "localflow-app is healthy!"
    break
  fi
  echo "Waiting ($attempt/$max_attempts)..."
  sleep 5
  ((attempt++))
done

if [ "$status" != "healthy" ]; then
  echo "Warning: localflow-app did not become healthy in time."
fi

# 5. Success message
LOCAL_URL="http://localhost:3000"
echo "--- LocalFlow Setup Complete ---"
echo "You can access LocalFlow at: $LOCAL_URL"
echo "Traefik dashboard (if enabled): http://localhost:8080"
echo ""
echo "Use ./scripts/healthcheck.sh to check individual service status."
