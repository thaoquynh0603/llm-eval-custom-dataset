#!/bin/bash

# --- Run Backend Docker Container in a New Terminal ---
echo "Running backend Docker container..."
osascript -e 'tell app "Terminal" to do script "docker run -d -p 8000:8000 llm-eval-backend && echo Backend running at http://localhost:8000 && read -p \"Press [Enter] to exit...\""'

# --- Run Frontend Docker Container in a New Terminal ---
echo "Running frontend Docker container..."
osascript -e 'tell app "Terminal" to do script "docker run -d -p 3000:3000 llm-eval-frontend && echo Frontend running at http://localhost:3000 && read -p \"Press [Enter] to exit...\""'

echo "Docker containers are now running in separate terminals!"
