# Server API Documentation

## Structure

```
server/
├── index.js              # Main server file
├── routes/
│   └── api.js           # API routes (email endpoints)
└── services/
    └── emailService.js  # SMTP email service
```

## API Endpoints

### 1. Health Check
**GET** `/api/health`

Check if server is running and SMTP is configured.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "smtpConfigured": true
}
```

### 2. SMTP Status
**GET** `/api/smtp-status`

Check SMTP configuration and verify connection.

**Response:**
```json
{
  "configured": true,
  "verified": true,
  "host": "smtp.gmail.com",
  "port": "587",
  "fromEmail": "your-email@gmail.com",
  "message": "SMTP connection verified successfully"
}
```

### 3. Send Email
**POST** `/api/send-email`

Send email notifications for form submissions. Used by:
- Contact Us form
- Quality Certification form
- Home page inquiry form
- Silicone Molding form
- Thermoplastic Molding form

**Request Body:**
```json
{
  "adminEmail": {
    "to": "marketing@laxmielectronics.com",
    "subject": "New Contact Form Submission",
    "html": "<html>...</html>"
  },
  "customerEmail": {
    "to": "customer@example.com",
    "subject": "Thank you for contacting us",
    "html": "<html>...</html>"
  },
  "files": {
    "cad_file": "filename.pdf",
    "rfq_file": "filename.pdf"
  }
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Emails sent successfully",
  "adminEmail": {
    "success": true,
    "messageId": "...",
    "message": "Email sent successfully"
  },
  "customerEmail": {
    "success": true,
    "messageId": "...",
    "message": "Email sent successfully"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Failed to send one or more emails",
  "adminEmail": {
    "success": false,
    "error": "Error message",
    "message": "Failed to send email"
  },
  "customerEmail": {
    "success": false,
    "error": "Error message",
    "message": "Failed to send email"
  }
}
```

## Configuration

### Environment Variables (.env file)

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=Laxmi Electronics

# Admin Email
ADMIN_EMAIL=marketing@laxmielectronics.com
```

## Starting the Server

### Development
```bash
npm run server
```

### Development with Auto-reload (requires nodemon)
```bash
npm run dev:server
```

### Production
```bash
npm start
```

## Forms Using This API

All forms in the application use the `/api/send-email` endpoint:

1. **Contact Us** (`/contact-us`)
   - Full contact form with file uploads
   - Sends to: marketing@laxmielectronics.com

2. **Quality Certification** (`/quality`)
   - Certification request form
   - Sends to: marketing@laxmielectronics.com

3. **Home Page Inquiry** (`/`)
   - Quick inquiry form
   - Sends to: marketing@laxmielectronics.com

4. **Silicone Molding** (`/silicone-molding`)
   - Certification request form
   - Sends to: marketing@laxmielectronics.com

5. **Thermoplastic Molding** (`/thermoplastic-molding`)
   - Certification request form
   - Sends to: marketing@laxmielectronics.com

## SMTP Setup

### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use App Password (not regular password) in `SMTP_PASSWORD`

### Other Providers
- **Outlook**: `SMTP_HOST=smtp-mail.outlook.com`
- **Yahoo**: `SMTP_HOST=smtp.mail.yahoo.com`
- **SendGrid**: `SMTP_HOST=smtp.sendgrid.net`, `SMTP_USER=apikey`

## Testing

### Test Health Endpoint
```bash
curl http://localhost:3001/api/health
```

### Test SMTP Status
```bash
curl http://localhost:3001/api/smtp-status
```

### Test Email Sending
Use any form on the website or send a POST request:
```bash
curl -X POST http://localhost:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "adminEmail": {
      "to": "marketing@laxmielectronics.com",
      "subject": "Test Email",
      "html": "<p>Test message</p>"
    },
    "customerEmail": {
      "to": "test@example.com",
      "subject": "Test Confirmation",
      "html": "<p>Test confirmation</p>"
    }
  }'
```

## Troubleshooting

### Server won't start
- Check if port 3001 is already in use
- Verify Node.js is installed
- Check for syntax errors in server files

### Emails not sending
- Verify `.env` file exists and has correct SMTP settings
- Check SMTP status: `GET /api/smtp-status`
- Verify SMTP credentials are correct
- For Gmail: Use App Password, not regular password
- Check server console for error messages

### Connection errors
- Ensure server is running on port 3001
- Check firewall settings
- Verify SMTP_HOST and SMTP_PORT are correct

