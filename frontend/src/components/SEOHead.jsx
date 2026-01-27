import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  ogTitle, 
  ogDescription, 
  ogImage,
  canonical 
}) => {
  const location = useLocation();

  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      if (!content) return;
      
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Meta description
    updateMetaTag('description', description || 'Laxmi Electronics - Leading manufacturer of silicone and plastic injection molds and components for Medical, Pharmaceutical, Aviation, Space and Healthcare industries.');

    // Meta keywords
    updateMetaTag('keywords', keywords || 'injection molding, silicone molding, plastic molding, medical devices, pharmaceutical molding, aerospace components, Laxmi Electronics');

    // Open Graph tags
    updateMetaTag('og:title', ogTitle || title, true);
    updateMetaTag('og:description', ogDescription || description, true);
    updateMetaTag('og:image', ogImage || '/assets/logo.png', true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:url', window.location.href, true);

    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', ogTitle || title);
    updateMetaTag('twitter:description', ogDescription || description);
    updateMetaTag('twitter:image', ogImage || '/assets/logo.png');

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical || window.location.href);

  }, [location, title, description, keywords, ogTitle, ogDescription, ogImage, canonical]);

  return null;
};

export default SEOHead;
