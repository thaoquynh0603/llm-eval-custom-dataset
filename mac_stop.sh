#!/bin/bash

# --- Stop Backend Docker Container ---
echo "Stopping backend Docker container..."
docker stop llm-eval-backend

# --- Stop Frontend Docker Container ---
echo "Stopping frontend Docker container..."
docker stop llm-eval-frontend

echo "Docker containers have been stopped"
