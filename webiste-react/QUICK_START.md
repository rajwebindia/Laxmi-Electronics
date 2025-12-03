# Quick Start Guide - SMTP Email Setup

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create .env File
Copy `env.example.txt` to `.env`:
```bash
# On Windows (PowerShell)
Copy-Item env.example.txt .env

# On Mac/Linux
cp env.example.txt .env
```

### Step 3: Configure SMTP in .env File

**For Gmail (Easiest):**
1. Enable 2FA on your Google account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Update `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=Laxmi Electronics
ADMIN_EMAIL=marketing@laxmielectronics.com
```

### Step 4: Start Backend Server
```bash
npm run server
```

### Step 5: Start Frontend (in another terminal)
```bash
npm run dev
```

### Step 6: Test
1. Go to http://localhost:5173/contact-us
2. Fill out the form
3. Check your email!

## 📧 Admin Email Configuration

The admin email (`marketing@laxmielectronics.com`) receives form submissions. To change it:

**Option 1:** Update in code:
- `src/pages/ContactUs.jsx` (line 121)
- `src/pages/Quality.jsx` (line 112)

**Option 2:** Use environment variable (requires code update)

## 🔧 Common SMTP Providers

### Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Outlook
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-api-key
```

## ⚠️ Troubleshooting

**"Authentication failed"**
- Gmail: Use App Password, not regular password
- Enable 2FA first

**"Connection timeout"**
- Check firewall settings
- Try different network

**"CORS error"**
- Make sure backend is running on port 3001
- Check vite.config.js has proxy configured

## 📚 Full Documentation

See `SMTP_SETUP.md` for detailed instructions and all SMTP provider configurations.

