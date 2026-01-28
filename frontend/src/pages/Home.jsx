import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SuccessModal from '../components/SuccessModal';
import { executeRecaptcha } from '../utils/recaptcha';

// API endpoint for sending emails
import { EMAIL_API_ENDPOINT } from '../utils/api';

// Helper function to format textarea content for email (preserve newlines, escape HTML)
const formatTextareaForEmail = (text) => {
  if (!text) return '';
  // Escape HTML characters to prevent XSS
  const escaped = String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  // Convert newlines to <br> tags
  return escaped.replace(/\n/g, '<br>');
};

// Counter animation hook
const useCounter = (target, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const countRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    if (hasStarted) {
      const increment = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);

      return () => {
        clearInterval(timer);
        if (countRef.current) {
          observer.disconnect();
        }
      };
    }

    return () => {
      if (countRef.current) {
        observer.disconnect();
      }
    };
  }, [target, duration, hasStarted]);

  return { count, ref: countRef };
};

const Home = () => {
  const [videoOpen, setVideoOpen] = useState(false);
  const modalVideoRef = useRef(null);
  const carouselRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const autoScrollIntervalRef = useRef(null);
  const [isoSlide, setIsoSlide] = useState(0);
  const [circularImageSlide, setCircularImageSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const circularSliderRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successTitle, setSuccessTitle] = useState('Thank You!');

  const openVideo = () => setVideoOpen(true);
  const closeVideo = () => {
    if (modalVideoRef.current) {
      try { modalVideoRef.current.pause(); } catch (_) { }
    }
    setVideoOpen(false);
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeVideo(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Detect mobile view (320px to 768px - slider enabled)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768); // slider up to 768px
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset state on mount (fixes browser back navigation issues)
  useEffect(() => {
    // Reset state values
    setCurrentSlide(0);
    setIsoSlide(0);
    setCircularImageSlide(0);
    setIsDragging(false);
    dragStartRef.current = { x: 0, y: 0 };

    // Reset carousel scroll position after a short delay
    const timer = setTimeout(() => {
      try {
        if (carouselRef.current) {
          carouselRef.current.scrollLeft = 0;
        }
      } catch (error) {
        // Silently handle errors
      }
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Re-trigger reveal animations inside circular slider after slide change
  useEffect(() => {
    if (!circularSliderRef.current) {
      return;
    }
    const revealElements = circularSliderRef.current.querySelectorAll(
      '.reveal, .reveal-text, .reveal-image, .reveal-line'
    );
    revealElements.forEach((el) => {
      el.classList.remove('in', 'visible', 'animated');
    });

    const timer = setTimeout(() => {
      revealElements.forEach((el) => {
        // Force reflow so the animation restarts reliably
        void el.offsetHeight;
        el.classList.add('in', 'visible');
      });
    }, 30);

    return () => clearTimeout(timer);
  }, [currentSlide]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle name input with validation (alphabets, spaces, and dots only, max 50 chars)
  const handleNameChange = (e) => {
    const value = e.target.value;
    // Only allow alphabets, spaces, and dots
    const filteredValue = value.replace(/[^a-zA-Z\s.]/g, '').slice(0, 50);
    setFormData(prev => ({
      ...prev,
      name: filteredValue
    }));
    // Clear error when user starts typing
    if (formErrors.name) {
      setFormErrors(prev => ({
        ...prev,
        name: ''
      }));
    }
  };

  // Handle phone input with validation (+, -, only one space total, parentheses, 7-20 chars)
  const handlePhoneChange = (e) => {
    let value = e.target.value;
    // Only allow digits, +, -, spaces, and parentheses
    value = value.replace(/[^0-9+\-() ]/g, '');
    // Allow only one space in the entire phone number
    const spaceCount = (value.match(/\s/g) || []).length;
    if (spaceCount > 1) {
      // Keep only the first space, remove all others
      const firstSpaceIndex = value.indexOf(' ');
      if (firstSpaceIndex !== -1) {
        value = value.substring(0, firstSpaceIndex + 1) + value.substring(firstSpaceIndex + 1).replace(/\s/g, '');
      } else {
        value = value.replace(/\s/g, '');
      }
    }
    // Limit to 20 characters
    value = value.slice(0, 20);
    setFormData(prev => ({
      ...prev,
      phone: value
    }));
    // Clear error when user starts typing
    if (formErrors.phone) {
      setFormErrors(prev => ({
        ...prev,
        phone: ''
      }));
    }
  };

  // Handle message input with validation (max 500 chars, allow newlines, block vulnerable characters)
  const handleMessageChange = (e) => {
    let value = e.target.value;
    
    // Block vulnerable characters: <, >, *, =, ;, ~
    value = value.replace(/[<>*=;~]/g, '');
    
    // Block vulnerable characters for XSS prevention
    // Remove HTML tags and script-related content
    value = value.replace(/<[^>]*>/g, ''); // Remove HTML tags
    value = value.replace(/&/g, ''); // Remove & (HTML entities)
    value = value.replace(/javascript:/gi, ''); // Remove javascript: protocol
    value = value.replace(/on\w+\s*=/gi, ''); // Remove event handlers like onclick=, onerror=, etc.
    value = value.replace(/script/gi, ''); // Remove script tags content
    
    // Limit to 500 characters
    value = value.slice(0, 500);
    
    setFormData(prev => ({
      ...prev,
      message: value
    }));
    
    // Clear error when user starts typing
    if (formErrors.message) {
      setFormErrors(prev => ({
        ...prev,
        message: ''
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.length > 50) {
      errors.name = 'Name must not exceed 50 characters';
    } else if (!/^[a-zA-Z\s.]*$/.test(formData.name)) {
      errors.name = 'Name can only contain alphabets, spaces, and dots';
    }
    
    // Phone validation (required field)
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (formData.phone.length < 7) {
      errors.phone = 'Phone number must be at least 7 characters';
    } else if (formData.phone.length > 20) {
      errors.phone = 'Phone number must not exceed 20 characters';
    } else if (!/^[0-9+\-() ]*$/.test(formData.phone)) {
      errors.phone = 'Phone number can only contain numbers (0-9), one space, plus sign (+), hyphen (-), and parentheses';
    } else {
      const spaceCount = (formData.phone.match(/\s/g) || []).length;
      if (spaceCount > 1) {
        errors.phone = 'Only one space is allowed in the phone number';
      }
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else {
      const email = formData.email.trim();
      // Check if email contains @
      if (!email.includes('@')) {
        errors.email = 'Email must contain @ symbol';
      } else {
        const parts = email.split('@');
        // Check if there's content before @
        if (parts[0].length === 0) {
          errors.email = 'Email must have content before @ symbol';
        } else if (parts.length > 2) {
          errors.email = 'Email can only contain one @ symbol';
        } else {
          // Check if there's a dot after @
          const afterAt = parts[1];
          if (!afterAt.includes('.')) {
            errors.email = 'Email must contain a dot (.) after @ symbol';
          } else {
            const dotParts = afterAt.split('.');
            // Check if there's content between @ and dot, and after dot
            if (dotParts[0].length === 0) {
              errors.email = 'Email must have domain name before dot (.)';
            } else if (dotParts[dotParts.length - 1].length === 0) {
              errors.email = 'Email must have extension after dot (.)';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              errors.email = 'Please enter a valid email address format';
            }
          }
        }
      }
    }
    
    // Message validation
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.length > 500) {
      errors.message = 'Message must not exceed 500 characters';
    } else {
      // Check for blocked characters: <, >, *, =, ;, ~
      if (/[<>*=;~]/.test(formData.message)) {
        errors.message = 'Characters <, >, *, =, ;, ~ are not allowed';
      } else if (/<[^>]*>/.test(formData.message)) {
        errors.message = 'HTML tags are not allowed';
      } else if (/&/.test(formData.message)) {
        errors.message = 'Ampersand (&) is not allowed';
      } else if (/javascript:/gi.test(formData.message)) {
        errors.message = 'JavaScript code is not allowed';
      } else if (/on\w+\s*=/gi.test(formData.message)) {
        errors.message = 'Event handlers are not allowed';
      } else if (/script/gi.test(formData.message)) {
        errors.message = 'Script content is not allowed';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Send email notifications
  const sendEmailNotifications = async () => {
    // Note: Admin email is automatically set from ADMIN_EMAIL in .env file by the server
    // The value here is just a placeholder - server will override it with .env value
    const adminEmail = 'marketing@laxmielectronics.com'; // Server uses ADMIN_EMAIL from .env
    const customerEmail = formData.email;

    // Email data for admin notification
    const adminEmailData = {
      to: adminEmail,
      subject: `New Quote Request from ${formData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #08222B;">New Quote Request</h2>
          <p>A new quote request has been submitted on the Laxmi Electronics website.</p>
          <h3 style="color: #08222B; margin-top: 24px;">Contact Details:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Name:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Email:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Phone:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Message:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formatTextareaForEmail(formData.message)}</td>
            </tr>
          </table>
          <p style="margin-top: 24px; color: #666;">This is an automated notification from the Laxmi Electronics website.</p>
        </div>
      `,
    };

    // Email data for customer confirmation
    const customerEmailData = {
      to: customerEmail,
      subject: 'Thank you for contacting Laxmi Electronics',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #08222B;">Thank You for Your Inquiry</h2>
          <p>Dear ${formData.name},</p>
          <p>Thank you for contacting Laxmi Electronics. We have received your quote request and our team will review it shortly.</p>
          <p>We appreciate your interest in our services and will get back to you as soon as possible.</p>
          <h3 style="color: #08222B; margin-top: 24px;">Your Request Summary:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Your Message:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formatTextareaForEmail(formData.message)}</td>
            </tr>
          </table>
          <p style="margin-top: 24px;">If you have any questions or need to provide additional information, please feel free to contact us at <a href="mailto:marketing@laxmielectronics.com" style="color: #08222B;">marketing@laxmielectronics.com</a>.</p>
          <p style="margin-top: 16px;">Best regards,<br><strong>Laxmi Electronics Team</strong></p>
        </div>
      `,
    };

    try {
      const recaptchaToken = await executeRecaptcha('quote_submit');
      // Call API endpoint to send emails
      const response = await fetch(EMAIL_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminEmail: adminEmailData,
          customerEmail: customerEmailData,
          formData: formData,
          formType: 'quote',
          recaptchaToken,
          recaptchaAction: 'quote_submit',
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `Server error: ${response.status} ${response.statusText}`;
        if (isJson) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (e) {
            // If JSON parsing fails, use status text
          }
        } else {
          // Response is not JSON (likely HTML error page)
          const textResponse = await response.text();
          errorMessage = `Server returned non-JSON response. The API endpoint may not exist or the server is misconfigured. Status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }
      
      if (!isJson) {
        // Response is not JSON (shouldn't happen for successful responses)
        const textResponse = await response.text();
        throw new Error(`Server returned non-JSON response. Status: ${response.status}`);
      }

      const result = await response.json();
      
      // Only throw error if it's a critical failure (not just warnings)
      // Backend returns success: true even with warnings (like database save failure)
      if (!result.success && !result.warning) {
        const errorMsg = result.message || 'Email sending failed';
        throw new Error(errorMsg);
      }
      
      // Return result even if some emails failed - warnings are acceptable
      return result;
    } catch (error) {
      
      // Detect different types of errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Cannot connect to server. Please make sure the backend server is running on port 3001.\n\nTo start the server, run: npm run server`);
      }
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error(`Network error: Cannot reach the server. Please make sure the backend server is running.\n\nTo start the server, run: npm run server`);
      }
      
      throw error;
    }
  };

  // Industry data - matching reference website images
  const industries = [
    { name: 'MEDICAL', image: '/assets/images/medical.jpg' },
    { name: 'AEROSPACE', image: '/assets/images/aero.jpg' },
    { name: 'PHARMA', image: '/assets/images/landing-pharma.jpg' },
  ];

  // Function to get the URL for each industry
  const getIndustryUrl = (industryName) => {
    const urlMap = {
      'PHARMA': '/mold-making#pharmaceutical-molding',
      'MEDICAL': '/mold-making#medical-equipment-devices',
      'AEROSPACE': '/mold-making#aerospace-industry',
    };
    return urlMap[industryName] || '/mold-making';
  };

  // ISO Certifications gallery data
  const isoCertifications = [
    { name: 'ISO 9100', image: '/assets/images/iso-9100.png' },
    { name: 'ISO 9001:2015', image: '/assets/images/9001-20015.png' },
    { name: 'UL Traceability', image: '/assets/images/ul-traceability.png' },
    { name: 'ISO 13485:2016', image: '/assets/images/13485-2016.png' },
  ];

  // Circular image slider data
  const circularImages = [
    { 
      name: 'CUSTOMIZED SOLUTIONS', 
      image: '/assets/images/Customized-Solutions.png',
      heading: 'CUSTOMIZED SOLUTIONS',
      description: '40+ years of hands-on experience.'
    },
    { 
      name: 'END-TO-END SOLUTIONS', 
      image: '/assets/images/End-2-End-Solutions.png',
      heading: 'END-TO-END SOLUTIONS',
      description: 'We build devices end-users can depend on.'
    },
    { 
      name: 'EXCEPTIONAL QUALITY', 
      image: '/assets/images/Exceptional-Quality.png',
      heading: 'EXCEPTIONAL QUALITY',
      description: 'Precision-engineered and rigorously tested in our ISO certified facilities.'
    },
    { 
      name: 'TRUSTED COLLABORATOR', 
      image: '/assets/images/Optimized-Manufacture.png',
      heading: 'TRUSTED COLLABORATOR',
      description: 'Our personnel are an extension of your engineering, development, design, quality and manufacturing teams'
    },
    { 
      name: 'OPTIMIZED MANUFACTURE', 
      image: '/assets/images/Trusted-Collaborator.png',
      heading: 'OPTIMIZED MANUFACTURE',
      description: 'Investments in cutting-edge technology and processes that accelerate timelines and deliver greater efficiency'
    },
  ];

  // Helper function to initialize carousel scroll position
  const initializeCarouselScroll = (container, cards) => {
    const firstCard = cards[0];
    if (!firstCard || firstCard.offsetWidth === 0) return;

    const cardWidth = firstCard.offsetWidth;
    const gap = 0; // Mobile has no gap (full width cards)
    const scrollAmount = cardWidth + gap;
    const clonedItemsCount = industries.length; // Number of cloned items at start
    const originalItemsWidth = scrollAmount * industries.length;
    const startPosition = scrollAmount * clonedItemsCount;
    const endPosition = startPosition + originalItemsWidth;

    // Ensure we have valid dimensions before setting scroll
    if (startPosition > 0 && endPosition > startPosition) {
      // Use multiple requestAnimationFrame calls to ensure DOM is ready
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          try {
            if (container) {
              // Set scroll position to start of original items (after cloned items)
              container.scrollLeft = startPosition;
              // Force a reflow to ensure scroll position is applied
              void container.offsetHeight;
            }
          } catch (error) {
          }
        });
      });
    }
  };

  // Initialize carousel scroll position and handle infinite scroll (mobile only)
  useEffect(() => {
    if (!carouselRef.current) {
      return;
    }

    if (!isMobile) {
      // Reset scroll position for desktop
      try {
        carouselRef.current.scrollLeft = 0;
      } catch (error) {
      }
      return;
    }

    const container = carouselRef.current;
    if (!container) return;

    let timeoutId;
    let handleScroll;
    let isAdjusting = false;

    // First, reset scroll position to prevent browser restoration conflicts
    try {
      container.scrollLeft = 0;
    } catch (error) {
    }

    // Wait for cards to render and browser scroll restoration to complete
    timeoutId = setTimeout(() => {
      try {
        if (!container) return;
        
        const cards = container.querySelectorAll('.industry-carousel-card');
        if (cards.length === 0) return;

        const firstCard = cards[0];
        if (!firstCard || firstCard.offsetWidth === 0) {
          // Retry after a short delay if cards aren't ready
          setTimeout(() => {
            if (container && firstCard && firstCard.offsetWidth > 0) {
              initializeCarouselScroll(container, cards);
            }
          }, 100);
          return;
        }

        initializeCarouselScroll(container, cards);

        // Handle infinite scroll on scroll event
        handleScroll = () => {
          if (isAdjusting || !container) return;

          try {
            const cards = container.querySelectorAll('.industry-carousel-card');
            if (cards.length === 0) return;
            
            const firstCard = cards[0];
            if (!firstCard || firstCard.offsetWidth === 0) return;

            const cardWidth = firstCard.offsetWidth;
            const gap = 0;
            const scrollAmount = cardWidth + gap;
            const clonedItemsCount = industries.length;
            const originalItemsCount = industries.length;
            const startPosition = scrollAmount * clonedItemsCount;
            const endPosition = startPosition + (scrollAmount * originalItemsCount);
            
            const scrollLeft = container.scrollLeft;
            const threshold = scrollAmount * 0.1; // Small threshold for better detection

            // If scrolled past the end (into cloned items at end), jump to beginning of original items
            if (scrollLeft >= endPosition - threshold) {
              isAdjusting = true;
              requestAnimationFrame(() => {
                try {
                  if (container) {
                    // Jump to start position (first original item)
                    container.scrollLeft = startPosition;
                  }
                } catch (error) {
                } finally {
                  isAdjusting = false;
                }
              });
            }
            // If scrolled before the start (into cloned items at beginning), jump to end of original items
            else if (scrollLeft < startPosition - threshold) {
              isAdjusting = true;
              requestAnimationFrame(() => {
                try {
                  if (container) {
                    // Jump to last original item
                    const lastOriginalPosition = endPosition - scrollAmount;
                    container.scrollLeft = lastOriginalPosition;
                  }
                } catch (error) {
                } finally {
                  isAdjusting = false;
                }
              });
            }
          } catch (error) {
          }
        };

        if (container) {
          container.addEventListener('scroll', handleScroll, { passive: true });
        }
      } catch (error) {
      }
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      if (handleScroll && container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [industries.length, isMobile]);

  // Counter animations
  const count40 = useCounter(40, 2000);
  const count4 = useCounter(4, 1500);
  const count4000 = useCounter(4000, 2500);
  const count300 = useCounter(300, 2500);

  // Partners section counters
  const count75 = useCounter(40, 2000);
  const count70 = useCounter(4, 1500);
  const count2 = useCounter(4000, 2500);
  const count100 = useCounter(300, 2500);

  // Carousel navigation with infinite scroll - one item at a time (mobile only)
  const scrollCarousel = useCallback((direction) => {
    if (!carouselRef.current || !isMobile) return;

    const container = carouselRef.current;
    const cards = container.querySelectorAll('.industry-carousel-card');

    if (cards.length === 0) return;

    // Get the first card's width to calculate exact scroll amount
    const firstCard = cards[0];
    if (!firstCard || firstCard.offsetWidth === 0) return;

    const cardWidth = firstCard.offsetWidth;
    const gap = 0; // Mobile has no gap (full width cards)
    const scrollAmount = cardWidth + gap;
    const clonedItemsCount = industries.length; // Number of cloned items at start (3)
    const originalItemsCount = industries.length; // Number of original items (3)
    const startPosition = scrollAmount * clonedItemsCount; // Position after cloned items (position 3)
    const endPosition = startPosition + (scrollAmount * originalItemsCount); // Position after original items (position 6)

    const currentScroll = container.scrollLeft;

    if (direction === 'next') {
      let targetScroll = currentScroll + scrollAmount;

      // If would scroll past the end of original items, loop to beginning
      if (targetScroll >= endPosition) {
        // Jump to start position (first original item)
        requestAnimationFrame(() => {
          container.scrollLeft = startPosition;
          // Force a reflow
          void container.offsetHeight;
        });
        return;
      }

      // Normal forward scroll
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    } else if (direction === 'prev') {
      let targetScroll = currentScroll - scrollAmount;

      // If would scroll before the start of original items, loop to end
      if (targetScroll < startPosition) {
        // Jump to last original item (endPosition - scrollAmount)
        const lastOriginalPosition = endPosition - scrollAmount;
        requestAnimationFrame(() => {
          container.scrollLeft = lastOriginalPosition;
          // Force a reflow
          void container.offsetHeight;
        });
        return;
      }

      // Normal backward scroll
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  }, [industries.length, isMobile]);

  // Auto-scroll carousel (mobile only)
  useEffect(() => {
    // Clear any existing interval
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }

    // Only auto-scroll on mobile if not hovered
    if (isMobile && !isCarouselHovered && scrollCarousel) {
      autoScrollIntervalRef.current = setInterval(() => {
        scrollCarousel('next');
      }, 3000); // Auto-scroll every 3 seconds
    }

    // Cleanup on unmount or when hover state changes
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [isCarouselHovered, scrollCarousel, isMobile]);

  // Pause auto-scroll when user clicks navigation buttons
  const handleCarouselNavigation = useCallback((direction) => {
    // Pause auto-scroll temporarily
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
    
    // Perform the scroll
    scrollCarousel(direction);
    
    // Resume auto-scroll after 5 seconds
    if (isMobile && !isCarouselHovered) {
      setTimeout(() => {
        if (isMobile && !isCarouselHovered && scrollCarousel) {
          autoScrollIntervalRef.current = setInterval(() => {
            scrollCarousel('next');
          }, 3000);
        }
      }, 5000);
    }
  }, [scrollCarousel, isMobile, isCarouselHovered]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden hero-section">
        {/* Background overlays to match Framer look */}
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute -top-20 -left-20 sm:-top-32 sm:-left-32 md:-top-40 md:-left-40 w-[240px] h-[240px] sm:w-[360px] sm:h-[360px] md:w-[480px] md:h-[480px] rounded-full hero-ellipse-teal" />
        <div className="absolute bottom-[-60px] right-[-60px] sm:bottom-[-90px] sm:right-[-90px] md:bottom-[-120px] md:right-[-120px] w-[260px] h-[260px] sm:w-[390px] sm:h-[390px] md:w-[520px] md:h-[520px] rounded-full hero-ellipse-yellow" />



        {/* Content */}
        <div className="relative z-20 w-full pt-14 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-20 2xl:pt-24 pb-8 sm:pb-12 md:pb-16 lg:pb-0">
          <div className="mx-auto px-5 sm:px-4 md:px-6 lg:px-[48px] xl:px-[40px] 2xl:px-[48px]">
            <div className="mx-auto relative">
              {/* Mobile: Text centered full width, then video below. Desktop: original layout */}
              <div className="flex flex-col lg:block">
                {/* Text content - Centered full width on mobile, original on desktop */}
                <div className="w-full lg:w-4/5 mb-5 sm:mb-6 md:mb-8 lg:mb-0">
                  <div className="space-y-1 sm:space-y-1.5 md:space-y-2 text-center lg:text-right">
                    <h1
                      className="text-white hero-heading text-center lg:text-right text-[28px] sm:text-[55px] md:text-[75px] lg:text-[120px] xl:text-[140px] 2xl:text-[160px] reveal reveal-up delay-100 leading-[0.9] sm:leading-tight lg:leading-none"
                    >
                      BUILDING
                    </h1>
                    <h1
                      className="text-white hero-heading-turnaround text-center lg:text-right text-[28px] sm:text-[55px] md:text-[75px] lg:text-[120px] xl:text-[140px] 2xl:text-[160px] reveal reveal-up delay-300 leading-[0.9] sm:leading-tight lg:leading-none"
                    >
                      THE FUTURE
                    </h1>
                  </div>
                </div>
                
                {/* Play icon - 160px on mobile, absolute positioned on desktop */}
                <div
                  className="w-full lg:w-auto flex justify-center lg:absolute lg:right-24 lg:top-1/3 lg:-translate-y-1/2 z-10 cursor-pointer reveal reveal-left mb-5 sm:mb-6 md:mb-8 lg:mb-0"
                  onClick={openVideo}
                  role="button"
                  aria-label="Play video"
                  title="Play video"
                >
                  <div className="relative w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] md:w-[280px] md:h-[280px] lg:w-56 lg:h-56 xl-1300:w-48 xl-1300:h-48 2xl:w-56 2xl:h-56">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{ background: 'linear-gradient(116deg, rgb(22,99,126) 0%, rgb(12,53,67) 100%)' }}
                    />
                    {/* Preview video inside circle */}
                    <video
                      src="/assets/videos/Medical.mp4"
                      className="absolute inset-0 w-full h-full rounded-full object-cover"
                      muted
                      loop
                      playsInline
                      autoPlay
                      preload="auto"
                    />
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{ border: '1px solid rgb(23,103,130)' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="play-icon"><img src="/assets/icons/play.svg" alt="play" /></div>
                    </div>
                  </div>
                </div>

                {/* Description and CTA - Responsive spacing */}
                <div className="mt-5 sm:mt-6 md:mt-6 lg:mt-8 reveal reveal-up delay-300">
                  <div className="hero-desc-wrap mx-auto text-center max-w-full">
                    <p className="hero-desc text-white/95 text-[13px] sm:text-sm md:text-base lg:text-lg leading-relaxed">
                      Pharmaceutical and Medical Device - <br/>Design & Manufacture <br/>Aerospace Components and Sub-Assemblies
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-5 md:mt-5 lg:mt-6 flex justify-center">
                    <a
                      href="/contact-us"
                      className="group inline-flex items-center gap-1.5 sm:gap-2 md:gap-3 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-[4px] text-white btn-gradient font-bold cta-motion text-xs sm:text-sm md:text-base"
                    >
                      Learn more
                      <img src="/assets/icons/arrow.svg" alt="" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process & About (split image/text blocks) */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Block */}
          <div className="relative min-h-[450px] sm:min-h-[500px] md:min-h-[520px] md:h-[800px] overflow-hidden">
            <img
              src="/assets/images/Competencies.jpg"
              alt="Scientist and solar panels"
              className="absolute inset-0 w-full h-full object-cover reveal-image"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
            <div className="relative z-10 h-full flex flex-col justify-between items-end px-5 sm:px-4 md:px-6 lg:px-[48px] py-10 sm:py-14 md:py-16 lg:py-[120px] flex-none">
              <div className="self-start w-full space-y-3 sm:space-y-4">
                <h3 className="text-white heading-competencies reveal-text reveal-up delay-100"> COMPETENCIES</h3>
                <h3 className="text-white heading-competencies1 reveal-text reveal-up delay-200">WE PROVIDE</h3>
                <p className="competencies-description text-sm sm:text-base mt-3 sm:mt-4 reveal-text reveal-up delay-300">
                  You will find yourself working in a true partnership that results in an incredible experience and a product that is the best.
                </p>
              </div>
              <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 self-start">
                <a
                  href="/competencies"
                  className="inline-flex items-center gap-1.5 sm:gap-2 rounded-[4px] px-4 sm:px-4 md:px-5 py-2 sm:py-2 text-white border border-white/60 hover:bg-white/10 transition cta-motion"
                >
                  <span className="text-[11px] sm:text-xs md:text-[13px] font-semibold uppercase tracking-[0.25px]"> Take a look at what we do</span>
                  <img src="/assets/icons/arrow.svg" alt="" className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Block */}
          <div className="relative min-h-[450px] sm:min-h-[500px] md:min-h-[520px] md:h-[800px] overflow-hidden">
            <img
              src="/assets/images/one-stop-solution-1.jpg"
              alt="Ceramic Components"
              className="absolute inset-0 w-full h-full object-cover object-right-top reveal-image"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(217deg, #fff 0%, rgba(255, 255, 255, 0.3) 100%)' }}
            />
            <div className="relative z-10 h-full flex flex-col justify-between items-end px-5 sm:px-4 md:px-6 lg:px-[48px] py-10 sm:py-14 md:py-16 lg:py-[120px] flex-none">
              <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8 order-1 self-end reveal reveal-left delay-200">
                <a
                  href="/about-us"
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-4 md:px-5 py-2 sm:py-2 text-[#08222B] btn-outline-gradient-dark hover:bg-[#08222B]/5 transition cta-motion"
                >
                  <span className="text-[11px] sm:text-xs md:text-[13px] font-semibold uppercase tracking-[0.25px]">Know more about us</span>
                  <img src="/assets/icons/info.svg" alt="" className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </a>
              </div>
              <div className="text-right order-2 self-end space-y-1 sm:space-y-1.5">
                <h3 className="heading-onestop reveal-text reveal-up delay-100">YOUR ONE-STOP</h3>
                <h3 className="heading-onestop1 reveal-text reveal-up delay-200">SOLUTION</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners you Can Trust Section - Omnis Design */}
      <section className="partners-trust-section py-16 sm:py-20 md:py-28 lg:py-36 xl:py-40 px-5 sm:px-4 md:px-6 lg:px-[48px] reveal reveal-up" data-framer-name="Trustful Partners">
        {/* Decorative wireframe shapes */}
        <figure className="partners-cylinder-shape" data-framer-name="cylinder shape">
          <img
            src="/assets/images/cylinder-shape.svg"
            alt="Component shape"
            className="w-full h-full object-contain"
          />
        </figure>
        <figure className="partners-component-shape" data-framer-name="shape">
          <img
            src="/assets/images/component-shape.svg"
            alt="Component shape"
            className="w-full h-full object-contain"
          />
        </figure>

        <div className="partners-trust-container relative z-10 max-w-[1600px] mx-auto">
          {/* Headings */}
          <div className="partners-headings-wrapper">
            <h3 className="partners-heading-you-can reveal-text reveal-up delay-100">A Partner</h3>
            <h3 className="partners-heading-you-can reveal-text reveal-up delay-200">You Can</h3>
            <h3 className="partners-heading-trust reveal-text reveal-up delay-300">Trust</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            {/* Left Side - Text Content */}
            <div className="hidden md:block"></div>
            <div className="partners-content-left">
              {/* First Paragraph */}
              <div className="partners-text-block pt-6 md:pt-0 mb-4 sm:mb-5 md:mb-6 reveal-text reveal-up delay-200">
                <p className="partners-text-laxmi text-sm sm:text-base md:text-lg leading-relaxed">
                  LAXMI is a leading manufacturer of silicone and plastic injection molds and components. Our major clients are from the Medical, Pharmaceutical, Aviation, Space and Healthcare industries.
</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-5 sm:gap-5 md:gap-6 lg:gap-12 xl:gap-16 mt-5 sm:mt-6 md:mt-8 mb-6 sm:mb-8 md:mb-12 lg:mb-16">
              {/* Second Paragraph */}
              <div className="partners-text-block reveal reveal-up delay-300">
                <div className="partners-desc-top-line reveal-line delay-400"></div>
                <p className="partners-text-innovative text-sm sm:text-base">
                  We provide innovative,
                  high-performance solutions to
                  customers across critical
                  industries, ensuring precision
                  and reliability at every stage.</p>
              </div>

              {/* Third Paragraph */}
              <div className="partners-text-block reveal reveal-up delay-400">
                <div className="partners-desc-top-line reveal-line delay-500"></div>
                <p className="partners-text-innovative text-sm sm:text-base">
                  We are dedicated to staying at
                  the forefront of innovation,
                  delivering cutting-edge
                  solutions that drive progress and
                  empower our customers around
                  the world.</p>
              </div>
              </div>
            </div>
          </div>

          {/* Full Width Image with Stats */}
          <div className="partners-image-stats-wrapper reveal reveal-up delay-300">
            <div className="partners-image-container">
              <img
                src="/assets/images/delivering-bg.jpg"
                alt="Wind towers on sea"
                className="w-full h-full object-cover reveal-image"
              />
              <div className="partners-image-overlay"></div>

              {/* Content Over Image */}
              <div className="partners-image-content">
                {/* Top Section - Expertise Full Width */}
                <div className="partners-image-top-section">
                  {/* Our Expertise - Full Width */}
                  <div className="partners-expertise-section-fullwidth reveal reveal-up delay-400">
                    <div className="partners-expertise-tag-wrapper">
                      {/* <p className="partners-expertise-tag text-xs sm:text-sm"> Delivering best in class products</p> */}
                      <h4 className="partners-onestop-heading reveal-text delay-100">Delivering best in class products</h4>
                    </div>
                    <div className="partners-desc-top-line reveal-line delay-200"></div>
                  </div>

                  {/* Our Goal - Right */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-4 md:gap-6 lg:gap-12 xl:gap-16 mb-4 sm:mb-6 md:mb-8 lg:mb-12 xl:mb-16">
                    <div className="hidden md:block"></div>
                    <div className="hidden md:block"></div>
                  <div className="partners-goal-section-right sm:col-span-2 md:col-span-1 w-full reveal reveal-up delay-500">
                    {/* <p className="partners-expertise-tag text-xs sm:text-sm mb-2">Our Goal</p> */}
                    <h6 className="partners-goal-heading text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed reveal-text delay-100">– to customers seeking peak performance by providing standard and custom solutions
</h6>
                  </div>
                  </div>
                 
                </div>

                {/* Stats Grid - Bottom */}
                <ul className="partners-stats-grid">
                  <li className="partners-stat-item" ref={count75.ref}>
                    <div className="partners-stat-number-wrapper">
                      <span className="partners-stat-number">{count75.count}</span>
                      <span className="partners-stat-title">+</span>
                    <span className="partners-stat-title">years</span>
                    </div>
                    
                    <p className="partners-stat-text">
                    industry experience
                    </p>
                  </li>
                  <li className="partners-stat-item" ref={count70.ref}>
                    <div className="partners-stat-number-wrapper">
                      <span className="partners-stat-number">{count70.count}</span>
                      <span className="partners-stat-title">modern</span>
                    </div>
                    
                    <p className="partners-stat-text">
                    manufacturing units
                    </p>
                  </li>
                  <li className="partners-stat-item" ref={count2.ref}>
                    <div className="partners-stat-number-wrapper">
                      <span className="partners-stat-number">{count2.count}</span>
                      <span className="partners-stat-title">+</span>
                    </div>
                  
                    <p className="partners-stat-text">
                    molds manufactured
                    </p>
                  </li>
                  <li className="partners-stat-item" ref={count100.ref}>
                    <div className="partners-stat-number-wrapper">
                      <span className="partners-stat-number">{count100.count}</span>
                      <span className="partners-stat-title">million +</span>
                    </div>
                    
                    <p className="partners-stat-text">
                    parts molded per year
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Great things come in custom Engineered Solutions Section */}
      <section
        className="relative py-16 sm:py-20 md:py-28 lg:py-36 xl:py-40 px-5 sm:px-4 md:px-6 lg:px-[48px] overflow-hidden"
        style={{ background: 'linear-gradient(59deg, #e0e8eb 0%, #fff 100%)' }}
      >
        {/* Decorative component shape */}
        <img
          src="/assets/images/industies-served-1.svg"
          alt=""
          className="absolute top-0 right-0 w-[300px] sm:w-[400px] md:w-[509px] h-[280px] sm:h-[350px] md:h-[472px] hidden sm:block opacity-100 z-0"
        />

        <div className="relative z-10 w-full">
          {/* Headings */}
          <div className="mb-10 sm:mb-12 md:mb-14 lg:mb-16 reveal reveal-up px-5 sm:px-4 md:px-6 lg:px-[48px]">
            <p className="heading-industries-served text-xs sm:text-sm md:text-base mb-2 sm:mb-3 reveal-text delay-100">INDUSTRIES SERVED</p>
            <h3 className="heading-custom-solutions text-2xl sm:text-3xl md:text-4xl lg:text-5xl reveal-text delay-200">CUSTOM</h3>
            <h3 className="heading-custom-solutions-italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl reveal-text delay-300">ENGINEERING SOLUTIONS</h3>
          </div>

          {/* Content with dividers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-14 reveal reveal-right px-5 sm:px-4 md:px-6 lg:px-[48px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 reveal reveal-right">
              <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 mb-4 sm:mb-12 md:mb-16 reveal reveal-up delay-200">
                <div className="grid grid-cols-1">
                  {/* Top line */}
                  <div className="partners-desc-top-line mb-3 sm:mb-4 reveal-line delay-300"></div>
                  <p className="industries-served-desc text-sm sm:text-base md:text-lg leading-relaxed reveal-text delay-400">
                    Across industries and manufacturing sectors, we deliver custom-engineered solutions for performance and precision.
                  </p>
                </div>
              </div>
              <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 mb-4 sm:mb-12 md:mb-16 reveal reveal-up delay-300">
                <div className="grid grid-cols-1">
                  {/* Top line */}
                  <div className="partners-desc-top-line mb-3 sm:mb-4 reveal-line delay-400"></div>
                  <p className="industries-served-desc text-sm sm:text-base md:text-lg leading-relaxed reveal-text delay-500">
                    Our expertise in mold design, mold manufacture, injection molding material, injection molding and product assembly drives innovation in:
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Industry Carousel - Full Width */}
          <div className="relative reveal reveal-up mt-12 sm:mt-14 md:mt-16 w-full">
            <div
              ref={carouselRef}
              className={`industry-carousel-container ${isMobile ? 'industry-carousel-mobile' : 'industry-carousel-desktop'}`}
              style={{ scrollSnapType: isMobile ? 'x mandatory' : 'none' }}
              onMouseEnter={() => isMobile && setIsCarouselHovered(true)}
              onMouseLeave={() => isMobile && setIsCarouselHovered(false)}
              onMouseDown={(e) => {
                if (isMobile) {
                  dragStartRef.current = { x: e.clientX, y: e.clientY };
                  setIsDragging(false);
                }
              }}
              onMouseMove={(e) => {
                if (isMobile && (dragStartRef.current.x !== 0 || dragStartRef.current.y !== 0)) {
                  const deltaX = Math.abs(e.clientX - dragStartRef.current.x);
                  const deltaY = Math.abs(e.clientY - dragStartRef.current.y);
                  if (deltaX > 5 || deltaY > 5) {
                    setIsDragging(true);
                  }
                }
              }}
              onMouseUp={() => {
                if (isMobile) {
                  setTimeout(() => {
                    setIsDragging(false);
                    dragStartRef.current = { x: 0, y: 0 };
                  }, 0);
                }
              }}
              onTouchStart={(e) => {
                if (isMobile) {
                  const touch = e.touches[0];
                  dragStartRef.current = { x: touch.clientX, y: touch.clientY };
                  setIsDragging(false);
                }
              }}
              onTouchMove={(e) => {
                if (isMobile && (dragStartRef.current.x !== 0 || dragStartRef.current.y !== 0)) {
                  const touch = e.touches[0];
                  const deltaX = Math.abs(touch.clientX - dragStartRef.current.x);
                  const deltaY = Math.abs(touch.clientY - dragStartRef.current.y);
                  if (deltaX > 5 || deltaY > 5) {
                    setIsDragging(true);
                  }
                }
              }}
              onTouchEnd={() => {
                if (isMobile) {
                  setTimeout(() => {
                    setIsDragging(false);
                    dragStartRef.current = { x: 0, y: 0 };
                  }, 0);
                }
              }}
            >
              {/* Duplicate last item at the beginning for infinite scroll (mobile only) */}
              {isMobile && industries.slice(-3).map((industry, index) => (
                <Link
                  key={`clone-start-${index}`}
                  to={getIndustryUrl(industry.name)}
                  className="industry-carousel-card block cursor-pointer hover:opacity-95 transition-opacity duration-300"
                  style={{ scrollSnapAlign: 'start' }}
                  onClick={(e) => {
                    if (isDragging) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div className="industry-carousel-image">
                    <img
                      src={industry.image}
                      alt={industry.name}
                      className="w-full h-full object-cover reveal-image"
                      onError={(e) => {
                        e.target.src = '/assets/images/delivering-bg.jpg';
                      }}
                    />
                  </div>
                  <div className="industry-carousel-title">
                    <h4 className="industry-carousel-title-text">
                      {industry.name}
                    </h4>
                  </div>
                </Link>
              ))}

              {/* Original items */}
              {industries.map((industry, index) => (
                <Link
                  key={index}
                  to={getIndustryUrl(industry.name)}
                  className="industry-carousel-card block cursor-pointer hover:opacity-95 transition-opacity duration-300"
                  style={{ scrollSnapAlign: isMobile ? 'start' : 'none' }}
                  onClick={(e) => {
                    if (isMobile && isDragging) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div className="industry-carousel-image">
                    <img
                      src={industry.image}
                      alt={industry.name}
                      className="w-full h-full object-cover reveal-image"
                      onError={(e) => {
                        e.target.src = '/assets/images/delivering-bg.jpg';
                      }}
                    />
                  </div>
                  <div className="industry-carousel-title">
                    <h4 className="industry-carousel-title-text">
                      {industry.name}
                    </h4>
                  </div>
                </Link>
              ))}

              {/* Duplicate first items at the end for infinite scroll (mobile only) */}
              {isMobile && industries.slice(0, 3).map((industry, index) => (
                <Link
                  key={`clone-end-${index}`}
                  to={getIndustryUrl(industry.name)}
                  className="industry-carousel-card block cursor-pointer hover:opacity-95 transition-opacity duration-300"
                  style={{ scrollSnapAlign: 'start' }}
                  onClick={(e) => {
                    if (isDragging) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div className="industry-carousel-image">
                    <img
                      src={industry.image}
                      alt={industry.name}
                      className="w-full h-full object-cover reveal-image"
                      onError={(e) => {
                        e.target.src = '/assets/images/delivering-bg.jpg';
                      }}
                    />
                  </div>
                  <div className="industry-carousel-title">
                    <h4 className="industry-carousel-title-text">
                      {industry.name}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>

            {/* Navigation Arrows - Mobile only */}
            {isMobile && (
              <div className="absolute -top-12 sm:-top-16 md:-top-20 right-0 sm:right-4 flex gap-2 sm:gap-3 md:gap-4">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCarouselNavigation('prev');
                  }}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-transparent hover:bg-black/5 transition-colors flex items-center justify-center cursor-pointer"
                  aria-label="Previous"
                  type="button"
                >
                  <img src="/assets/icons/arrow-left.svg" alt="Back Arrow" className="w-full h-full" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCarouselNavigation('next');
                  }}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-transparent hover:bg-black/5 transition-colors flex items-center justify-center cursor-pointer"
                  aria-label="Next"
                  type="button"
                >
                  <img src="/assets/icons/arrow-right.svg" alt="Next Arrow" className="w-full h-full" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ISO Certifications Section */}
      <section className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[550px] sm:min-h-[600px] md:min-h-screen">
          {/* Left Side - Image with Overlay */}
          <div className="relative min-h-[550px] sm:min-h-[600px] md:h-auto overflow-hidden achieving-progress-left">
            <img
              src="/assets/images/iso-back.jpg"
              alt="Operation Room with doctors conducting surgery"
              className="absolute inset-0 w-full h-full object-cover reveal-image"
              style={{ objectPosition: '40.4% 39.6%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
            <div className="relative z-10 h-full flex flex-col justify-center items-center px-5 sm:px-4 md:px-6 lg:px-[48px] py-10 sm:py-14 md:py-16 lg:py-[120px]">
              <div className='iso-gallery-content mb-6 sm:mb-8 md:mb-12 text-center sm:text-left reveal reveal-up delay-200'>
                <h3 className='iso-gallery-title mb-3 sm:mb-4 reveal-text delay-300'>ACCREDITED QUALITY</h3>
                <p className='iso-gallery-description text-sm sm:text-base leading-relaxed reveal-text delay-400'>
                  Our commitment to quality is the foundation of our business. A dedicated team and process validations are backed up by an effective Quality Management Systems and certifications that include:
 </p>
              </div>
              
              <div className="iso-gallery w-full max-w-2xl mx-auto relative">
                {/* ISO Certifications Slider */}
                <div className="relative h-full">
                  {/* Current Slide Display */}
                  <div className="iso-slide-container mb-8">
                    <img
                      src={isoCertifications[isoSlide].image}
                      alt={isoCertifications[isoSlide].name}
                      className="w-full h-full max-w-full max-h-full object-contain mx-auto"
                    />
                  </div>

                  {/* Navigation Arrows - Right Side */}
                  <div className="achieving-progress-nav flex justify-end items-center gap-4" >
                    {/* Slide Counter */}
                    <div className="iso-slide-counter">
                      {String(isoSlide + 1).padStart(2, '0')} / {String(isoCertifications.length).padStart(2, '0')}
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsoSlide((prev) => (prev > 0 ? prev - 1 : isoCertifications.length - 1));
                      }}
                      className="achieving-progress-nav-button"
                      aria-label="Previous"
                      type="button"
                    >
                      <svg width="6" height="16" viewBox="0 0 6 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 0 8 L 6 16 L 6 0 Z" fill="rgb(255,255,255)" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsoSlide((prev) => (prev < isoCertifications.length - 1 ? prev + 1 : 0));
                      }}
                      className="achieving-progress-nav-button"
                      aria-label="Next"
                      type="button"
                    >
                      <svg width="6" height="16" viewBox="0 0 6 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 6 8 L 0 16 L 0 0 Z" fill="rgb(255,255,255)" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 self-start">
                <a
                  href="/quality"
                  className="inline-flex items-center gap-1.5 sm:gap-2 rounded-[4px] px-4 sm:px-4 md:px-5 py-2 sm:py-2 text-white border border-white/60 hover:bg-white/10 transition cta-motion"
                >
                  <span className="text-[11px] sm:text-xs md:text-[13px] font-semibold uppercase tracking-[0.25px]">Read More</span>
                  <img src="/assets/icons/arrow.svg" alt="" className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Slider */}
          <div className="achieving-progress-right relative min-h-[550px] sm:min-h-[600px] md:h-auto">
            <div className="h-full flex items-center justify-center px-5 sm:px-4 md:px-6 lg:px-[48px] py-10 sm:py-14 md:py-16 lg:py-[120px]">
              <div className="max-w-2xl w-full">
                
                {/* Slider Content */}
                <div className="achieving-progress-slider" ref={circularSliderRef}>
                  {/* Circular Image Slider with Content Below */}
                  <div key={currentSlide} className="relative">
                    {/* Heading First */}
                    <div className="mb-4 sm:mb-5 md:mb-6 reveal reveal-up delay-100">
                      <h3 className="achieving-progress-heading-title text-left mb-3 sm:mb-4 reveal-text delay-200">WHY OUR CUSTOMERS CHOOSE US</h3>
                    </div>

                    {/* Image Second */}
                    <div className="achieving-progress-image mt-0 sm:mt-4 md:mt-6 lg:mt-8 mb-4 sm:mb-6 md:mb-8 reveal reveal-scale delay-300">
                      <img
                        src={circularImages[currentSlide].image}
                        alt={circularImages[currentSlide].name}
                        className="w-full h-full rounded-full object-cover reveal-image"
                        key={`image-${currentSlide}`}
                      />
                    </div>
                    
                    {/* Content Below Image */}
                    <div className="achieving-progress-content-wrapper">
                      {/* Counter and Navigation Row */}
                      <div className="achieving-progress-counter-nav-wrapper flex items-center justify-between w-full mb-4 sm:mb-5 md:mb-6">
                        {/* Counter Third */}
                        <div className="achieving-progress-counter text-left text-sm sm:text-base">
                          <span className="text-white">0{currentSlide + 1}</span>
                          <span className="text-[#809298]"> / </span>
                          <span className="text-[#809298]">05</span>
                        </div>
                        
                        {/* Navigation Arrows */}
                        <div className="achieving-progress-nav flex gap-4">
                          <button
                            onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : 4))}
                            className="achieving-progress-nav-button"
                            aria-label="Previous"
                          >
                            <svg width="6" height="16" viewBox="0 0 6 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M 0 8 L 6 16 L 6 0 Z" fill="rgb(255,255,255)" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setCurrentSlide((prev) => (prev < 4 ? prev + 1 : 0))}
                            className="achieving-progress-nav-button"
                            aria-label="Next"
                          >
                            <svg width="6" height="16" viewBox="0 0 6 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M 6 8 L 0 16 L 0 0 Z" fill="rgb(255,255,255)" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Heading and Description Fourth and Fifth */}
                      <div className="achieving-progress-headings reveal reveal-up delay-400" key={`content-${currentSlide}`}>
                        <h4 className="achieving-progress-heading-main mb-2 sm:mb-3 reveal-text delay-500">{circularImages[currentSlide].heading}</h4>
                        <p className="achieving-progress-disc text-sm sm:text-base leading-relaxed reveal-text delay-600">{circularImages[currentSlide].description}</p>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 self-start">
                <a
                  href="/about-us"
                  className="inline-flex items-center gap-1.5 sm:gap-2 rounded-[4px] px-4 sm:px-4 md:px-5 py-2 sm:py-2 text-white border border-white/60 hover:bg-white/10 transition cta-motion"
                >
                  <span className="text-[11px] sm:text-xs md:text-[13px] font-semibold uppercase tracking-[0.25px]">Read More</span>
                  <img src="/assets/icons/arrow.svg" alt="" className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </a>
              </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Come to Meet Section */}
      <section
        className="relative py-16 sm:py-20 md:py-28 lg:py-36 xl:py-40 px-5 sm:px-4 md:px-6 lg:px-[48px] overflow-hidden"
        style={{ background: 'linear-gradient(59deg, #e0e8eb 0%, #fff 100%)' }}
      >
        {/* Decorative component shape */}
        <img
          src="/assets/images/industies-served-1.svg"
          alt=""
          className="absolute top-0 right-0 w-[300px] sm:w-[400px] md:w-[509px] h-[280px] sm:h-[350px] md:h-[472px] hidden sm:block opacity-100 z-0"
        />

        <div className="relative z-10 max-w-[1600px] mx-auto px-5 sm:px-4 md:px-6 lg:px-[48px]">
          <div className="come-to-meet-heading mb-6 sm:mb-8 md:mb-10 space-y-2 sm:space-y-3 reveal reveal-up delay-100">
          <h3 className="come-to-meet-heading-text text-lg sm:text-xl md:text-2xl lg:text-3xl reveal-text delay-200">The latest NEWS from LAXMI</h3>
            <h3 className="come-to-meet-heading-text text-lg sm:text-xl md:text-2xl lg:text-3xl reveal-text delay-300">We are coming to meet you.</h3>
             <h3 className="come-to-meet-heading-text1 text-base sm:text-lg md:text-xl lg:text-2xl reveal-text delay-400">We will be at:</h3>
          </div>
          <Link to="/events?event=1" className="come-to-meet-image block cursor-pointer hover:opacity-90 transition-opacity duration-300 reveal reveal-up delay-500">
            {/* Mobile and Tablet Image */}
            <img
              src="/assets/images/Event-Banners-mobile.jpg"
              alt="Come to Meet"
              className="w-full h-auto object-cover md:hidden"
            />
            {/* Desktop Image */}
            <img
              src="/assets/images/Event-Banners-Desktop.jpg"
              alt="Come to Meet"
              className="hidden md:block w-full h-auto object-cover"
            />
          </Link>
        </div>
      </section>



      {/* Request a Quote Section */}
      <section className="partners-section py-16 sm:py-20 md:py-28 lg:py-36 xl:py-40 px-5 sm:px-4 md:px-6 lg:px-[48px] reveal reveal-up">
        {/* Decorative shapes */}
        <img
          src="/assets/images/cylinder-shape.svg"
          alt=""
          className="partners-cylinder-shape hidden md:block"
        />
        <img
          src="/assets/images/component-shape.svg"
          alt=""
          className="partners-component-shape hidden md:block"
        />

        <div className="relative z-10 max-w-[1600px] mx-auto px-5 sm:px-4 md:px-6 lg:px-[48px] pb-10 sm:pb-14 md:pb-18 lg:pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-14 xl:gap-16">

            <div className="reveal reveal-left flex flex-col justify-center space-y-4 sm:space-y-5 md:space-y-6">
              <h3 className="heading-partners mb-3 sm:mb-4 reveal-text delay-100">Request a Quote</h3>
              <p className="text-sm sm:text-base leading-relaxed reveal-text delay-200">If you would like to make a request for a quote for the manufacture of a mold or components – fill
                out the form below and we will be in touch as soon as possible.</p>

              <p className="text-sm sm:text-base leading-relaxed reveal-text delay-300">Please give us as much information as possible about the application of the product you need.</p>

              <p className="text-sm sm:text-base leading-relaxed reveal-text delay-400">We may have questions to ask during the process. </p>

            </div>
            <div className='form-section'>
              <form
                className="quote-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  
                  if (!validateForm()) {
                    return;
                  }

                  setIsSubmitting(true);

                  try {
                    // Send email notifications to admin and customer
                    // Send email notifications to admin and customer
                    const emailResult = await sendEmailNotifications();
                    
                    // Always show success message regardless of warnings
                    setIsSubmitted(true);
                    setIsSubmitting(false);

                    // Keep the form read-only after success (prevents multiple submissions)
                    setSuccessTitle('Thank You!');
                    setSuccessMessage('Thank you! Your form has been submitted successfully. We will be in touch soon.');
                    setShowSuccessModal(true);
                    
                    // Reset form fields after successful submission
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      message: ''
                    });
                    setFormErrors({});
                    
                    // Log warnings to console but don't show to user
                    
                    // Only throw error if there's a critical failure (not just warnings)
                    if (emailResult && emailResult.error && !emailResult.success && !emailResult.warning) {
                      throw new Error(emailResult.error);
                    }
                  } catch (error) {
                    setIsSubmitting(false);
                    const errorMessage = error.message || 'Unknown error occurred';
                    setSuccessTitle('Submission Error');
                    setSuccessMessage(`Form Submission Error:\n\n${errorMessage}\n\nPlease check:\n1. Backend server is running\n2. Internet connection is active\n3. Try again in a moment`);
                    setShowSuccessModal(true);
                  }
                }}
              >
                
                <div className="form-description mb-6">
                  <p>Fill all information details to consult with us to get services from us.</p>
                </div>
                <p className="quote-form-mandatory-note">* Fields are mandatory</p>
                <div className="form-field-container space-y-4">
                  {/* Name and Phone on same line */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {/* Your Name */}
                    <div className="form-field">
                      <label htmlFor="quote-name" className="form-label-hidden">
                        Your Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="quote-name"
                        className={`form-input form-input-large ${formErrors.name ? 'error' : ''}`}
                        name="name"
                        placeholder="Your Name *"
                        value={formData.name}
                        onChange={handleNameChange}
                        maxLength={50}
                        disabled={isSubmitting || isSubmitted}
                        required
                      />
                      {formErrors.name && (
                        <span style={{ color: '#ff0000', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                          {formErrors.name}
                        </span>
                      )}
                    </div>

                    {/* Your Phone Number */}
                    <div className="form-field">
                      <label htmlFor="quote-phone" className="form-label-hidden">
                        Your Phone Number <span className="required">*</span>
                      </label>
                      <input
                        type="tel"
                        id="quote-phone"
                        className={`form-input form-input-large ${formErrors.phone ? 'error' : ''}`}
                        name="phone"
                        placeholder="Your Phone Number *"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        maxLength={20}
                        disabled={isSubmitting || isSubmitted}
                        required
                      />
                      {formErrors.phone && (
                        <span style={{ color: '#ff0000', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                          {formErrors.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Your Email */}
                  <div className="form-field">
                    <label htmlFor="quote-email" className="form-label-hidden">
                      Your Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="quote-email"
                      className={`form-input form-input-large ${formErrors.email ? 'error' : ''}`}
                      name="email"
                      placeholder="Your Email *"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isSubmitting || isSubmitted}
                      required
                    />
                    {formErrors.email && (
                      <span style={{ color: '#ff0000', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                        {formErrors.email}
                      </span>
                    )}
                  </div>

                  {/* How may we help you? */}
                  <div className="form-field">
                    <textarea
                      id="quote-message"
                      className={`form-textarea form-input-large ${formErrors.message ? 'error' : ''}`}
                      name="message"
                      placeholder="How may we help you? *"
                      rows={5}
                      value={formData.message}
                      onChange={handleMessageChange}
                      maxLength={500}
                      disabled={isSubmitting || isSubmitted}
                      required
                    ></textarea>
                    {formErrors.message && (
                      <span style={{ color: '#ff0000', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                        {formErrors.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-submit-container mt-6">
                  <button
                    type="submit"
                    className="form-submit-button"
                    disabled={isSubmitting || isSubmitted}
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="btn-spinner" aria-hidden="true"></span>
                        Sending...
                      </span>
                    ) : isSubmitted ? 'Submitted!' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>



        </div>
      </section>

      {/* Video Modal */}
      {videoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 transition-opacity" onClick={closeVideo} />
          <div className="relative z-10 w-[95%] sm:w-[96%] max-w-6xl aspect-video bg-black rounded-md overflow-hidden shadow-2xl transform transition duration-300 ease-out scale-100">
            <button
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center bg-black/70 hover:bg-black/90 rounded-full text-white transition-all duration-200 hover:scale-110"
              onClick={closeVideo}
              aria-label="Close video"
              type="button"
            >
              <svg
                className="w-4 h-4 sm:w-7 sm:h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <video
              ref={modalVideoRef}
              src="/assets/videos/Medical.mp4"
              className="w-full h-full"
              controls
              autoPlay
              muted
              playsInline
            />
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          setIsSubmitted(false); // Re-enable form fields when modal is closed
        }}
        message={successMessage}
        title={successTitle}
      />
    </div>
  );
};

export default Home;


