# Production Deployment Guide

## ⚠️ Important: Backend Server Must Be Running

The proxy error you're seeing (`The proxy server received an invalid response from an upstream server`) means the backend server is not running or not accessible in production.

## Production Setup Steps

### 1. Build Frontend

```bash
cd frontend
npm run build
```

This will create the production build in `live_19012026` folder.

### 2. Deploy Backend Server

The backend server must be running and accessible. It serves both:
- API routes (`/api/*`)
- Frontend static files from `live_19012026` folder

#### Option A: Direct Node.js Server

1. **Upload backend files to server:**
   - Upload the entire `backend` folder
   - Upload the `live_19012026` folder (frontend build)

2. **Install dependencies:**
   ```bash
   cd backend
   npm install --production
   ```

3. **Create `.env` file:**
   ```env
   PORT=3001
   NODE_ENV=production
   
   # Database
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=laxmielectronics
   
   # Admin
   ADMIN_USERNAME=admin
   ADMIN_EMAIL=admin@laxmielectronics.com
   ADMIN_PASSWORD=your_secure_password
   JWT_SECRET=your-secret-jwt-key-min-32-characters-change-this
   
   # SMTP (Optional but recommended)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   SMTP_FROM_EMAIL=your-email@gmail.com
   SMTP_FROM_NAME=Laxmi Electronics
   ```

4. **Initialize database:**
   ```bash
   npm run init:admin
   npm run init:seo
   ```

5. **Start server with PM2 (recommended for production):**
   ```bash
   # Install PM2 globally
   npm install -g pm2
   
   # Start server
   pm2 start server/index.js --name laxmielectronics-backend
   
   # Save PM2 configuration
   pm2 save
   pm2 startup
   ```

#### Option B: Using Reverse Proxy (Nginx/Apache)

If you're using Nginx or Apache as a reverse proxy:

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name laxmielectronics.webindia.com;

    # Redirect to HTTPS (if using SSL)
    # return 301 https://$server_name$request_uri;

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Important:** Make sure the backend server is running on port 3001 before configuring the reverse proxy.

### 3. Verify Backend is Running

1. **Check if server is running:**
   ```bash
   # If using PM2
   pm2 status
   
   # Or check process
   ps aux | grep node
   ```

2. **Test API endpoint:**
   ```bash
   curl http://localhost:3001/api/health
   # Should return: {"status":"ok","message":"Server is running"}
   ```

3. **Test from browser:**
   - Visit: `https://laxmielectronics.webindia.com/api/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

### 4. Common Issues and Solutions

#### Issue: "Proxy Error - Invalid response from upstream server"

**Causes:**
- Backend server is not running
- Backend server is running on wrong port
- Firewall blocking port 3001
- Reverse proxy misconfigured

**Solutions:**
1. Check if backend is running:
   ```bash
   pm2 status
   # or
   netstat -tulpn | grep 3001
   ```

2. Check backend logs:
   ```bash
   pm2 logs laxmielectronics-backend
   # or if running directly
   # Check console output
   ```

3. Verify port 3001 is accessible:
   ```bash
   curl http://localhost:3001/api/health
   ```

4. Check firewall:
   ```bash
   # Allow port 3001
   sudo ufw allow 3001
   # or
   sudo firewall-cmd --add-port=3001/tcp --permanent
   ```

#### Issue: "401 Unauthorized" errors

**Causes:**
- Token expired or invalid
- JWT_SECRET mismatch
- Database connection issues

**Solutions:**
1. Verify JWT_SECRET in `.env` matches
2. Check database connection
3. Try logging in again to get new token

#### Issue: Database connection errors

**Solutions:**
1. Verify database credentials in `.env`
2. Check MySQL is running:
   ```bash
   sudo systemctl status mysql
   ```
3. Verify database exists:
   ```sql
   SHOW DATABASES;
   USE laxmielectronics;
   SHOW TABLES;
   ```

### 5. File Structure on Production Server

```
/production-path/
├── backend/
│   ├── server/
│   │   ├── index.js
│   │   ├── config/
│   │   ├── routes/
│   │   └── ...
│   ├── .env
│   ├── package.json
│   └── node_modules/
├── live_19012026/
│   ├── index.html
│   ├── assets/
│   └── ...
└── (other files)
```

### 6. Environment Variables Checklist

Make sure these are set in production `.env`:

- ✅ `PORT=3001` (or your chosen port)
- ✅ `NODE_ENV=production`
- ✅ `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- ✅ `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`
- ✅ `SMTP_*` (if using email)
- ✅ `ADMIN_EMAIL`

### 7. Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Use environment variables (never commit `.env`)
- [ ] Keep dependencies updated
- [ ] Use PM2 or similar process manager
- [ ] Set up log rotation
- [ ] Configure automatic restarts

### 8. Monitoring

**Check server status:**
```bash
pm2 status
pm2 logs laxmielectronics-backend --lines 50
```

**Monitor resources:**
```bash
pm2 monit
```

**Restart server:**
```bash
pm2 restart laxmielectronics-backend
```

## Quick Start Commands

```bash
# 1. Build frontend
cd frontend && npm run build

# 2. Upload backend and live_19012026 to server

# 3. On server: Install dependencies
cd backend && npm install --production

# 4. Create .env file with production settings

# 5. Initialize database
npm run init:admin && npm run init:seo

# 6. Start with PM2
pm2 start server/index.js --name laxmielectronics-backend
pm2 save
pm2 startup
```

## Support

If issues persist:
1. Check backend logs: `pm2 logs`
2. Check server console output
3. Verify all environment variables are set
4. Test API endpoints directly: `curl http://localhost:3001/api/health`
5. Check database connection
6. Verify firewall and port accessibility
