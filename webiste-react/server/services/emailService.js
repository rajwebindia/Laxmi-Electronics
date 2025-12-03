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
const sendEmail = async ({ to, subject, html, attachments = [] }) => {
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
// Note: In a real application, you'd want to handle file uploads properly
// This is a placeholder for file attachment handling
const prepareAttachments = async (files) => {
  // For now, we'll just log that files were mentioned
  // In production, you'd want to:
  // 1. Store uploaded files temporarily
  // 2. Attach them to the email
  // 3. Clean up temporary files after sending
  
  console.log('Files mentioned in form:', files);
  
  // Example structure for attachments (if files are uploaded):
  // return [
  //   {
  //     filename: 'cad_file.pdf',
  //     path: '/path/to/uploaded/file.pdf'
  //   }
  // ];
  
  return [];
};

module.exports = {
  sendEmail,
  verifyConnection,
  prepareAttachments,
  createTransporter
};

