# 🚀 Quick Start Guide - Backend Server

## ⚠️ Important: Backend Server Must Be Running

The form submission feature requires the backend server to be running on **port 3001**.

## Start Backend Server

### Option 1: Using npm script
```bash
npm run server
```

### Option 2: Direct node command
```bash
node server/index.js
```

### Option 3: Using the batch file (Windows)
```bash
start-backend.bat
```

## Verify Backend is Running

1. **Check the console output:**
   ```
   Server is running on port 3001
   Environment: development
   SMTP Host: Not configured
   ```

2. **Test the API endpoint:**
   - Open: http://localhost:3001/api/health
   - Should return: `{"status":"ok","message":"Server is running"}`

3. **Check in browser console:**
   - Open Developer Tools (F12)
   - Go to Network tab
   - Submit the form
   - Look for `/api/send-email` request
   - It should show status 200 with JSON response

## Common Issues

### Issue: "Server returned non-JSON response. Status: 200"
**Solution:** Backend server is not running. Start it using one of the methods above.

### Issue: "Cannot connect to server"
**Solution:** 
1. Make sure backend server is running on port 3001
2. Check if port 3001 is already in use
3. Verify no firewall is blocking the connection

### Issue: Form submits but no email sent
**Solution:** 
1. Check `.env` file exists in root directory
2. Configure SMTP settings in `.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   SMTP_SECURE=false
   ```

## Development Workflow

1. **Terminal 1 - Start Backend:**
   ```bash
   npm run server
   ```

2. **Terminal 2 - Start Frontend:**
   ```bash
   npm run dev
   ```

3. **Access:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api/health

## Production

In production, the backend server serves both the frontend and API from the same server (port 3001).

