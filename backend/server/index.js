const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();
const emailService = require('./services/emailService');
const { testConnection, initializeDatabase } = require('./config/database');
const adminRoutes = require('./routes/admin');
const seoRoutes = require('./routes/seo');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development, enable in production
}));
// CORS configuration - allow requests from production domain
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware (for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Content-Type: ${req.get('Content-Type') || 'none'}`);
  next();
});

// Initialize database on server start
(async () => {
  const dbConnected = await testConnection();
  if (dbConnected) {
    await initializeDatabase();
  }
})();

// API Routes (must be before static file serving)
// Admin routes
app.use('/api/admin', adminRoutes);
// SEO routes
app.use('/api/seo', seoRoutes);
// Form submission and email routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({ status: 'ok', message: 'Server is running' });
});

// Get admin email endpoint
app.get('/api/admin-email', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const adminEmail = process.env.ADMIN_EMAIL || 'marketing@laxmielectronics.com';
  res.json({ adminEmail });
});

// Note: /api/send-email endpoint is now handled by routes/api.js
// This ensures form submissions are saved to the database

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve static files from React app (after API routes)
// Note: In production, the frontend build should be in ../live_12012026
// For development, this can point to the frontend build directory
const distPath = path.resolve(__dirname, '../../live_12012026');
const indexPath = path.resolve(__dirname, '../../live_12012026/index.html');

// Serve static files with proper headers
// Note: express.static only handles GET/HEAD requests by default, so API POST requests won't be affected
app.use(express.static(distPath, {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Set proper content type for JS and CSS
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Handle unmatched API routes (404)
app.use('/api/*', (req, res) => {
  console.log('404 - API route not found:', req.method, req.path);
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({ error: 'API endpoint not found', path: req.path });
});

// Serve React app (catch all handler for SPA routing - must be last)
// This handles all GET routes that don't match API or static files
app.get('*', (req, res, next) => {
  // Skip API routes (shouldn't happen, but just in case)
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  // Serve index.html for all other GET routes (SPA routing)
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      console.error('Request path:', req.path);
      res.status(500).send('Error loading page');
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`SMTP Host: ${process.env.SMTP_HOST || 'Not configured'}`);
  console.log(`Admin Email: ${process.env.ADMIN_EMAIL || 'marketing@laxmielectronics.com (default)'}`);
});


