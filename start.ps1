Write-Host "🎮 Elite Gaming Leaderboard System" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if backend dependencies are installed
$nodeModulesPath = Join-Path $PSScriptRoot "backend\node_modules"
if (-not (Test-Path $nodeModulesPath)) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    
    Push-Location (Join-Path $PSScriptRoot "backend")
    try {
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "npm install failed"
        }
        Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install dependencies: $_" -ForegroundColor Red
        Pop-Location
        Read-Host "Press Enter to exit"
        exit 1
    }
    Pop-Location
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Starting server..." -ForegroundColor Yellow
Write-Host "🌐 Open your browser to: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🛑 Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Start the server
Push-Location (Join-Path $PSScriptRoot "backend")
try {
    node server.js
} catch {
    Write-Host "❌ Failed to start server: $_" -ForegroundColor Red
} finally {
    Pop-Location
}

Read-Host "Press Enter to exit"