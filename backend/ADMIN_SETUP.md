# Admin Panel Setup Guide

This guide will help you set up the complete admin panel system with MySQL database, authentication, and form submission management.

## Prerequisites

1. Node.js installed (v14 or higher)
2. MySQL server installed and running
3. All npm packages installed (`npm install`)

## Step 1: Database Setup

1. Create a MySQL database:
   ```sql
   CREATE DATABASE laxmielectronics;
   ```

2. Update your `.env` file with database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your-database-password
   DB_NAME=laxmielectronics
   ```

## Step 2: Initialize Database and Admin User

Run the initialization script to create tables and default admin user:

```bash
node server/scripts/initAdmin.js
```

This will:
- Create all necessary database tables
- Create a default admin user with:
  - Username: `admin` (or from ADMIN_USERNAME in .env)
  - Email: `admin@laxmielectronics.com` (or from ADMIN_EMAIL in .env)
  - Password: `admin123` (or from ADMIN_PASSWORD in .env)

**⚠️ IMPORTANT: Change the default password after first login!**

## Step 3: Initialize SEO Metadata (Optional)

To populate default SEO metadata for all pages:

```bash
node server/scripts/initSEO.js
```

## Step 4: Configure Environment Variables

Update your `.env` file with all required configurations:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-database-password
DB_NAME=laxmielectronics

# Admin Panel Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=your-secret-jwt-key-change-in-production-min-32-characters

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password-here
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=Laxmi Electronics

# Admin Email (where form submissions will be sent)
ADMIN_EMAIL=marketing@laxmielectronics.com
```

## Step 5: Start the Server

```bash
npm run server
```

Or for development with auto-reload:

```bash
npm run dev:server
```

## Step 6: Access Admin Panel

1. Navigate to: `http://localhost:3001/admin/login`
2. Login with default credentials:
   - Username: `admin`
   - Password: `admin123`

## Admin Panel Features

### Dashboard
- View statistics (total submissions, today, this week, this month)
- View submissions by form type
- Search and filter submissions

### Form Submissions Management
- View all form submissions
- Search by name, email, or message
- Filter by form type
- View detailed submission information
- Delete submissions

### SEO Metadata Management
- View and edit SEO metadata for all pages
- Update page titles, descriptions, keywords
- Configure Open Graph tags
- Set canonical URLs

## API Endpoints

### Admin Authentication
- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Get current user info

### Form Submissions
- `GET /api/admin/submissions` - Get all submissions (with pagination, search, filters)
- `GET /api/admin/submissions/:id` - Get single submission
- `DELETE /api/admin/submissions/:id` - Delete submission

### Statistics
- `GET /api/admin/stats` - Get dashboard statistics

### SEO
- `GET /api/admin/seo` - Get all SEO metadata
- `GET /api/admin/seo/:path` - Get SEO for specific page
- `POST /api/admin/seo` - Create/update SEO metadata

## Database Schema

### form_submissions
Stores all form submissions with fields:
- id, form_type, name, email, phone, message
- organisation_name, street_address, city, state
- requirement, estimated_volume, order_release_date
- cad_file, rfq_file, certification_type
- submitted_at, ip_address, user_agent

### admin_users
Stores admin user accounts:
- id, username, email, password_hash
- full_name, role, is_active
- last_login, created_at, updated_at

### seo_metadata
Stores SEO metadata for pages:
- id, page_path, page_title, meta_description
- meta_keywords, og_title, og_description
- og_image, canonical_url, updated_at

## Security Notes

1. **Change Default Password**: Always change the default admin password after first login
2. **JWT Secret**: Use a strong, random JWT secret in production (minimum 32 characters)
3. **Database Password**: Use a strong database password
4. **HTTPS**: Use HTTPS in production
5. **Environment Variables**: Never commit `.env` file to version control

## Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists

### Admin Login Fails
- Verify admin user was created: `node server/scripts/initAdmin.js`
- Check database connection
- Verify JWT_SECRET is set in `.env`

### Form Submissions Not Saving
- Check database connection
- Verify tables were created
- Check server logs for errors

## Support

For issues or questions, check the server logs or contact the development team.
