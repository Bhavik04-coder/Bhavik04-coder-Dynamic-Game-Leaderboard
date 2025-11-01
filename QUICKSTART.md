# 🚀 Quick Start Guide

## For Windows PowerShell Users:

### Option 1: Use PowerShell Script (Recommended)
```powershell
.\start.ps1
```

### Option 2: Use Batch Files
```cmd
.\install.bat    # First time only
.\run.bat        # Start the server
```

### Option 3: Manual Commands
```powershell
# Install dependencies (first time only)
cd backend
npm install
cd ..

# Start the server
cd backend
node server.js
```

## ✅ Server is Running!

The server is now running at: **http://localhost:3000**

### What to do next:

1. **Open your browser** and go to `http://localhost:3000`
2. **Create an account** by entering a username and email
3. **Start playing** - submit scores and compete!

### Default Games Available:
- 🏎️ Speed Racing
- 🧩 Brain Puzzle  
- 🎯 Target Shooter

### Features to Try:
- ✨ Submit scores and see real-time rank updates
- 🎮 Add custom games with your own themes
- 👤 View your profile and statistics
- 🔍 Search and filter leaderboards
- 📱 Works on mobile devices too!

### To Stop the Server:
Press `Ctrl + C` in the terminal where the server is running.

---

## Troubleshooting:

### "Node.js not found"
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### "npm install failed"
- Make sure you have internet connection
- Try running as administrator
- Delete `backend/node_modules` folder and try again

### "Port 3000 already in use"
- Close other applications using port 3000
- Or change the port in `backend/server.js` (line 6)

### Browser shows "Cannot connect"
- Make sure the server is running (check terminal output)
- Try refreshing the page
- Check if Windows Firewall is blocking the connection

---

**🎮 Happy Gaming! 🏆**