const { pool, initializeDatabase } = require('../config/database');
require('dotenv').config();

// Initialize SEO metadata for all pages
const initSEO = async () => {
  try {
    await initializeDatabase();

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

    console.log('✅ SEO metadata initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing SEO metadata:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Run initialization
initSEO();
