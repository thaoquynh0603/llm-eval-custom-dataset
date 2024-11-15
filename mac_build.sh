#!/bin/bash

# --- Navigate to the backend folder and build the Docker image ---
echo "Navigating to llm_eval_backend and building backend Docker image..."
cd llm_eval_backend
docker build -t llm-eval-backend .

# --- Navigate to the frontend folder and build the Docker image ---
echo "Navigating to llm_eval_frontend and building frontend Docker image..."
cd ../llm_eval_frontend
docker build -t llm-eval-frontend .

# --- Display message that containers are built ---
echo "Backend and Frontend Docker images have been successfully built!"

