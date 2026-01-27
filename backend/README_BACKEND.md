# Backend System - Complete Setup Guide

## Overview

This backend system provides:
- ✅ Admin authentication with JWT
- ✅ MySQL database for storing form submissions
- ✅ Admin dashboard to view and manage submissions
- ✅ SEO metadata management
- ✅ Email notifications with SMTP
- ✅ Form submission tracking

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `env.example.txt` to `.env` and update with your settings:

```bash
cp env.example.txt .env
```

Edit `.env` and configure:
- Database credentials (MySQL)
- SMTP settings (for emails)
- Admin credentials
- JWT secret

### 3. Initialize Database

```bash
npm run init:admin
```

This creates:
- Database tables
- Default admin user (username: `admin`, password: `admin123`)

### 4. Initialize SEO Metadata (Optional)

```bash
npm run init:seo
```

### 5. Start Server

```bash
npm run server
```

Or for development with auto-reload:

```bash
npm run dev:server
```

### 6. Access Admin Panel

Navigate to: `http://localhost:3001/admin/login`

## Features

### Admin Panel

**Login Page** (`/admin/login`)
- Secure authentication
- JWT token-based sessions

**Dashboard** (`/admin/dashboard`)
- Statistics overview
- View all form submissions
- Search and filter submissions
- View detailed submission information
- Delete submissions

### Form Submissions

All form submissions are automatically:
- Saved to MySQL database
- Emailed to admin (if SMTP configured)
- Emailed to customer (confirmation)

Form types tracked:
- Contact forms
- Quote requests
- Certification requests

### SEO Management

- Automatic SEO metadata for all pages
- Configurable via admin panel
- Open Graph tags
- Canonical URLs

## Database Schema

### Tables

1. **form_submissions** - All form submissions
2. **admin_users** - Admin user accounts
3. **seo_metadata** - SEO data for pages

## API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/smtp-status` - SMTP configuration status
- `GET /api/seo/:path` - Get SEO metadata for page

### Admin Endpoints (Requires Authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Get current user
- `GET /api/admin/submissions` - List submissions
- `GET /api/admin/submissions/:id` - Get submission details
- `DELETE /api/admin/submissions/:id` - Delete submission
- `GET /api/admin/stats` - Get statistics
- `GET /api/admin/seo` - List all SEO metadata
- `POST /api/admin/seo` - Create/update SEO metadata

## Security

- JWT authentication for admin routes
- Password hashing with bcrypt
- SQL injection protection (parameterized queries)
- Helmet.js for security headers
- Environment variables for sensitive data

## Environment Variables

Required variables in `.env`:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=laxmielectronics

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=your-secret-key

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=Laxmi Electronics

# Admin Email
ADMIN_EMAIL=marketing@laxmielectronics.com
```

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check database credentials
- Ensure database exists

### Admin Login Not Working
- Run `npm run init:admin` to create admin user
- Check JWT_SECRET is set
- Verify database connection

### Emails Not Sending
- Check SMTP configuration in `.env`
- For Gmail, use App Password (not regular password)
- Verify SMTP settings: `GET /api/smtp-status`

### Form Submissions Not Saving
- Check database connection
- Verify tables exist
- Check server logs

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use strong passwords and secrets
3. Enable HTTPS
4. Configure proper CORS settings
5. Set up database backups
6. Use environment-specific database

## Support

For issues, check:
- Server logs
- Database connection
- Environment variables
- API endpoint responses
