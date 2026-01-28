import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SuccessModal from '../components/SuccessModal';
import { executeRecaptcha } from '../utils/recaptcha';

const Quality = () => {
  const fadeInRefs = useRef([]);
  const slideUpRefs = useRef([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    organisationName: '',
    city: '',
    state: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successTitle, setSuccessTitle] = useState('Thank You!');

  // PDF file mapping for each certification
  const certPdfMap = {
    'iso-9001': '/assets/certifications/ISO-9001-2015_TUV-certificate.pdf',
    'iso-13485': '/assets/certifications/ISO_13485-2016_certificate_LAXMI.pdf',
    'as-9100': '/assets/certifications/AS-9100-D-certificate_LAXMI.pdf',
    'ul': '/assets/certifications/UL-Tracebility-certificate.pdf',
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
    
    // Organisation Name validation
    if (!formData.organisationName.trim()) {
      errors.organisationName = 'Organisation Name is required';
    } else if (formData.organisationName.length > 150) {
      errors.organisationName = 'Organisation Name must not exceed 150 characters';
    } else if (/[<>*=;~]/.test(formData.organisationName)) {
      errors.organisationName = 'Characters <, >, *, =, ;, ~ are not allowed';
    }
    
    // City validation
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    } else if (!/^[A-Za-z\s]{2,50}$/.test(formData.city.trim())) {
      errors.city = 'City must be 2-50 characters and contain only letters and spaces';
    }
    
    // State validation
    if (!formData.state.trim()) {
      errors.state = 'State is required';
    } else if (!/^[A-Za-z\s]{2,50}$/.test(formData.state.trim())) {
      errors.state = 'State must be 2-50 characters and contain only letters and spaces';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

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

  // Handle organisation name input with validation (max 150 chars, block vulnerable characters)
  const handleOrganisationNameChange = (e) => {
    let value = e.target.value;
    // Block vulnerable characters: <, >, *, =, ;, ~
    value = value.replace(/[<>*=;~]/g, '');
    // Limit to 150 characters
    value = value.slice(0, 150);
    setFormData(prev => ({
      ...prev,
      organisationName: value
    }));
    // Clear error when user starts typing
    if (formErrors.organisationName) {
      setFormErrors(prev => ({
        ...prev,
        organisationName: ''
      }));
    }
  };

  // Handle city input with validation (only letters and spaces, max 50 chars)
  const handleCityChange = (e) => {
    let value = e.target.value;
    // Only allow letters and spaces
    value = value.replace(/[^A-Za-z\s]/g, '');
    // Limit to 50 characters
    value = value.slice(0, 50);
    setFormData(prev => ({
      ...prev,
      city: value
    }));
    // Clear error when user starts typing
    if (formErrors.city) {
      setFormErrors(prev => ({
        ...prev,
        city: ''
      }));
    }
  };

  // Handle state input with validation (only letters and spaces, max 50 chars)
  const handleStateChange = (e) => {
    let value = e.target.value;
    // Only allow letters and spaces
    value = value.replace(/[^A-Za-z\s]/g, '');
    // Limit to 50 characters
    value = value.slice(0, 50);
    setFormData(prev => ({
      ...prev,
      state: value
    }));
    // Clear error when user starts typing
    if (formErrors.state) {
      setFormErrors(prev => ({
        ...prev,
        state: ''
      }));
    }
  };

  // Get certification title
  const getCertTitle = () => {
    const titles = {
      'iso-9001': 'ISO 9001:2015',
      'iso-13485': 'ISO 13485:2016',
      'as-9100': 'AS 9100 D',
      'ul': 'UL Traceability File# 251071',
    };
    return titles[selectedCert] || 'Certification';
  };

  // Download PDF function
  const downloadCertificationPDF = () => {
    if (selectedCert && certPdfMap[selectedCert]) {
      const link = document.createElement('a');
      link.href = certPdfMap[selectedCert];
      link.download = certPdfMap[selectedCert].split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Send email notifications
  // Option 1: Using Backend API (Current Implementation)
  // Option 2: Using EmailJS (Uncomment and install: npm install @emailjs/browser)
  //          Then initialize: emailjs.init("YOUR_PUBLIC_KEY")
  const sendEmailNotifications = async () => {
    // Note: Admin email is automatically set from ADMIN_EMAIL in .env file by the server
    const adminEmail = 'marketing@laxmielectronics.com'; // Server uses ADMIN_EMAIL from .env
    const customerEmail = formData.email;
    const certTitle = getCertTitle();

    // Email data for admin notification
    const adminEmailData = {
      to: adminEmail,
      subject: `Notification: ISO Certificate Form Submitted & Downloaded: ${certTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #08222B;">New Certification Request</h2>
          <p>A new certification request has been submitted for <strong>${certTitle}</strong>.</p>
          <h3 style="color: #08222B; margin-top: 24px;">Customer Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Name</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Email</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Phone</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Organisation</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.organisationName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>City</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.city}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>State</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.state}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Certification</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${certTitle}</td>
            </tr>
          </table>
          <p style="margin-top: 24px; color: #666;">This is an automated notification from the Laxmi Electronics website.</p>
        </div>
      `,
    };

    // Email data for customer confirmation
    const customerEmailData = {
      to: customerEmail,
      subject: `Thank you for your interest in ${certTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #08222B;">Thank You for Your Request</h2>
          <p>Dear ${formData.name},</p>
          <p>Thank you for your interest in <strong>${certTitle}</strong> certification from Laxmi Electronics.</p>
          <p>We have received your request and will process it shortly. The certification PDF has been made available for download.</p>
          <h3 style="color: #08222B; margin-top: 24px;">Your Request Details:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Certification:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${certTitle}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Organisation:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.organisationName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Location:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.city}, ${formData.state}</td>
            </tr>
          </table>
          <p style="margin-top: 24px;">If you have any questions, please feel free to contact us at <a href="mailto:marketing@laxmielectronics.com" style="color: #08222B;">marketing@laxmielectronics.com</a>.</p>
          <p style="margin-top: 16px;">Best regards,<br><strong>Laxmi Electronics Team</strong></p>
        </div>
      `,
    };

    try {
      const recaptchaToken = await executeRecaptcha('certification_request');
      // Call API endpoint to send emails
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminEmail: adminEmailData,
          customerEmail: customerEmailData,
          formData: {
            ...formData,
            certification_type: selectedCert
          },
          formType: 'certification',
          recaptchaToken,
          recaptchaAction: 'certification_request',
        }),
      }).catch((fetchError) => {
        throw new Error(`Cannot connect to server. Please make sure the backend server is running on port 3001. Error: ${fetchError.message}`);
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        throw new Error(`API endpoint returned HTML instead of JSON. The /api/send-email route may not exist. Status: ${response.status}`);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      // Don't throw error - allow form submission to succeed even if email fails
      // You can optionally show a warning to the user
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Send email notifications to admin and customer
      const emailResult = await sendEmailNotifications();
      
      // On successful submission (even if email failed due to SMTP config)
      setIsSubmitted(true);
      setIsSubmitting(false);
      
      // Reset form fields after successful submission
      setFormData({
        name: '',
        phone: '',
        email: '',
        organisationName: '',
        city: '',
        state: '',
      });
      setFormErrors({});
      
      // Download PDF after successful submission
      downloadCertificationPDF();
      
      // Close the certification modal and show success message inside it
      // No need to show separate SuccessModal - the success message is already in the modal
    } catch (error) {
      setIsSubmitting(false);
      setSuccessTitle('Submission Error');
      setSuccessMessage(`There was an error submitting your form: ${error.message || 'Please try again or contact us directly at marketing@laxmielectronics.com'}`);
      setShowSuccessModal(true);
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setIsSubmitted(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      organisationName: '',
      city: '',
      state: '',
    });
    setFormErrors({});
  };

  useEffect(() => {
    // Fade in animation observer
    const fadeInObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    fadeInRefs.current.forEach((ref) => {
      if (ref) fadeInObserver.observe(ref);
    });

    // Slide up animation observer
    const slideUpObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    slideUpRefs.current.forEach((ref) => {
      if (ref) slideUpObserver.observe(ref);
    });

    return () => {
      fadeInRefs.current.forEach((ref) => {
        if (ref) fadeInObserver.unobserve(ref);
      });
      slideUpRefs.current.forEach((ref) => {
        if (ref) slideUpObserver.unobserve(ref);
      });
    };
  }, []);

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isModalOpen]);

  const certifications = [
    {
      id: 1,
      title: 'ISO',
      subtitle: '9001:2015',
      certKey: 'iso-9001'
    },
    {
      id: 2,
      title: 'ISO',
      subtitle: '13485:2016',
      certKey: 'iso-13485'
    },
    {
      id: 3,
      title: 'AS',
      subtitle: '9100 D',
      certKey: 'as-9100'
    },
    {
      id: 4,
      title: 'UL',
      subtitle: 'Traceability\nFile# 251071',
      certKey: 'ul'
    }
  ];

  const qualityFeatures = [
    {
      id: 1,
      title: 'Process control',
      description: 'Laxmi achieves process control through adherence to robust tooling standards, rigorous IQ/OQ/PQ validations, and an industry-leading approach to scientific molding (GW/SM™). Extensive automation further drives our processes to achieve Six Sigma quality levels.',
      icon: 'process'
    },
    {
      id: 2,
      title: 'Global Standardization',
      description: 'Laxmi has implemented a comprehensive plant and equipment standardization program to help reduce process variation and improve quality.',
      icon: 'global'
    },
    {
      id: 3,
      title: 'Investment in technology',
      description: 'As a privately held company, Laxmi manages its business for the long-term and has consistently invested in quality-critical technology to improve process stability and quality.',
      icon: 'technology'
    },
    {
      id: 4,
      title: 'Workforce training & development',
      description: 'Laxmi invests heavily in training with a focus on quality to ensure its associates are trained in the latest technology, customer requirements and manufacturing techniques.',
      icon: 'training'
    }
  ];

  const renderIcon = (iconType) => {
    const containerClass = "w-20 h-20 md:w-24 md:h-24 bg-[#08222B] rounded-full flex items-center justify-center mx-auto transition-all duration-300 hover:bg-[#0a2d38] hover:scale-110";
    const iconClass = "w-10 h-10 md:w-12 md:h-12 text-white";
    
    switch (iconType) {
      case 'process':
        return (
          <div className={containerClass}>
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        );
      case 'global':
        return (
          <div className={containerClass}>
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'technology':
        return (
          <div className={containerClass}>
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        );
      case 'training':
        return (
          <div className={containerClass}>
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden reveal reveal-up">
        {/* Background Image */}
        <div className="absolute inset-0 rounded-none">
          <img
            src="/assets/images/quality-banner.jpg"
            alt="Quality Banner"
            className="block w-full h-full object-cover object-center reveal-image"
          />
        </div>

        {/* Overlay */}
        <div className="about-us-hero-overlay"></div>

        {/* Content Container */}
        <div className="absolute z-20 w-full bottom-0 left-0 right-0 pt-12 md:pt-16 lg:pt-20 xl-1300:pt-16 2xl:pt-24 pb-12 md:pb-16 lg:pb-16 xl-1300:pb-12 2xl:pb-20">
          <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-[48px] xl-1300:px-[40px] 2xl:px-[48px]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 xl-1300:gap-8 2xl:gap-12 items-end">
              {/* Left Side - Title Section */}
              <div className="flex flex-col items-start justify-end reveal reveal-up delay-100">
                <h2 className="about-us-hero-title text-white mb-4 whitespace-normal sm:whitespace-nowrap reveal-text delay-200">
                  Our<br />Commitment to
                </h2>
                <h2 className="about-us-hero-subtitle text-white whitespace-normal sm:whitespace-nowrap reveal-text delay-300">
                  Quality
                </h2>
              </div>
              <div></div>

              {/* Right Side - Description Section */}
              <div className="flex flex-col justify-end reveal reveal-left delay-200">
                {/* Divider Line */}
                <div className="mb-6 flex justify-start">
                  <div className="h-px w-20 bg-[#9CAEAF] reveal-line delay-300"></div>
                </div>

                {/* Description Text */}
                <div className="max-w-md">
                  <p className="about-us-hero-description reveal-text delay-400">
                    Proactive quality management through dedicated Quality Assurance teams, rigorous testing, and comprehensive certifications that ensure excellence in every product we deliver.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-[48px] bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-stretch">
            {/* Left Side - Image */}
            <div
              className="about-us-fade-in"
              ref={(el) => (fadeInRefs.current[2] = el)}
            >
              <div className="relative about-img-box h-full">
                <img
                  decoding="async"
                  src="/assets/images/Quality.jpg"
                  alt="Quality Management"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/assets/images/about-us-banner.jpg';
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#08222B] via-[#08222B]/90 to-transparent p-4 sm:p-5 md:p-6 lg:p-8 z-10">
                  <span className="text-xs sm:text-sm md:text-base text-white uppercase tracking-wider mb-2 md:mb-3 block font-medium opacity-90">
                    Our Story
                  </span>
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-white leading-tight">
                    Translating principles into practices
                  </h3>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div
              className="about-content about-us-slide-up flex flex-col justify-center h-full"
              ref={(el) => (slideUpRefs.current[0] = el)}
            >
              <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-[#08222B] mb-4 md:mb-6">
                Proactive quality management
              </h3>
              <p className="text-[#08222B] text-sm sm:text-base md:text-lg leading-relaxed mb-4 md:mb-6">
                At Laxmi, we have a dedicated Quality Assurance team specializing in quality control using tools like FMEA, PFMEA, PPAP, etc. Our quality ratings are sustained through the implementation of a rigorous quality control system. The QA team is involved at the beginning of every project along with the engineering team to identify challenges that could come up during manufacturing and production and address the same at the design stage. Part quality is carefully verified through in-process inspection plans where parts are constantly monitored for defects, damage, or any other inconsistencies. Every product packaged can then be traced back to the date the part was produced, the processes performed, and the materials employed.
              </p>
              <p className="text-[#08222B] text-sm sm:text-base md:text-lg leading-relaxed">
                Components undergo stringent testing and evaluation for purity and part quality as specified by our customers. For our medical device customers, we provide a clean room molding facility that is Class 8 certified.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Accredited Quality Section */}
      <section className="about-us-vision-section">
        <div className="about-us-vision-container">
          <div className="about-us-vision-content">
            <div className="about-us-vision-title">
              <h3>Accredited Quality</h3>
            </div>
            <div className="about-us-vision-description">
              <p>Since 1983, Laxmi has added to its portfolio of capabilities focusing on being the one-stop for precision thermoplastic molding. Our facilities, machining infrastructure, technology, quality processes and human resources have been augmented to meet customer needs in thermoplastic injection molding.</p>
            </div>
          </div>
          <div className="about-us-vision-divider">
            <div className="about-us-vision-line"></div>
          </div>
          <div className="iso-certifications-container">
            <div className="iso-certifications-grid">
              {certifications.map((cert, index) => (
                <div
                  key={cert.id}
                  className="iso-cert-badge about-us-slide-up cursor-pointer"
                  ref={(el) => (slideUpRefs.current[index + 1] = el)}
                  onClick={() => {
                    setSelectedCert(cert.certKey);
                    setIsModalOpen(true);
                    setIsSubmitted(false);
                  }}
                >
                  <div className="iso-cert-badge-content">
                    <h3 className="iso-cert-title">{cert.title}</h3>
                    <p className="iso-cert-subtitle whitespace-pre-line">{cert.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quality Features Grid Section */}
      <section className="relative w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-[48px] bg-gradient-to-b from-white to-gray-50">
        <div className="elementor-background-overlay"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-gray-200">
            {qualityFeatures.map((feature, index) => (
              <div
                key={feature.id}
                className="bg-white border-r border-b border-gray-200 last:border-r-0 sm:last:border-r sm:even:border-r lg:last:border-r-0 lg:border-r lg:last:border-r p-4 sm:p-5 md:p-6 lg:p-8 transform transition-all duration-300 hover:shadow-lg hover:bg-gray-50 about-us-slide-up qult-sect-box"
                ref={(el) => (slideUpRefs.current[index + 5] = el)}
              >
                <div className="elementor-image-box-wrapper">
                  <figure className="elementor-image-box-img mb-4 flex items-center justify-center">
                    {renderIcon(feature.icon)}
                  </figure>
                  <div className="elementor-image-box-content">
                    <h4 className="elementor-image-box-title text-xl md:text-2xl font-semibold text-[#08222B] mb-4">
                      {feature.title}
                    </h4>
                    <p className="elementor-image-box-description text-gray-700 text-sm md:text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification Modal */}
      {isModalOpen && (
        <div className="cert-modal-overlay" onClick={closeModal}>
          <div className="cert-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="cert-modal-close" onClick={closeModal} aria-label="Close modal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="cert-modal-content">
              {!isSubmitted ? (
                <>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#08222B] mb-2 md:mb-4 text-center" style={{ 
                    fontFamily: '"Satoshi", "Satoshi Placeholder", sans-serif',
                  }}>
                    {getCertTitle()}
                  </h2>
                  <p style={{ 
                    textAlign: 'right',
                    marginBottom: '24px',
                    fontFamily: '"Manrope", "Manrope Placeholder", sans-serif',
                    fontSize: '14px',
                    color: '#08222B'
                  }}>
                    <span style={{ color: '#ff0000', fontWeight: 'bold' }}>*</span> Fields are mandatory
                  </p>

                  <form className="cert-form" onSubmit={handleSubmit}>
                    <div className="cert-form-row">
                      <div className="cert-form-field cert-form-field-half">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className={`cert-form-input ${formErrors.name ? 'error' : ''}`}
                          placeholder="Name *"
                          value={formData.name}
                          onChange={handleNameChange}
                          maxLength={50}
                          disabled={isSubmitting || isSubmitted}
                          required
                        />
                        {formErrors.name && (
                          <span className="cert-form-error">{formErrors.name}</span>
                        )}
                      </div>

                      <div className="cert-form-field cert-form-field-half">
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className={`cert-form-input ${formErrors.phone ? 'error' : ''}`}
                          placeholder="Phone Number *"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          maxLength={20}
                          disabled={isSubmitting || isSubmitted}
                          required
                        />
                        {formErrors.phone && (
                          <span className="cert-form-error">{formErrors.phone}</span>
                        )}
                      </div>
                    </div>

                    <div className="cert-form-row">
                      <div className="cert-form-field cert-form-field-half">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className={`cert-form-input ${formErrors.email ? 'error' : ''}`}
                          placeholder="Email Id *"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={isSubmitting || isSubmitted}
                          required
                        />
                        {formErrors.email && (
                          <span className="cert-form-error">{formErrors.email}</span>
                        )}
                      </div>

                      <div className="cert-form-field cert-form-field-half">
                        <input
                          type="text"
                          id="organisationName"
                          name="organisationName"
                          className={`cert-form-input ${formErrors.organisationName ? 'error' : ''}`}
                          placeholder="Organisation Name *"
                          value={formData.organisationName}
                          onChange={handleOrganisationNameChange}
                          maxLength={150}
                          disabled={isSubmitting || isSubmitted}
                          required
                        />
                        {formErrors.organisationName && (
                          <span className="cert-form-error">{formErrors.organisationName}</span>
                        )}
                      </div>
                    </div>

                    <div className="cert-form-row">
                      <div className="cert-form-field cert-form-field-half">
                        <input
                          type="text"
                          id="city"
                          name="city"
                          className={`cert-form-input ${formErrors.city ? 'error' : ''}`}
                          placeholder="City *"
                          value={formData.city}
                          onChange={handleCityChange}
                          maxLength={50}
                          disabled={isSubmitting || isSubmitted}
                          required
                        />
                        {formErrors.city && (
                          <span className="cert-form-error">{formErrors.city}</span>
                        )}
                      </div>

                      <div className="cert-form-field cert-form-field-half">
                        <input
                          type="text"
                          id="state"
                          name="state"
                          className={`cert-form-input ${formErrors.state ? 'error' : ''}`}
                          placeholder="State *"
                          value={formData.state}
                          onChange={handleStateChange}
                          maxLength={50}
                          disabled={isSubmitting || isSubmitted}
                          required
                        />
                        {formErrors.state && (
                          <span className="cert-form-error">{formErrors.state}</span>
                        )}
                      </div>
                    </div>

                    <div className="cert-form-submit-container">
                      <button
                        type="submit"
                        className="cert-form-submit"
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
                </>
              ) : (
                <div className="cert-form-success">
                  <h3>Thank You!</h3>
                  <p>Your form has been submitted successfully. The certification PDF should start downloading automatically.</p>
                  <button
                    className="cert-form-submit"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Modal - Only shown for errors, not for successful submissions */}
      {/* Successful submissions show the success message inside the certification modal */}
      {showSuccessModal && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            closeModal(); // Also close the certification modal if it's open
          }}
          message={successMessage}
          title={successTitle}
        />
      )}
    </div>
  );
};

export default Quality;

