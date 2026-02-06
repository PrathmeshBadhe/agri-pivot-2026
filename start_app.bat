@echo off
setlocal

echo.
echo ===================================================
echo [32m 🌱 Starting Agri-Pivot AI System... (One-Click) [0m
echo ===================================================
echo.

:: 1. Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [31m [ERROR] Node.js is not installed! Please install it from nodejs.org [0m
    pause
    exit /b
)

:: 2. Check and Install Frontend Dependencies
echo [36m [INFO] Checking Frontend Dependencies... [0m
if not exist "frontend_ts\node_modules" (
    echo [33m [WARN] node_modules missing! Installing npm packages... [0m
    cd frontend_ts
    call npm install
    cd ..
) else (
    echo [32m [OK] Frontend ready. [0m
)

:: 3. Check and Install Backend (Python)
echo [36m [INFO] Checking Backend Environment... [0m
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [31m [ERROR] Python is not installed! [0m
    pause
    exit /b
)

:: Check if dependencies installed (basic check)
cd backend
if not exist "venv" (
   echo [33m [WARN] Creating Python venv... [0m
   python -m venv venv
)
:: Activating venv and installing requiremenets is tricky in a single bat flow without halting
:: Simplified: Just run regular install if requirements change
echo [33m [INFO] Ensuring Python options... [0m
pip install -r requirements.txt >nul 2>&1
cd ..

:: 4. LAUNCH EVERYTHING
echo.
echo [32m 🚀 Launching Agri-Pivot AI (Frontend + Backend)... [0m
echo.

cd frontend_ts
call npm run start-all

:: Keep window open if it crashes
if %errorlevel% neq 0 (
    echo [31m [ERROR] App crashed! See logs above. [0m
    pause
)
