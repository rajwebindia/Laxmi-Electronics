const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const emailService = require('../services/emailService');
const { pool } = require('../config/database');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow specific file types
    const allowedTypes = /\.(doc|docx|xls|xlsx|ppt|pptx|pdf|jpg|jpeg|png|dwg)$/i;
    if (allowedTypes.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: doc, docx, xls, xlsx, ppt, pptx, pdf, jpg, jpeg, png, dwg'));
    }
  }
});

/**
 * POST /api/send-email
 * Send email notifications for form submissions with file uploads
 * Body: JSON (application/json) OR multipart/form-data with files
 */
router.post('/send-email', (req, res, next) => {
  // Check if request is multipart/form-data (has files)
  const contentType = req.get('content-type') || '';
  if (contentType.includes('multipart/form-data')) {
    // Use multer middleware for file uploads
    return upload.fields([
      { name: 'cad_file', maxCount: 1 },
      { name: 'rfq_file', maxCount: 1 }
    ])(req, res, next);
  } else {
    // Skip multer for JSON requests
    next();
  }
}, async (req, res) => {
  try {
    // Handle multer errors (only for multipart requests)
    if (req.fileValidationError) {
      return res.status(400).json({
        success: false,
        message: req.fileValidationError
      });
    }
    
    // Always use ADMIN_EMAIL from .env file (override any email from frontend)
    const envAdminEmail = process.env.ADMIN_EMAIL || 'marketing@laxmielectronics.com';
    
    // Handle both JSON and multipart/form-data
    let adminEmail, customerEmail, formData, formType;
    
    const contentType = req.get('content-type') || '';
    const isMultipart = contentType.includes('multipart/form-data');
    
    if (isMultipart) {
      // multipart/form-data format (from ContactUs form with files)
      try {
        adminEmail = typeof req.body.adminEmail === 'string' ? JSON.parse(req.body.adminEmail) : req.body.adminEmail;
        customerEmail = typeof req.body.customerEmail === 'string' ? JSON.parse(req.body.customerEmail) : req.body.customerEmail;
        formData = typeof req.body.formData === 'string' ? JSON.parse(req.body.formData) : req.body.formData;
        formType = req.body.formType || 'contact';
      } catch (parseError) {
        console.error('Error parsing multipart form data:', parseError);
        return res.status(400).json({
          success: false,
          message: 'Error parsing form data: ' + parseError.message
        });
      }
    } else {
      // JSON format (from Home page and other forms without files)
      adminEmail = req.body.adminEmail;
      customerEmail = req.body.customerEmail;
      formData = req.body.formData || {};
      formType = req.body.formType || 'contact';
    }
    
    // Get uploaded files (only for multipart requests)
    const uploadedFiles = req.files || {};
    const cadFile = uploadedFiles.cad_file ? uploadedFiles.cad_file[0] : null;
    const rfqFile = uploadedFiles.rfq_file ? uploadedFiles.rfq_file[0] : null;
    
    // Store file paths for database
    const cadFilePath = cadFile ? `/uploads/${cadFile.filename}` : null;
    const rfqFilePath = rfqFile ? `/uploads/${rfqFile.filename}` : null;
    
    // For email attachments, use the file objects
    const files = {
      cad_file: cadFile ? { path: cadFile.path, filename: cadFile.originalname } : null,
      rfq_file: rfqFile ? { path: rfqFile.path, filename: rfqFile.originalname } : null
    };
    
    // Debug logging
    console.log('📧 Form submission received:');
    console.log('   Content-Type:', req.get('content-type'));
    console.log('   Form Type:', formType);
    console.log('   Has Files:', !!(cadFile || rfqFile));
    console.log('   FormData keys:', Object.keys(formData || {}));
    console.log('   Email:', formData?.email || customerEmail?.to || 'N/A');

    // Validate required fields
    if (!customerEmail) {
      return res.status(400).json({
        success: false,
        message: 'Customer email data is required'
      });
    }

    if (!customerEmail.to || !customerEmail.subject || !customerEmail.html) {
      return res.status(400).json({
        success: false,
        message: 'Customer email must have to, subject, and html fields'
      });
    }

    // Always override admin email to use the one from .env file
    if (!adminEmail) {
      adminEmail = {
        to: envAdminEmail,
        subject: 'New Form Submission',
        html: 'A new form has been submitted.'
      };
    } else {
      const originalEmail = adminEmail.to;
      adminEmail.to = envAdminEmail;
      if (originalEmail && originalEmail !== envAdminEmail) {
        console.log(`Admin email overridden: ${originalEmail} -> ${envAdminEmail} (from .env)`);
      }
      
      // Ensure subject and html exist
      if (!adminEmail.subject) {
        adminEmail.subject = 'New Form Submission';
      }
      if (!adminEmail.html) {
        adminEmail.html = 'A new form has been submitted.';
      }
    }

    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Save to database FIRST (before email sending)
    let submissionId;
    let dbSaveSuccess = false;
    let dbErrorDetails = null;
    try {
      // Extract email from formData or customerEmail
      const email = formData.email || customerEmail?.to || null;
      
      // Build name from first_name and last_name if needed
      let fullName = formData.name || null;
      if (!fullName && (formData.first_name || formData.last_name)) {
        fullName = [formData.first_name, formData.last_name].filter(Boolean).join(' ').trim() || null;
      }
      
      // Use a placeholder email if none provided (to satisfy database constraints if any)
      const emailToInsert = email || 'no-email@laxmielectronics.com';
      
      if (!email) {
        console.warn('⚠️  No email found in form data or customer email, using placeholder');
        console.warn('   FormData keys:', Object.keys(formData || {}));
        console.warn('   customerEmail:', customerEmail ? { to: customerEmail.to } : 'null');
      }

      const insertData = [
        formType,
        fullName,
        emailToInsert,
        formData.phone || formData.mobile_number || null,
        formData.message || formData.requirement || null,
        formData.organisation_name || formData.organisationName || null,
        formData.street_address || null,
        formData.city || null,
        formData.state || null,
        formData.requirement || null,
        formData.estimated_volume || null,
        formData.order_release_date || null,
        cadFilePath,
        rfqFilePath,
        formData.certification_type || formData.selectedCert || null,
        ipAddress,
        userAgent
      ];
      
      console.log('💾 Attempting to save to database:');
      console.log('   Form Type:', formType);
      console.log('   Name:', fullName || 'N/A');
      console.log('   Email:', emailToInsert);
      console.log('   Phone:', formData.phone || formData.mobile_number || 'N/A');
      console.log('   Message:', (formData.message || formData.requirement || '').substring(0, 50) + '...');
      console.log('   Organisation:', formData.organisation_name || formData.organisationName || 'N/A');
      console.log('   Insert Data Length:', insertData.length);
      
      // Note: emailToInsert will always have a value (either real email or placeholder)
      
      const [result] = await pool.query(
        `INSERT INTO form_submissions 
         (form_type, name, email, phone, message, organisation_name, street_address, city, state, 
          requirement, estimated_volume, order_release_date, cad_file, rfq_file, certification_type, ip_address, user_agent)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        insertData
      );
      submissionId = result.insertId;
      dbSaveSuccess = true;
      console.log(`✅ Form submission saved to database with ID: ${submissionId}`);
      console.log(`   Form Type: ${formType}, Email: ${emailToInsert}`);
    } catch (dbError) {
      console.error('❌ Error saving to database:', dbError);
      console.error('   Error details:', dbError.message);
      console.error('   Error code:', dbError.code);
      console.error('   Error stack:', dbError.stack);
      console.error('   FormData received:', JSON.stringify(formData, null, 2));
      console.error('   customerEmail received:', customerEmail ? JSON.stringify(customerEmail, null, 2) : 'null');
      
      // Store error details for dev notification email
      let errorMessage = dbError.message || 'Unknown database error';
      let errorType = 'Database Error';
      
      // Check for common database errors
      if (dbError.code === 'ECONNREFUSED') {
        console.error('   ⚠️  Database connection refused. Check if MySQL server is running.');
        errorType = 'Connection Refused';
        errorMessage = 'Database connection refused. Check if MySQL server is running.';
      } else if (dbError.code === 'ER_ACCESS_DENIED_ERROR') {
        console.error('   ⚠️  Database access denied. Check DB_USER and DB_PASSWORD in .env file.');
        errorType = 'Access Denied';
        errorMessage = 'Database access denied. Check DB_USER and DB_PASSWORD in .env file.';
      } else if (dbError.code === 'ER_BAD_DB_ERROR') {
        console.error('   ⚠️  Database does not exist. Check DB_NAME in .env file.');
        errorType = 'Database Not Found';
        errorMessage = 'Database does not exist. Check DB_NAME in .env file.';
      } else if (dbError.code === 'ER_NO_SUCH_TABLE') {
        console.error('   ⚠️  Table does not exist. Run database initialization.');
        errorType = 'Table Not Found';
        errorMessage = 'Table does not exist. Run database initialization.';
      }
      
      dbErrorDetails = {
        type: errorType,
        message: errorMessage,
        code: dbError.code,
        stack: dbError.stack
      };
      
      // Continue even if database save fails - still try to send emails
      // Note: Dev notification email will be sent after customer/admin emails
    }

    // Check SMTP configuration - but don't fail, just warn
    const smtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
    
    if (!smtpConfigured) {
      console.warn('⚠️  SMTP not configured. Emails will not be sent.');
      // Return success even if database save failed - form was still processed
      return res.json({
        success: true,
        message: dbSaveSuccess 
          ? 'Form submitted successfully. SMTP configuration is missing, so emails were not sent.'
          : 'Form submitted successfully. SMTP configuration is missing, so emails were not sent. Note: Database save failed, but submission was processed.',
        submissionId: submissionId || null,
        warning: dbSaveSuccess 
          ? 'Please configure SMTP in .env file to enable email notifications'
          : 'Please configure SMTP in .env file to enable email notifications. Also check database connection.',
        adminEmail: { success: false, error: 'SMTP not configured' },
        customerEmail: { success: false, error: 'SMTP not configured' }
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

    // Send notification to developer if database save failed (after customer/admin emails)
    // This runs regardless of customer/admin email success, as long as SMTP is configured
    if (!dbSaveSuccess && smtpConfigured) {
      const devEmail = process.env.DEV_EMAIL || process.env.ADMIN_EMAIL || 'marketing@laxmielectronics.com';
      const devNotificationEmail = {
        to: devEmail,
        subject: `⚠️ Database Save Failed - Form Submission Alert`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #d32f2f;">⚠️ Database Save Failed</h2>
            <p>A form submission was received and processed, but failed to save to the database.</p>
            <h3 style="color: #08222B; margin-top: 24px;">Form Details:</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Form Type:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${formType}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Name:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${formData.name || (formData.first_name && formData.last_name ? `${formData.first_name} ${formData.last_name}` : formData.first_name || formData.last_name || 'N/A')}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Email:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${formData.email || customerEmail?.to || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Phone:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${formData.phone || formData.mobile_number || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>IP Address:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${ipAddress}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Timestamp:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toISOString()}</td>
              </tr>
            </table>
            <h3 style="color: #d32f2f; margin-top: 24px;">Database Error Details:</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #fff3cd;"><strong>Error Type:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #fff3cd;">${dbErrorDetails?.type || 'Unknown'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #fff3cd;"><strong>Error Message:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #fff3cd;">${dbErrorDetails?.message || 'No details available'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #fff3cd;"><strong>Error Code:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #fff3cd;">${dbErrorDetails?.code || 'N/A'}</td>
              </tr>
            </table>
            <h3 style="color: #08222B; margin-top: 24px;">Action Required:</h3>
            <p style="color: #666;">Please check the database connection and ensure the form_submissions table exists and is accessible.</p>
            <p style="color: #666; margin-top: 16px;">Note: Customer and admin emails were ${adminResult.success && customerResult.success ? 'sent successfully' : 'attempted'} despite the database error.</p>
          </div>
        `
      };
      
      // Send dev notification email (don't await - send in background)
      emailService.sendEmail(devNotificationEmail).catch(err => {
        console.error('❌ Failed to send dev notification email:', err);
      });
    }

    // Return results - prioritize email sending success over database save
    // Database save failure is logged but doesn't prevent form submission
    if (adminResult.success && customerResult.success) {
      res.json({
        success: true,
        message: dbSaveSuccess 
          ? 'Form submitted and emails sent successfully'
          : 'Form submitted and emails sent successfully. Note: Database save failed, but submission was processed.',
        submissionId: submissionId || null,
        adminEmail: adminResult,
        customerEmail: customerResult,
        warning: dbSaveSuccess ? null : 'Database save failed, but form was processed successfully'
      });
    } else if (adminResult.success || customerResult.success) {
      // At least one email succeeded
      res.json({
        success: true,
        message: dbSaveSuccess 
          ? 'Form submitted successfully. Some emails may have failed.'
          : 'Form submitted successfully. Some emails may have failed. Note: Database save failed.',
        submissionId: submissionId || null,
        adminEmail: adminResult,
        customerEmail: customerResult,
        warning: dbSaveSuccess ? null : 'Database save failed, but form was processed successfully'
      });
    } else {
      // Both emails failed, but still return success if database saved
      if (dbSaveSuccess) {
        res.json({
          success: true,
          message: 'Form submitted successfully. Email sending failed, but submission was saved.',
          submissionId: submissionId || null,
          adminEmail: adminResult,
          customerEmail: customerResult,
          warning: 'Email sending failed, but form was saved to database'
        });
      } else {
        // Both database and emails failed
        res.status(500).json({
          success: false,
          message: 'Form submission failed. Please check your connection and try again.',
          submissionId: null,
          adminEmail: adminResult,
          customerEmail: customerResult,
          error: 'Both database save and email sending failed'
        });
      }
    }
  } catch (error) {
    console.error('❌ Error in form submission:', error);
    console.error('   Error message:', error.message);
    console.error('   Error stack:', error.stack);
    console.error('   Request body keys:', Object.keys(req.body || {}));
    console.error('   FormData present:', !!req.body.formData);
    console.error('   FormType:', req.body.formType);
    console.error('   Files:', req.files);
    
    // Handle multer errors specifically
    if (error.name === 'MulterError') {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size exceeds 5MB limit'
        });
      }
      return res.status(400).json({
        success: false,
        message: `File upload error: ${error.message}`
      });
    }
    
    // Always return JSON, even on errors
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    smtpConfigured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD)
  });
});

/**
 * GET /api/smtp-status
 * Check SMTP configuration status
 */
router.get('/smtp-status', async (req, res) => {
  try {
    const isConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
    
    if (!isConfigured) {
      return res.json({
        configured: false,
        message: 'SMTP is not configured. Please set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD in .env file'
      });
    }

    // Try to verify connection
    const isVerified = await emailService.verifyConnection();
    
    res.json({
      configured: true,
      verified: isVerified,
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || '587',
      fromEmail: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      message: isVerified ? 'SMTP connection verified successfully' : 'SMTP connection verification failed'
    });
  } catch (error) {
    res.status(500).json({
      configured: false,
      error: error.message
    });
  }
});

module.exports = router;

