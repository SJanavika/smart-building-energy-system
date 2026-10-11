@echo off
TITLE Smart Building Energy Management System - Quick Runner
cls
echo =====================================================================
echo    SMART BUILDING ENERGY MANAGEMENT SYSTEM USING AI
echo =====================================================================
echo.
echo Choose an option:
echo [1] Start Python FastAPI AI Service (Port 8000)
echo [2] Start Spring Boot Backend (Port 8080)
echo [3] Start React Frontend (Port 3000)
echo [4] Start Everything via Docker Compose
echo [5] Generate Synthetic Energy Dataset
echo [6] Exit
echo.
set /p opt="Enter option (1-6): "

if "%opt%"=="1" (
    echo Starting AI Microservice on Port 8000...
    cd ai-service
    if not exist "venv" (
        echo Creating virtual environment...
        python -m venv venv
    )
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
    python data_generator_standalone.py
    python train.py
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
)

if "%opt%"=="2" (
    echo Starting Spring Boot Backend on Port 8080...
    cd backend
    mvn spring-boot:run
)

if "%opt%"=="3" (
    echo Starting React Frontend on Port 3000...
    cd frontend
    npm install
    npm run dev
)

if "%opt%"=="4" (
    echo Launching Docker Compose Stack...
    docker-compose up --build
)

if "%opt%"=="5" (
    echo Generating 4,320+ Hourly Telemetry Records...
    cd ai-service
    python data_generator_standalone.py
    pause
)

pause
