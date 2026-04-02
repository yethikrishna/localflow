#!/bin/bash

# Simple healthcheck script for LocalFlow services

services=("localflow-app" "localflow-db" "localflow-redis" "localflow-ollama")

for service in "${services[@]}"; do
  echo -n "Checking health of $service... "
  status=$(docker inspect --format='{{json .State.Health.Status}}' "$service" 2>/dev/null)
  
  if [ "$status" == "\"healthy\"" ]; then
    echo -e "\e[32mHEALTHY\e[0m"
  elif [ "$status" == "\"unhealthy\"" ]; then
    echo -e "\e[31mUNHEALTHY\e[0m"
  elif [ -z "$status" ]; then
    # Maybe the container doesn't have a health check defined in Docker but is running
    is_running=$(docker inspect --format='{{.State.Running}}' "$service" 2>/dev/null)
    if [ "$is_running" == "true" ]; then
      echo -e "\e[33mRUNNING (No health check)\e[0m"
    else
      echo -e "\e[31mNOT RUNNING\e[0m"
    fi
  else
    echo -e "\e[33m$status\e[0m"
  fi
done

# Check if localflow-app /health endpoint is reachable
if [ "$(docker inspect --format='{{.State.Running}}' localflow-app 2>/dev/null)" == "true" ]; then
  echo -n "Pinging localflow-app /health... "
  # We try to use wget from inside the container or curl from host if available
  if curl -s --fail http://localhost:3000/health > /dev/null; then
    echo -e "\e[32mOK\e[0m"
  else
    echo -e "\e[31mFAILED\e[0m"
  fi
fi
