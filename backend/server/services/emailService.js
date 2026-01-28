const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    // For Gmail and some other providers, you might need:
    tls: {
      rejectUnauthorized: false // Set to true in production with valid certificates
    }
  });
};

// Verify SMTP connection
const verifyConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('SMTP server connection verified successfully');
    return true;
  } catch (error) {
    console.error('SMTP connection verification failed:', error);
    return false;
  }
};

// Send email function
const sendEmail = async ({ to, subject, html, attachments = [], bcc }) => {
  try {
    // Validate required environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      throw new Error('SMTP configuration is missing. Please check your .env file.');
    }

    const transporter = createTransporter();

    // Email options
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'Laxmi Electronics'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments
    };

    // Add BCC if provided
    if (bcc) {
      mailOptions.bcc = bcc;
    }

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to send email'
    };
  }
};

// Prepare file attachments (if files are uploaded)
const prepareAttachments = async (files) => {
  const attachments = [];
  
  if (files) {
    if (files.cad_file && files.cad_file.path) {
      attachments.push({
        filename: files.cad_file.filename || 'cad_file',
        path: files.cad_file.path
      });
    }
    
    if (files.rfq_file && files.rfq_file.path) {
      attachments.push({
        filename: files.rfq_file.filename || 'rfq_file',
        path: files.rfq_file.path
      });
    }
  }
  
  return attachments;
};

module.exports = {
  sendEmail,
  verifyConnection,
  prepareAttachments,
  createTransporter
};

