# Laxmi Electronics - Backend Server

Express.js backend server for the Laxmi Electronics website.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file (copy from `env.example.txt`):
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

3. Initialize the database:
   ```bash
   npm run init:admin
   npm run init:seo
   ```

4. Start the server:
   ```bash
   npm start
   ```

The server will run on port 3001 by default.

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon
- `npm run init:admin` - Initialize admin user
- `npm run init:seo` - Initialize SEO metadata
- `npm run reset:admin` - Reset admin password
- `npm run test:form` - Test form submission

## API Endpoints

- `POST /api/send-email` - Submit form and send emails
- `POST /api/admin/login` - Admin login
- `GET /api/admin/submissions` - Get form submissions
- `GET /api/seo/:path` - Get SEO metadata
- `POST /api/seo/:path` - Update SEO metadata
