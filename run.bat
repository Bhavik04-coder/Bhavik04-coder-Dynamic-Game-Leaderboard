@echo off
echo 🎮 Starting Elite Gaming Leaderboard System...
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is available
echo.

if not exist "%~dp0backend\node_modules" (
    echo 📦 Installing dependencies first...
    cd /d "%~dp0backend"
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies!
        pause
        exit /b 1
    )
    cd /d "%~dp0"
)

echo 🚀 Starting server...
echo 🌐 Open your browser to: http://localhost:3000
echo 🛑 Press Ctrl+C to stop the server
echo.

cd /d "%~dp0backend"
node server.js

pause