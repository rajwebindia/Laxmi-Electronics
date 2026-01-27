# Laxmi Electronics - Final Code Structure

This folder contains the organized final code for the Laxmi Electronics website project.

## Folder Structure

```
final-code/
├── backend/          # Backend server code
│   ├── server/       # Express.js server files
│   ├── uploads/      # File uploads directory
│   ├── package.json  # Backend dependencies
│   └── .env          # Environment variables (create from .env.example)
│
└── frontend/         # React frontend code
    ├── src/          # React source files
    ├── public/       # Static assets
    ├── index.html    # HTML entry point
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json  # Frontend dependencies
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd final-code/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with your database and SMTP configuration:
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

4. Initialize the database:
   ```bash
   npm run init:admin
   npm run init:seo
   ```

5. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd final-code/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Notes

- The backend server runs on port 3001 by default
- The frontend development server runs on port 5173 by default
- Make sure both servers are running for full functionality
- Backend must be running before the frontend can submit forms
