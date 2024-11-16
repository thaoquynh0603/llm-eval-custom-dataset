@echo off

REM --- Run Backend Docker Container in a New Terminal ---
echo Running backend Docker container...
start cmd /k "docker run -d --name llm-eval-backend-container -p 8000:8000 llm-eval-backend & echo Backend running at http://localhost:8000 & pause"

REM --- Run Frontend Docker Container in a New Terminal ---
echo Running frontend Docker container...
start cmd /k "docker run -d --name llm-eval-frontend-container -p 3000:3000 llm-eval-frontend & echo Frontend running at http://localhost:3000 & pause"

echo Docker containers are now running in separate terminals!