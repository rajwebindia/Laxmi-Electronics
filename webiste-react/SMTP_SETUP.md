# SMTP Email Configuration Guide

This guide will help you set up SMTP email functionality for the Laxmi Electronics website forms.

## Overview

The website has two forms that send emails:
1. **Contact Us Form** - Sends notifications to admin and confirmation to customer
2. **Quality/Certification Request Form** - Sends certification request notifications

## Prerequisites

- Node.js installed (v14 or higher)
- An email account with SMTP access
- Backend dependencies installed (`npm install`)

## Step 1: Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web server framework
- `nodemailer` - Email sending library
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

## Step 2: Create Environment File

1. Copy the example environment file:
   ```bash
   cp env.example.txt .env
   ```

2. Open `.env` file and configure your SMTP settings

## Step 3: Configure SMTP Settings

### Option 1: Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Laxmi Electronics Website"
   - Copy the generated 16-character password

3. Update your `.env` file:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-16-character-app-password
   SMTP_FROM_EMAIL=your-email@gmail.com
   SMTP_FROM_NAME=Laxmi Electronics
   ADMIN_EMAIL=marketing@laxmielectronics.com
   ```

### Option 2: Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
SMTP_FROM_EMAIL=your-email@outlook.com
SMTP_FROM_NAME=Laxmi Electronics
ADMIN_EMAIL=marketing@laxmielectronics.com
```

### Option 3: Yahoo Mail

```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@yahoo.com
SMTP_FROM_NAME=Laxmi Electronics
ADMIN_EMAIL=marketing@laxmielectronics.com
```

### Option 4: Custom SMTP (SendGrid, Mailgun, etc.)

For professional email services:

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM_EMAIL=noreply@laxmielectronics.com
SMTP_FROM_NAME=Laxmi Electronics
ADMIN_EMAIL=marketing@laxmielectronics.com
```

**Mailgun:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASSWORD=your-mailgun-password
SMTP_FROM_EMAIL=noreply@laxmielectronics.com
SMTP_FROM_NAME=Laxmi Electronics
ADMIN_EMAIL=marketing@laxmielectronics.com
```

### Option 5: Office 365

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yourdomain.com
SMTP_PASSWORD=your-password
SMTP_FROM_EMAIL=your-email@yourdomain.com
SMTP_FROM_NAME=Laxmi Electronics
ADMIN_EMAIL=marketing@laxmielectronics.com
```

## Step 4: Update Admin Email

The admin email is currently hardcoded in the frontend as `marketing@laxmielectronics.com`. 

To change it, update these files:
- `src/pages/ContactUs.jsx` (line 121)
- `src/pages/Quality.jsx` (line 112)

Or use the environment variable `ADMIN_EMAIL` in the backend and pass it through the API.

## Step 5: Start the Server

### Development Mode:
```bash
npm run dev:server
```

Or if you don't have nodemon:
```bash
npm run server
```

### Production Mode:
```bash
npm run build
npm start
```

The server will run on `http://localhost:3001` by default.

## Step 6: Update Frontend API URL (if needed)

The frontend forms are configured to call `/api/send-email`. 

If your backend is on a different port or domain, you'll need to update:

1. **ContactUs.jsx** (line 223):
   ```javascript
   const response = await fetch('http://localhost:3001/api/send-email', {
   ```

2. **Quality.jsx** (line 194):
   ```javascript
   const response = await fetch('http://localhost:3001/api/send-email', {
   ```

For production, you can use a relative path `/api/send-email` if the backend is on the same domain, or configure a proxy in `vite.config.js`.

## Step 7: Configure Vite Proxy (Optional)

To avoid CORS issues in development, add a proxy to `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
```

## Testing

1. Start the backend server: `npm run server`
2. Start the frontend: `npm run dev`
3. Fill out a form on the website
4. Check your email inbox for:
   - Admin notification email
   - Customer confirmation email

## Troubleshooting

### "SMTP configuration is missing"
- Make sure you created a `.env` file
- Verify all SMTP_* variables are set

### "Authentication failed"
- For Gmail: Make sure you're using an App Password, not your regular password
- Check that 2FA is enabled on Gmail
- Verify username and password are correct

### "Connection timeout"
- Check your firewall settings
- Verify SMTP_HOST and SMTP_PORT are correct
- Some networks block SMTP ports - try a different network or use port 465 with SMTP_SECURE=true

### "Emails not sending"
- Check server console for error messages
- Verify SMTP credentials are correct
- Test SMTP connection using email service's test tools

### CORS Errors
- Make sure the backend has CORS enabled (already configured)
- Check that the API URL in frontend matches the backend URL

## Security Notes

1. **Never commit `.env` file** to version control
2. **Use App Passwords** for Gmail instead of regular passwords
3. **Use environment variables** for all sensitive data
4. **Enable HTTPS** in production
5. **Consider using** professional email services (SendGrid, Mailgun) for production

## Production Deployment

1. Set `NODE_ENV=production` in your `.env` file
2. Use a professional email service (SendGrid, Mailgun, AWS SES)
3. Configure proper domain authentication (SPF, DKIM, DMARC)
4. Set up proper error logging and monitoring
5. Use environment variables from your hosting provider

## Support

For issues or questions:
- Check server console logs
- Verify SMTP settings match your email provider's documentation
- Test SMTP connection using email service's test tools

