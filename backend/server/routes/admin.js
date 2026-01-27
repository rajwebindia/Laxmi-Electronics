const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { authenticateToken, generateToken } = require('../middleware/auth');

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find user
    const [users] = await pool.query(
      'SELECT * FROM admin_users WHERE (username = ? OR email = ?) AND is_active = TRUE',
      [username, username]
    );

    if (users.length === 0) {
      console.log(`Login attempt failed: User not found - ${username}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      console.log(`Login attempt failed: Invalid password for user - ${username}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Update last login
    await pool.query(
      'UPDATE admin_users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    // Generate token
    const token = generateToken(user.id, user.username);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get current user info
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all form submissions
router.get('/submissions', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 50, formType, search, dateFilter, sortBy = 'submitted_at', sortOrder = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM form_submissions WHERE 1=1';
    const params = [];

    if (formType) {
      query += ' AND form_type = ?';
      params.push(formType);
    }

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR message LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Date filter
    if (dateFilter === 'today') {
      query += ' AND DATE(submitted_at) = CURDATE()';
    } else if (dateFilter === 'week') {
      query += ' AND submitted_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
    } else if (dateFilter === 'month') {
      query += ' AND MONTH(submitted_at) = MONTH(NOW()) AND YEAR(submitted_at) = YEAR(NOW())';
    }

    // Validate sortBy to prevent SQL injection
    const allowedSortBy = ['submitted_at', 'name', 'email', 'form_type'];
    const sortColumn = allowedSortBy.includes(sortBy) ? sortBy : 'submitted_at';
    const sortDir = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${sortColumn} ${sortDir} LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [submissions] = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM form_submissions WHERE 1=1';
    const countParams = [];

    if (formType) {
      countQuery += ' AND form_type = ?';
      countParams.push(formType);
    }

    if (search) {
      countQuery += ' AND (name LIKE ? OR email LIKE ? OR message LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    // Date filter for count
    if (dateFilter === 'today') {
      countQuery += ' AND DATE(submitted_at) = CURDATE()';
    } else if (dateFilter === 'week') {
      countQuery += ' AND submitted_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
    } else if (dateFilter === 'month') {
      countQuery += ' AND MONTH(submitted_at) = MONTH(NOW()) AND YEAR(submitted_at) = YEAR(NOW())';
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: submissions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get single submission by ID
router.get('/submissions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [submissions] = await pool.query(
      'SELECT * FROM form_submissions WHERE id = ?',
      [id]
    );

    if (submissions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.json({
      success: true,
      data: submissions[0]
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete submission
router.delete('/submissions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM form_submissions WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.json({
      success: true,
      message: 'Submission deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Total submissions
    const [totalResult] = await pool.query('SELECT COUNT(*) as total FROM form_submissions');
    const total = totalResult[0].total;

    // Submissions by form type
    const [typeResult] = await pool.query(
      'SELECT form_type, COUNT(*) as count FROM form_submissions GROUP BY form_type'
    );

    // Submissions today
    const [todayResult] = await pool.query(
      'SELECT COUNT(*) as count FROM form_submissions WHERE DATE(submitted_at) = CURDATE()'
    );

    // Submissions this week
    const [weekResult] = await pool.query(
      'SELECT COUNT(*) as count FROM form_submissions WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );

    // Submissions this month
    const [monthResult] = await pool.query(
      'SELECT COUNT(*) as count FROM form_submissions WHERE MONTH(submitted_at) = MONTH(NOW()) AND YEAR(submitted_at) = YEAR(NOW())'
    );

    res.json({
      success: true,
      stats: {
        total,
        today: todayResult[0].count,
        thisWeek: weekResult[0].count,
        thisMonth: monthResult[0].count,
        byType: typeResult
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// SEO Metadata Management
router.get('/seo', authenticateToken, async (req, res) => {
  try {
    const [metadata] = await pool.query('SELECT * FROM seo_metadata ORDER BY page_path');
    res.json({
      success: true,
      data: metadata
    });
  } catch (error) {
    console.error('Error fetching SEO metadata:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.get('/seo/:path', authenticateToken, async (req, res) => {
  try {
    const path = req.params.path.replace(/-/g, '/');
    const [metadata] = await pool.query(
      'SELECT * FROM seo_metadata WHERE page_path = ?',
      [path]
    );

    if (metadata.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'SEO metadata not found'
      });
    }

    res.json({
      success: true,
      data: metadata[0]
    });
  } catch (error) {
    console.error('Error fetching SEO metadata:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.post('/seo', authenticateToken, async (req, res) => {
  try {
    const {
      page_path,
      page_title,
      meta_description,
      meta_keywords,
      og_title,
      og_description,
      og_image,
      canonical_url
    } = req.body;

    await pool.query(
      `INSERT INTO seo_metadata 
       (page_path, page_title, meta_description, meta_keywords, og_title, og_description, og_image, canonical_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       page_title = VALUES(page_title),
       meta_description = VALUES(meta_description),
       meta_keywords = VALUES(meta_keywords),
       og_title = VALUES(og_title),
       og_description = VALUES(og_description),
       og_image = VALUES(og_image),
       canonical_url = VALUES(canonical_url)`,
      [page_path, page_title, meta_description, meta_keywords, og_title, og_description, og_image, canonical_url]
    );

    res.json({
      success: true,
      message: 'SEO metadata saved successfully'
    });
  } catch (error) {
    console.error('Error saving SEO metadata:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Initialize SEO metadata
router.post('/init-seo', authenticateToken, async (req, res) => {
  try {
    const seoData = [
      {
        page_path: '/',
        page_title: 'Laxmi Electronics - Precision Molding Solutions | Building The Future',
        meta_description: 'Laxmi Electronics is a leading manufacturer of silicone and plastic injection molds and components. Serving Medical, Pharmaceutical, Aviation, Space and Healthcare industries with 40+ years of experience.',
        meta_keywords: 'injection molding, silicone molding, plastic molding, medical devices, pharmaceutical molding, aerospace components, precision molding, Laxmi Electronics, Bangalore',
        og_title: 'Laxmi Electronics - Precision Molding Solutions',
        og_description: 'Leading manufacturer of silicone and plastic injection molds with 40+ years of industry experience.',
        og_image: '/assets/logo.png',
        canonical_url: 'https://www.laxmielectronics.com/'
      },
      {
        page_path: '/about-us',
        page_title: 'About Us - Laxmi Electronics | Your One-Stop Solution',
        meta_description: 'Learn about Laxmi Electronics - a full services manufacturer of silicone and plastic injection molds. State-of-the-art facilities in Bangalore with latest technology and top-of-the-line systems.',
        meta_keywords: 'about Laxmi Electronics, injection molding company, silicone molding manufacturer, Bangalore manufacturing, precision molding',
        og_title: 'About Laxmi Electronics - Your One-Stop Solution',
        og_description: 'Full services manufacturer of silicone and plastic injection molds with state-of-the-art facilities.',
        og_image: '/assets/images/about-us-banner-1.jpg',
        canonical_url: 'https://www.laxmielectronics.com/about-us'
      },
      {
        page_path: '/mold-making',
        page_title: 'Mold Making Services - Engineering Design | Laxmi Electronics',
        meta_description: 'Leading precision mold maker since 1983. High-precision multi-cavity hot runner injection molds with latest technology and digitally driven manufacturing systems.',
        meta_keywords: 'mold making, injection molds, precision molds, hot runner molds, multi-cavity molds, mold design, Laxmi Electronics',
        og_title: 'Mold Making Services - Engineering Design',
        og_description: 'Leading precision mold maker since 1983 with high-precision multi-cavity hot runner injection molds.',
        og_image: '/assets/images/mold-making-banner.jpg',
        canonical_url: 'https://www.laxmielectronics.com/mold-making'
      },
      {
        page_path: '/thermoplastic-molding',
        page_title: 'Thermoplastic Molding - Injection Molding Services | Laxmi Electronics',
        meta_description: 'High capacity, fast turnaround production of injection molded plastic parts. Zero defect manufacturing through process-controlled methodologies. Capabilities from 20 tons to 300 tons.',
        meta_keywords: 'thermoplastic molding, injection molding, plastic injection, injection molded parts, CNC machines, precision injection molding',
        og_title: 'Thermoplastic Molding - Injection Molding Services',
        og_description: 'High capacity injection molded plastic parts with zero defect manufacturing processes.',
        og_image: '/assets/images/molding-banner.jpg',
        canonical_url: 'https://www.laxmielectronics.com/thermoplastic-molding'
      },
      {
        page_path: '/silicone-molding',
        page_title: 'Silicone Molding Services - LSR & HCR Molding | Laxmi Electronics',
        meta_description: 'Approved supplier of silicone parts for aerospace, medical and pharmaceutical industries. Specializing in LSR, HCR, and 2K molding with flashless precision and Class 8 clean room facilities.',
        meta_keywords: 'silicone molding, LSR molding, HCR molding, liquid silicone rubber, 2K molding, over-molding, silicone parts, medical silicone',
        og_title: 'Silicone Molding Services - LSR & HCR Molding',
        og_description: 'Approved supplier of silicone parts with flashless precision molding capabilities.',
        og_image: '/assets/images/silicone-molding-banner.jpg',
        canonical_url: 'https://www.laxmielectronics.com/silicone-molding'
      },
      {
        page_path: '/assembly-services',
        page_title: 'Assembly Services - Product Realization | Laxmi Electronics',
        meta_description: 'Comprehensive assembly services combining precision engineering with efficient production processes. End-to-end contract manufacturing solution through certified production processes.',
        meta_keywords: 'assembly services, contract manufacturing, product assembly, precision assembly, manufacturing services',
        og_title: 'Assembly Services - Product Realization',
        og_description: 'Comprehensive assembly services with precision engineering and efficient production processes.',
        og_image: '/assets/images/assembly-banner.jpg',
        canonical_url: 'https://www.laxmielectronics.com/assembly-services'
      },
      {
        page_path: '/contact-us',
        page_title: 'Contact Us - Get in Touch | Laxmi Electronics',
        meta_description: 'Contact Laxmi Electronics for quote requests, mold manufacturing, or component inquiries. Fill out the form and we will be in touch as soon as possible.',
        meta_keywords: 'contact Laxmi Electronics, quote request, mold manufacturing inquiry, get in touch, Bangalore contact',
        og_title: 'Contact Us - Get in Touch with Laxmi Electronics',
        og_description: 'Contact us for quote requests and manufacturing inquiries. We are here to help.',
        og_image: '/assets/images/delivering-bg.jpg',
        canonical_url: 'https://www.laxmielectronics.com/contact-us'
      },
      {
        page_path: '/quality',
        page_title: 'Quality Management - Accredited Quality | Laxmi Electronics',
        meta_description: 'Our commitment to quality with ISO 9001:2015, ISO 13485:2016, AS 9100D certifications. Proactive quality management through dedicated Quality Assurance teams and rigorous testing.',
        meta_keywords: 'quality management, ISO certification, ISO 9001, ISO 13485, AS 9100, quality assurance, certified manufacturing',
        og_title: 'Quality Management - Accredited Quality',
        og_description: 'ISO certified quality management with dedicated Quality Assurance teams.',
        og_image: '/assets/images/quality-banner.jpg',
        canonical_url: 'https://www.laxmielectronics.com/quality'
      },
      {
        page_path: '/competencies',
        page_title: 'Competencies - Comprehensive Manufacturing Solutions | Laxmi Electronics',
        meta_description: 'Comprehensive manufacturing solutions including Medical Molding, Pharmaceutical Molding, Aerospace Molding, Precision Mold Making, Silicone Molding, Thermoplastic Molding, 2K Molding, ISBM, and Assembly.',
        meta_keywords: 'manufacturing competencies, medical molding, pharmaceutical molding, aerospace molding, precision mold making, manufacturing solutions',
        og_title: 'Competencies - Comprehensive Manufacturing Solutions',
        og_description: 'Comprehensive manufacturing solutions across multiple industries and technologies.',
        og_image: '/assets/images/molding-banner.jpg',
        canonical_url: 'https://www.laxmielectronics.com/competencies'
      },
      {
        page_path: '/medical-molding',
        page_title: 'Medical Molding - Precision Medical Device Manufacturing | Laxmi Electronics',
        meta_description: 'Specialized medical device molding services with Class 8 cleanroom facilities. ISO 13485 certified manufacturing for medical components, devices, and pharmaceutical applications.',
        meta_keywords: 'medical molding, medical device manufacturing, medical components, cleanroom molding, ISO 13485, pharmaceutical molding, medical injection molding',
        og_title: 'Medical Molding - Precision Medical Device Manufacturing',
        og_description: 'ISO 13485 certified medical device molding with Class 8 cleanroom facilities.',
        og_image: '/assets/images/molding-banner.jpg',
        canonical_url: 'https://www.laxmielectronics.com/medical-molding'
      },
      {
        page_path: '/aerospace-molding',
        page_title: 'Aerospace Molding - AS 9100 Certified Manufacturing | Laxmi Electronics',
        meta_description: 'AS 9100D certified aerospace component manufacturing. Precision molding for aviation and space applications with rigorous quality standards and traceability.',
        meta_keywords: 'aerospace molding, AS 9100, aviation components, space components, aerospace manufacturing, precision aerospace parts',
        og_title: 'Aerospace Molding - AS 9100 Certified Manufacturing',
        og_description: 'AS 9100D certified aerospace component manufacturing for aviation and space applications.',
        og_image: '/assets/images/molding-banner.jpg',
        canonical_url: 'https://www.laxmielectronics.com/aerospace-molding'
      },
      {
        page_path: '/blow-molding',
        page_title: 'Blow Molding Services - ISBM Manufacturing | Laxmi Electronics',
        meta_description: 'Injection Stretch Blow Molding (ISBM) services for high-quality plastic containers and bottles. Precision blow molding for pharmaceutical, medical, and FMCG industries.',
        meta_keywords: 'blow molding, ISBM, injection stretch blow molding, plastic containers, bottles, pharmaceutical containers',
        og_title: 'Blow Molding Services - ISBM Manufacturing',
        og_description: 'Injection Stretch Blow Molding services for pharmaceutical and medical containers.',
        og_image: '/assets/images/molding-banner.jpg',
        canonical_url: 'https://www.laxmielectronics.com/blow-molding'
      },
      {
        page_path: '/gallery',
        page_title: 'Gallery - Manufacturing Excellence | Laxmi Electronics',
        meta_description: 'View our manufacturing facilities, equipment, and completed projects. Explore our state-of-the-art production capabilities and quality standards.',
        meta_keywords: 'Laxmi Electronics gallery, manufacturing facilities, production capabilities, equipment showcase',
        og_title: 'Gallery - Manufacturing Excellence',
        og_description: 'Explore our manufacturing facilities and production capabilities.',
        og_image: '/assets/images/molding-banner.jpg',
        canonical_url: 'https://www.laxmielectronics.com/gallery'
      },
      {
        page_path: '/events',
        page_title: 'Events - Industry Participation | Laxmi Electronics',
        meta_description: 'Stay updated with Laxmi Electronics\' participation in industry events, trade shows, and exhibitions. Connect with us at leading manufacturing and medical device conferences.',
        meta_keywords: 'Laxmi Electronics events, trade shows, exhibitions, manufacturing conferences, medical device events',
        og_title: 'Events - Industry Participation',
        og_description: 'Connect with us at leading manufacturing and medical device conferences.',
        og_image: '/assets/images/molding-banner.jpg',
        canonical_url: 'https://www.laxmielectronics.com/events'
      },
      {
        page_path: '/careers',
        page_title: 'Careers - Join Our Team | Laxmi Electronics',
        meta_description: 'Join Laxmi Electronics and be part of a leading precision molding company. Explore career opportunities in manufacturing, engineering, quality, and operations.',
        meta_keywords: 'Laxmi Electronics careers, jobs, employment, manufacturing jobs, engineering careers, Bangalore jobs',
        og_title: 'Careers - Join Our Team',
        og_description: 'Explore career opportunities with Laxmi Electronics.',
        og_image: '/assets/images/molding-banner.jpg',
        canonical_url: 'https://www.laxmielectronics.com/careers'
      },
      {
        page_path: '/locations',
        page_title: 'Locations - Our Facilities | Laxmi Electronics',
        meta_description: 'Visit Laxmi Electronics manufacturing facilities in Bangalore. State-of-the-art production capabilities with strategic location for global supply chain.',
        meta_keywords: 'Laxmi Electronics locations, Bangalore manufacturing, facilities, address, contact location',
        og_title: 'Locations - Our Facilities',
        og_description: 'Visit our state-of-the-art manufacturing facilities in Bangalore.',
        og_image: '/assets/images/molding-banner.jpg',
        canonical_url: 'https://www.laxmielectronics.com/locations'
      }
    ];

    for (const seo of seoData) {
      await pool.query(
        `INSERT INTO seo_metadata 
         (page_path, page_title, meta_description, meta_keywords, og_title, og_description, og_image, canonical_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         page_title = VALUES(page_title),
         meta_description = VALUES(meta_description),
         meta_keywords = VALUES(meta_keywords),
         og_title = VALUES(og_title),
         og_description = VALUES(og_description),
         og_image = VALUES(og_image),
         canonical_url = VALUES(canonical_url)`,
        [seo.page_path, seo.page_title, seo.meta_description, seo.meta_keywords, 
         seo.og_title, seo.og_description, seo.og_image, seo.canonical_url]
      );
    }

    res.json({
      success: true,
      message: 'SEO metadata initialized successfully'
    });
  } catch (error) {
    console.error('Error initializing SEO metadata:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// SMTP Settings
router.get('/smtp-settings', authenticateToken, async (req, res) => {
  try {
    const isConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
    
    res.json({
      success: true,
      configured: isConfigured,
      host: process.env.SMTP_HOST || '',
      port: process.env.SMTP_PORT || '587',
      fromEmail: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || '',
      fromName: process.env.SMTP_FROM_NAME || 'Laxmi Electronics'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.post('/smtp-settings', authenticateToken, async (req, res) => {
  try {
    // Note: In production, you'd want to save these to a database or config file
    // For now, we'll just return success and note that .env file needs to be updated
    res.json({
      success: true,
      message: 'SMTP settings received. Please update your .env file with these values and restart the server.',
      note: 'SMTP settings are stored in .env file. Update the file and restart the server for changes to take effect.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Email Templates
router.get('/email-templates', authenticateToken, async (req, res) => {
  try {
    // Check if email_templates table exists, if not create it
    await pool.query(`
      CREATE TABLE IF NOT EXISTS email_templates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        form_type VARCHAR(50) NOT NULL,
        template_type VARCHAR(50) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_template (form_type, template_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    const [templates] = await pool.query('SELECT * FROM email_templates ORDER BY form_type, template_type');

    // If no templates exist, create default ones
    if (templates.length === 0) {
      const defaultTemplates = [
        {
          form_type: 'contact',
          template_type: 'admin',
          subject: 'New Contact Form Submission',
          body: '<h2>New Contact Form Submission</h2><p><strong>Name:</strong> {{name}}</p><p><strong>Email:</strong> {{email}}</p><p><strong>Phone:</strong> {{phone}}</p><p><strong>Message:</strong> {{message}}</p>'
        },
        {
          form_type: 'contact',
          template_type: 'customer',
          subject: 'Thank You for Contacting Laxmi Electronics',
          body: '<h2>Thank You!</h2><p>Dear {{name}},</p><p>We have received your message and will get back to you soon.</p><p>Best regards,<br>Laxmi Electronics Team</p>'
        },
        {
          form_type: 'quote',
          template_type: 'admin',
          subject: 'New Quote Request',
          body: '<h2>New Quote Request</h2><p><strong>Name:</strong> {{name}}</p><p><strong>Email:</strong> {{email}}</p><p><strong>Phone:</strong> {{phone}}</p><p><strong>Requirement:</strong> {{requirement}}</p>'
        },
        {
          form_type: 'quote',
          template_type: 'customer',
          subject: 'Quote Request Received',
          body: '<h2>Thank You for Your Quote Request</h2><p>Dear {{name}},</p><p>We have received your quote request and will review it shortly.</p><p>Best regards,<br>Laxmi Electronics Team</p>'
        },
        {
          form_type: 'certification',
          template_type: 'admin',
          subject: 'New Certification Request',
          body: '<h2>New Certification Request</h2><p><strong>Name:</strong> {{name}}</p><p><strong>Email:</strong> {{email}}</p><p><strong>Certification Type:</strong> {{certificationType}}</p>'
        },
        {
          form_type: 'certification',
          template_type: 'customer',
          subject: 'Certification Request Received',
          body: '<h2>Thank You for Your Certification Request</h2><p>Dear {{name}},</p><p>We have received your certification request.</p><p>Best regards,<br>Laxmi Electronics Team</p>'
        }
      ];

      for (const template of defaultTemplates) {
        await pool.query(
          'INSERT INTO email_templates (form_type, template_type, subject, body) VALUES (?, ?, ?, ?)',
          [template.form_type, template.template_type, template.subject, template.body]
        );
      }

      const [newTemplates] = await pool.query('SELECT * FROM email_templates ORDER BY form_type, template_type');
      return res.json({
        success: true,
        data: newTemplates
      });
    }

    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.post('/email-templates', authenticateToken, async (req, res) => {
  try {
    const { id, form_type, template_type, subject, body } = req.body;

    if (id) {
      // Update existing template
      await pool.query(
        'UPDATE email_templates SET subject = ?, body = ? WHERE id = ?',
        [subject, body, id]
      );
    } else {
      // Create new template
      await pool.query(
        'INSERT INTO email_templates (form_type, template_type, subject, body) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE subject = VALUES(subject), body = VALUES(body)',
        [form_type, template_type, subject, body]
      );
    }

    res.json({
      success: true,
      message: 'Email template saved successfully'
    });
  } catch (error) {
    console.error('Error saving email template:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
