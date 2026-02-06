@echo off
echo Starting Agri-Pivot AI System (Industry-Grade Edition)...

echo Starting Backend Server (Port 8000)...
start "Agri-Pivot Backend" cmd /k "cd backend && python main.py"

echo Starting Frontend Server (Port 5173)...
start "Agri-Pivot Frontend" cmd /k "cd frontend_ts && npm run dev"

echo System Started! Check the opened windows.
pause
