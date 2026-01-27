# Setup Instructions for Final Code

This folder contains the organized final code separated into backend and frontend.

## Quick Start

### 1. Backend Setup

```bash
cd final-code/backend
npm install
```

Create `.env` file (copy from `env.example.txt`):
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=laxmielectronics

ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@laxmielectronics.com
ADMIN_PASSWORD=admin123

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_EMAIL=your_email@gmail.com
SMTP_FROM_NAME=Laxmi Electronics
```

Initialize database:
```bash
npm run init:admin
npm run init:seo
```

Start backend server:
```bash
npm start
```

Backend runs on: `http://localhost:3001`

### 2. Frontend Setup

```bash
cd final-code/frontend
npm install
```

Start development server:
```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

Build for production:
```bash
npm run build
```

## Production Deployment

### Option 1: Separate Servers

- Deploy backend to a Node.js server (port 3001)
- Deploy frontend to a static hosting service (Netlify, Vercel, etc.)
- Update frontend API endpoints to point to backend URL

### Option 2: Combined Server

1. Build frontend:
   ```bash
   cd final-code/frontend
   npm run build
   ```

2. The backend server will serve the frontend build from `../frontend/dist`

3. Start backend:
   ```bash
   cd final-code/backend
   npm start
   ```

## Important Notes

- Backend must be running before frontend can submit forms
- Make sure MySQL database is running and configured
- SMTP configuration is optional but recommended for email notifications
- File uploads are stored in `backend/uploads/` directory

## Troubleshooting

- If forms don't submit: Check if backend is running on port 3001
- If database errors: Verify MySQL connection in `.env` file
- If email fails: Check SMTP configuration in `.env` file
