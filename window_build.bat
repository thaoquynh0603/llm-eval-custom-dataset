@echo off
REM Navigate to the backend folder and build the Docker image
cd llm_eval_backend
docker build -t llm-eval-backend .

REM Navigate to the frontend folder and build the Docker image
cd ..\llm_eval_frontend
docker build -t llm-eval-frontend .

REM Display message that containers are running
echo Backend and Frontend containers are running!

REM Keeps the terminal open
pause
