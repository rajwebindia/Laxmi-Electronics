const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Get SEO metadata for a page (public endpoint)
router.get('/:path', async (req, res) => {
  try {
    const path = req.params.path.replace(/-/g, '/');
    
    const [metadata] = await pool.query(
      'SELECT * FROM seo_metadata WHERE page_path = ?',
      [path]
    );

    if (metadata.length === 0) {
      // Return default SEO data
      return res.json({
        success: true,
        data: {
          page_path: path,
          page_title: 'Laxmi Electronics - Precision Molding Solutions',
          meta_description: 'Laxmi Electronics - Leading manufacturer of silicone and plastic injection molds and components.',
          meta_keywords: 'injection molding, silicone molding, Laxmi Electronics',
          og_title: 'Laxmi Electronics',
          og_description: 'Leading manufacturer of precision molding solutions',
          og_image: '/assets/logo.png',
          canonical_url: `https://www.laxmielectronics.com${path}`
        }
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

module.exports = router;
