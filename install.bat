@echo off
echo 🎮 Elite Gaming Leaderboard System - Installation
echo ================================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed
echo.

echo 📦 Installing dependencies...
cd /d "%~dp0backend"
call npm install

if %errorlevel% neq 0 (
    echo ❌ Installation failed!
    pause
    exit /b 1
)

cd /d "%~dp0"
echo.
echo ✅ Installation completed successfully!
echo.
echo 🚀 To start the application, run:
echo    .\start.ps1   (PowerShell)
echo    or
echo    .\run.bat     (Command Prompt)
echo.
echo 🌐 The application will be available at:
echo    http://localhost:3000
echo.
pause