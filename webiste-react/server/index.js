const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const emailService = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Email endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { adminEmail, customerEmail, files } = req.body;

    if (!adminEmail || !customerEmail) {
      return res.status(400).json({
        success: false,
        message: 'Admin email and customer email data are required'
      });
    }

    // Send admin notification email
    const adminResult = await emailService.sendEmail({
      to: adminEmail.to,
      subject: adminEmail.subject,
      html: adminEmail.html,
      attachments: files ? await emailService.prepareAttachments(files) : []
    });

    // Send customer confirmation email
    const customerResult = await emailService.sendEmail({
      to: customerEmail.to,
      subject: customerEmail.subject,
      html: customerEmail.html
    });

    if (adminResult.success && customerResult.success) {
      res.json({
        success: true,
        message: 'Emails sent successfully',
        adminEmail: adminResult,
        customerEmail: customerResult
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send one or more emails',
        adminEmail: adminResult,
        customerEmail: customerResult
      });
    }
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Serve React app in production (catch all handler)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`SMTP Host: ${process.env.SMTP_HOST || 'Not configured'}`);
});

