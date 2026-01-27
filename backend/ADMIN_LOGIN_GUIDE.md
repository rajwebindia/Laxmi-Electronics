# Admin Login Guide

## Access Admin Login Page

Navigate to: **`http://localhost:3001/admin/login`**

Or if running in production: **`https://yourdomain.com/admin/login`**

## Setup Admin User

Before you can login, you need to initialize the admin user in the database.

### Step 1: Initialize Admin User

Run this command from the project root:

```bash
npm run init:admin
```

This will create:
- Database tables (if they don't exist)
- Default admin user with credentials:
  - **Username:** `admin` (or from ADMIN_USERNAME in .env)
  - **Email:** `admin@laxmielectronics.com` (or from ADMIN_EMAIL in .env)
  - **Password:** `admin123` (or from ADMIN_PASSWORD in .env)

### Step 2: Login

1. Go to `/admin/login`
2. Enter credentials:
   - Username: `admin`
   - Password: `admin123`
3. Click "Login"

### Step 3: Access Dashboard

After successful login, you'll be redirected to `/admin/dashboard` where you can:
- View form submissions
- Search and filter submissions
- View statistics
- Delete submissions

## Default Credentials

**⚠️ IMPORTANT:** Change the default password after first login!

- **Username:** `admin`
- **Password:** `admin123`

## Custom Admin Credentials

You can set custom credentials in your `.env` file:

```env
ADMIN_USERNAME=your-username
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-secure-password
```

Then run `npm run init:admin` again (it will skip if user already exists).

## Troubleshooting

### "Invalid credentials" Error

1. Make sure you ran `npm run init:admin`
2. Check database connection in `.env`
3. Verify MySQL is running
4. Check server logs for errors

### "Network error" or "Cannot connect to server"

1. Make sure the backend server is running: `npm run server`
2. Check if server is on port 3001 (or PORT in .env)
3. Verify API endpoint: `http://localhost:3001/api/admin/login`

### Database Connection Error

1. Check `.env` file has correct database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your-password
   DB_NAME=laxmielectronics
   ```
2. Make sure MySQL is running
3. Create database if it doesn't exist:
   ```sql
   CREATE DATABASE laxmielectronics;
   ```

## Security Notes

1. **Change Default Password:** Always change the default password in production
2. **Strong JWT Secret:** Use a strong, random JWT_SECRET in `.env` (minimum 32 characters)
3. **HTTPS:** Use HTTPS in production
4. **Environment Variables:** Never commit `.env` file to version control

## API Endpoint

The login endpoint is: `POST /api/admin/login`

Request body:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response (success):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@laxmielectronics.com",
    "fullName": "Administrator",
    "role": "admin"
  }
}
```

Response (error):
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```
