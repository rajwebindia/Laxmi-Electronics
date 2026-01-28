import { useState, useEffect, useRef } from 'react';
import SuccessModal from '../components/SuccessModal';
import { executeRecaptcha } from '../utils/recaptcha';

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

// Helper function to escape HTML for all text fields
const escapeHtml = (text) => {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const ContactUs = () => {
  const fadeInRefs = useRef([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile_number: '',
    email: '',
    organisation_name: '',
    street_address: '',
    city: '',
    state: '',
    requirement: '',
    estimated_volume: '',
    order_release_date: '',
    cad_file: null,
    rfq_file: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successTitle, setSuccessTitle] = useState('Thank You!');

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

    return () => {
      fadeInRefs.current.forEach((ref) => {
        if (ref) fadeInObserver.unobserve(ref);
      });
    };
  }, []);

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

  // Handle first name input with validation (alphabets, spaces, and dots only, max 50 chars)
  const handleFirstNameChange = (e) => {
    const value = e.target.value;
    // Only allow alphabets, spaces, and dots
    const filteredValue = value.replace(/[^a-zA-Z\s.]/g, '').slice(0, 50);
    setFormData(prev => ({
      ...prev,
      first_name: filteredValue
    }));
    // Clear error when user starts typing
    if (formErrors.first_name) {
      setFormErrors(prev => ({
        ...prev,
        first_name: ''
      }));
    }
  };

  // Handle last name input with validation (alphabets, spaces, and dots only, max 50 chars)
  const handleLastNameChange = (e) => {
    const value = e.target.value;
    // Only allow alphabets, spaces, and dots
    const filteredValue = value.replace(/[^a-zA-Z\s.]/g, '').slice(0, 50);
    setFormData(prev => ({
      ...prev,
      last_name: filteredValue
    }));
    // Clear error when user starts typing
    if (formErrors.last_name) {
      setFormErrors(prev => ({
        ...prev,
        last_name: ''
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
      mobile_number: value
    }));
    // Clear error when user starts typing
    if (formErrors.mobile_number) {
      setFormErrors(prev => ({
        ...prev,
        mobile_number: ''
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
      organisation_name: value
    }));
    // Clear error when user starts typing
    if (formErrors.organisation_name) {
      setFormErrors(prev => ({
        ...prev,
        organisation_name: ''
      }));
    }
  };

  // Handle street address input with validation (max 150 chars, block vulnerable characters)
  const handleStreetAddressChange = (e) => {
    let value = e.target.value;
    // Block vulnerable characters: <, >, *, =, ;, ~
    value = value.replace(/[<>*=;~]/g, '');
    // Limit to 150 characters
    value = value.slice(0, 150);
    setFormData(prev => ({
      ...prev,
      street_address: value
    }));
    // Clear error when user starts typing
    if (formErrors.street_address) {
      setFormErrors(prev => ({
        ...prev,
        street_address: ''
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

  // Handle requirement textarea with validation (max 500 chars, allow newlines, block vulnerable characters)
  const handleRequirementChange = (e) => {
    let value = e.target.value;
    // Block vulnerable characters: <, >, *, =, ;, ~
    value = value.replace(/[<>*=;~]/g, '');
    // Limit to 500 characters
    value = value.slice(0, 500);
    setFormData(prev => ({
      ...prev,
      requirement: value
    }));
    // Clear error when user starts typing
    if (formErrors.requirement) {
      setFormErrors(prev => ({
        ...prev,
        requirement: ''
      }));
    }
  };

  // Handle estimated volume textarea with validation (max 500 chars, allow newlines, block vulnerable characters)
  const handleEstimatedVolumeChange = (e) => {
    let value = e.target.value;
    // Block vulnerable characters: <, >, *, =, ;, ~
    value = value.replace(/[<>*=;~]/g, '');
    // Limit to 500 characters
    value = value.slice(0, 500);
    setFormData(prev => ({
      ...prev,
      estimated_volume: value
    }));
    // Clear error when user starts typing
    if (formErrors.estimated_volume) {
      setFormErrors(prev => ({
        ...prev,
        estimated_volume: ''
      }));
    }
  };

  // Handle order release date textarea with validation (max 500 chars, allow newlines, block vulnerable characters)
  const handleOrderReleaseDateChange = (e) => {
    let value = e.target.value;
    // Block vulnerable characters: <, >, *, =, ;, ~
    value = value.replace(/[<>*=;~]/g, '');
    // Limit to 500 characters
    value = value.slice(0, 500);
    setFormData(prev => ({
      ...prev,
      order_release_date: value
    }));
    // Clear error when user starts typing
    if (formErrors.order_release_date) {
      setFormErrors(prev => ({
        ...prev,
        order_release_date: ''
      }));
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0] || null
    }));
    // Clear error when file is selected
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle CAD file upload with validation (MIME types and 5MB limit)
  const handleCadFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setFormData(prev => ({
        ...prev,
        cad_file: null
      }));
      if (formErrors.cad_file) {
        setFormErrors(prev => ({
          ...prev,
          cad_file: ''
        }));
      }
      return;
    }

    // Allowed MIME types
    const allowedMimeTypes = [
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-powerpoint', // .ppt
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      'application/pdf', // .pdf
      'image/jpeg', // .jpg, .jpeg
      'image/png', // .png (sometimes jpg files have this)
      'application/acad', // .dwg
      'image/vnd.dwg', // .dwg
      'application/x-dwg', // .dwg
      'application/x-autocad' // .dwg
    ];

    // Allowed file extensions
    const allowedExtensions = ['.doc', '.docx', '.xl', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.jpg', '.jpeg', '.dwg'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    
    // Validate file
    if (!allowedExtensions.includes(fileExtension)) {
      setFormErrors(prev => ({
        ...prev,
        cad_file: `Invalid file type. Allowed types: doc, docx, xl, xls, ppt, pptx, pdf, jpg, dwg`
      }));
      e.target.value = ''; // Clear the input
      setFormData(prev => ({
        ...prev,
        cad_file: null
      }));
      return;
    }

    if (file.size > maxSize) {
      setFormErrors(prev => ({
        ...prev,
        cad_file: `File size exceeds 5MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)} MB`
      }));
      e.target.value = ''; // Clear the input
      setFormData(prev => ({
        ...prev,
        cad_file: null
      }));
      return;
    }

    // Check MIME type if available
    if (file.type && !allowedMimeTypes.includes(file.type)) {
      // Some browsers may not set MIME type correctly, so we'll rely on extension check
    }

    // File is valid
    setFormData(prev => ({
      ...prev,
      cad_file: file
    }));
    
    // Clear any previous errors
    if (formErrors.cad_file) {
      setFormErrors(prev => ({
        ...prev,
        cad_file: ''
      }));
    }
  };

  // Handle RFQ file upload with validation (MIME types and 5MB limit)
  const handleRfqFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setFormData(prev => ({
        ...prev,
        rfq_file: null
      }));
      if (formErrors.rfq_file) {
        setFormErrors(prev => ({
          ...prev,
          rfq_file: ''
        }));
      }
      return;
    }

    // Allowed MIME types
    const allowedMimeTypes = [
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/pdf' // .pdf
    ];

    // Allowed file extensions
    const allowedExtensions = ['.doc', '.docx', '.xl', '.xls', '.xlsx', '.pdf'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    
    // Validate file
    if (!allowedExtensions.includes(fileExtension)) {
      setFormErrors(prev => ({
        ...prev,
        rfq_file: `Invalid file type. Allowed types: doc, docx, xl, xls, pdf`
      }));
      e.target.value = ''; // Clear the input
      setFormData(prev => ({
        ...prev,
        rfq_file: null
      }));
      return;
    }

    if (file.size > maxSize) {
      setFormErrors(prev => ({
        ...prev,
        rfq_file: `File size exceeds 5MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)} MB`
      }));
      e.target.value = ''; // Clear the input
      setFormData(prev => ({
        ...prev,
        rfq_file: null
      }));
      return;
    }

    // Check MIME type if available
    if (file.type && !allowedMimeTypes.includes(file.type)) {
      // Some browsers may not set MIME type correctly, so we'll rely on extension check
    }

    // File is valid
    setFormData(prev => ({
      ...prev,
      rfq_file: file
    }));
    
    // Clear any previous errors
    if (formErrors.rfq_file) {
      setFormErrors(prev => ({
        ...prev,
        rfq_file: ''
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    // First Name validation
    if (!formData.first_name.trim()) {
      errors.first_name = 'First Name is required';
    } else if (formData.first_name.length > 50) {
      errors.first_name = 'First Name must not exceed 50 characters';
    } else if (!/^[a-zA-Z\s.]*$/.test(formData.first_name)) {
      errors.first_name = 'First Name can only contain alphabets, spaces, and dots';
    }
    
    // Last Name validation
    if (!formData.last_name.trim()) {
      errors.last_name = 'Last Name is required';
    } else if (formData.last_name.length > 50) {
      errors.last_name = 'Last Name must not exceed 50 characters';
    } else if (!/^[a-zA-Z\s.]*$/.test(formData.last_name)) {
      errors.last_name = 'Last Name can only contain alphabets, spaces, and dots';
    }
    
    // Phone validation (required field)
    if (!formData.mobile_number.trim()) {
      errors.mobile_number = 'Phone number is required';
    } else if (formData.mobile_number.length < 7) {
      errors.mobile_number = 'Phone number must be at least 7 characters';
    } else if (formData.mobile_number.length > 20) {
      errors.mobile_number = 'Phone number must not exceed 20 characters';
    } else if (!/^[0-9+\-() ]*$/.test(formData.mobile_number)) {
      errors.mobile_number = 'Phone number can only contain numbers (0-9), one space, plus sign (+), hyphen (-), and parentheses';
    } else {
      const spaceCount = (formData.mobile_number.match(/\s/g) || []).length;
      if (spaceCount > 1) {
        errors.mobile_number = 'Only one space is allowed in the phone number';
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
    if (!formData.organisation_name.trim()) {
      errors.organisation_name = 'Organisation Name is required';
    } else if (formData.organisation_name.length > 150) {
      errors.organisation_name = 'Organisation Name must not exceed 150 characters';
    } else if (/[<>*=;~]/.test(formData.organisation_name)) {
      errors.organisation_name = 'Characters <, >, *, =, ;, ~ are not allowed';
    }
    
    // Street Address validation (optional field, but if provided, must be valid)
    if (formData.street_address.trim()) {
      if (formData.street_address.length > 150) {
        errors.street_address = 'Street Address must not exceed 150 characters';
      } else if (/[<>*=;~]/.test(formData.street_address)) {
        errors.street_address = 'Characters <, >, *, =, ;, ~ are not allowed';
      }
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
    
    // Requirement validation
    if (!formData.requirement.trim()) {
      errors.requirement = 'Requirement is required';
    } else if (formData.requirement.length > 500) {
      errors.requirement = 'Requirement must not exceed 500 characters';
    } else if (/[<>*=;~]/.test(formData.requirement)) {
      errors.requirement = 'Characters <, >, *, =, ;, ~ are not allowed';
    }
    
    // Estimated volume validation
    if (!formData.estimated_volume.trim()) {
      errors.estimated_volume = 'Estimated volume is required';
    } else if (formData.estimated_volume.length > 500) {
      errors.estimated_volume = 'Estimated volume must not exceed 500 characters';
    } else if (/[<>*=;~]/.test(formData.estimated_volume)) {
      errors.estimated_volume = 'Characters <, >, *, =, ;, ~ are not allowed';
    }
    
    // Order release date validation
    if (!formData.order_release_date.trim()) {
      errors.order_release_date = 'Order release date is required';
    } else if (formData.order_release_date.length > 500) {
      errors.order_release_date = 'Order release date must not exceed 500 characters';
    } else if (/[<>*=;~]/.test(formData.order_release_date)) {
      errors.order_release_date = 'Characters <, >, *, =, ;, ~ are not allowed';
    }
    
    // CAD file validation (optional field, but if provided, must be valid)
    if (formData.cad_file) {
      const allowedExtensions = ['.doc', '.docx', '.xl', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.jpg', '.jpeg', '.dwg'];
      const fileExtension = '.' + formData.cad_file.name.split('.').pop().toLowerCase();
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!allowedExtensions.includes(fileExtension)) {
        errors.cad_file = 'Invalid file type. Allowed types: doc, docx, xl, xls, ppt, pptx, pdf, jpg, dwg';
      } else if (formData.cad_file.size > maxSize) {
        errors.cad_file = `File size exceeds 5MB limit. Current size: ${(formData.cad_file.size / 1024 / 1024).toFixed(2)} MB`;
      }
    }
    
    // RFQ file validation (optional field, but if provided, must be valid)
    if (formData.rfq_file) {
      const allowedExtensions = ['.doc', '.docx', '.xl', '.xls', '.xlsx', '.pdf'];
      const fileExtension = '.' + formData.rfq_file.name.split('.').pop().toLowerCase();
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!allowedExtensions.includes(fileExtension)) {
        errors.rfq_file = 'Invalid file type. Allowed types: doc, docx, xl, xls, pdf';
      } else if (formData.rfq_file.size > maxSize) {
        errors.rfq_file = `File size exceeds 5MB limit. Current size: ${(formData.rfq_file.size / 1024 / 1024).toFixed(2)} MB`;
      }
    }
    
    setFormErrors(errors);
    
    // Return validation result and first error field name
    const errorKeys = Object.keys(errors);
    return {
      isValid: errorKeys.length === 0,
      firstErrorField: errorKeys.length > 0 ? errorKeys[0] : null
    };
  };

  // Send email notifications
  const sendEmailNotifications = async () => {
    // Note: Admin email is automatically set from ADMIN_EMAIL in .env file by the server
    // The value here is just a placeholder - server will override it with .env value
    const adminEmail = 'marketing@laxmielectronics.com'; // Server uses ADMIN_EMAIL from .env
    const customerEmail = formData.email;
    const fullName = `${formData.first_name} ${formData.last_name}`;

    // Email data for admin notification
    const adminEmailData = {
      to: adminEmail,
      subject: `New Contact Form Submission from ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <h2 style="color: #08222B;">New Contact Form Submission</h2>
          <p>A new contact form has been submitted on the Laxmi Electronics website.</p>
          <h3 style="color: #08222B; margin-top: 24px;">Contact Form Details:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9; width: 40%;"><strong>First Name</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(formData.first_name) || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Last Name</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(formData.last_name) || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Phone Number</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(formData.mobile_number) || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Email Id</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(formData.email) || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Organisation Name</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(formData.organisation_name) || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Street Address</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(formData.street_address) || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>City</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(formData.city) || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>State</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(formData.state) || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Requirement</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${formatTextareaForEmail(formData.requirement) || 'Not provided'}</td>
            </tr>
            ${formData.cad_file ? `<tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>CAD file (with dimensions and UOM)</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                ${escapeHtml(formData.cad_file.name)} (${(formData.cad_file.size / 1024 / 1024).toFixed(2)} MB)<br/>
                <span style="color: #666; font-size: 12px;">File has been attached to this email.</span>
              </td>
            </tr>` : '<tr><td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>CAD file (with dimensions and UOM)</strong></td><td style="padding: 10px; border: 1px solid #ddd;">Not provided</td></tr>'}
            ${formData.rfq_file ? `<tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Copy of RFQ/Contract with applicable clauses</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                ${escapeHtml(formData.rfq_file.name)} (${(formData.rfq_file.size / 1024 / 1024).toFixed(2)} MB)<br/>
                <span style="color: #666; font-size: 12px;">File has been attached to this email.</span>
              </td>
            </tr>` : '<tr><td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Copy of RFQ/Contract with applicable clauses</strong></td><td style="padding: 10px; border: 1px solid #ddd;">Not provided</td></tr>'}
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Estimated volume for the next 18-24 months (Please include the tentative release schedule)</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${formatTextareaForEmail(formData.estimated_volume) || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Please include the tentative order release date</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${formatTextareaForEmail(formData.order_release_date) || 'Not provided'}</td>
            </tr>
          </table>
          <p style="margin-top: 24px; color: #666; font-size: 12px;">
            <strong>Note:</strong> All uploaded files have been attached to this email for your reference.
          </p>
          <p style="margin-top: 16px; color: #666;">This is an automated notification from the Laxmi Electronics website.</p>
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
          <p>Dear ${formData.first_name},</p>
          <p>Thank you for contacting Laxmi Electronics. We have received your request and our team will review it shortly.</p>
          <p>We appreciate your interest in our services and will get back to you as soon as possible.</p>
          <h3 style="color: #08222B; margin-top: 24px;">Your Request Summary:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Requirement:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formatTextareaForEmail(formData.requirement)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Organisation:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.organisation_name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Location:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.city}, ${formData.state}</td>
            </tr>
          </table>
          <p style="margin-top: 24px;">If you have any questions or need to provide additional information, please feel free to contact us at <a href="mailto:marketing@laxmielectronics.com" style="color: #08222B;">marketing@laxmielectronics.com</a>.</p>
          <p style="margin-top: 16px;">Best regards,<br><strong>Laxmi Electronics Team</strong></p>
        </div>
      `,
    };

    try {
      const recaptchaToken = await executeRecaptcha('contact_submit');
      // Prepare FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add files if they exist
      if (formData.cad_file) {
        formDataToSend.append('cad_file', formData.cad_file);
      }
      if (formData.rfq_file) {
        formDataToSend.append('rfq_file', formData.rfq_file);
      }
      
      // Add JSON data as strings (will be parsed on server)
      // Make sure email is included in formData
      const formDataForDB = {
        ...formData,
        email: formData.email, // Ensure email is included
        name: formData.first_name && formData.last_name 
          ? `${formData.first_name} ${formData.last_name}`.trim()
          : formData.first_name || formData.last_name || null,
        cad_file: null, // Remove file objects from JSON
        rfq_file: null
      };
      
      formDataToSend.append('adminEmail', JSON.stringify(adminEmailData));
      formDataToSend.append('customerEmail', JSON.stringify(customerEmailData));
      formDataToSend.append('formData', JSON.stringify(formDataForDB));
      formDataToSend.append('formType', 'contact');
      if (recaptchaToken) {
        formDataToSend.append('recaptchaToken', recaptchaToken);
        formDataToSend.append('recaptchaAction', 'contact_submit');
      }
      
      // Call API endpoint to send emails with file uploads
      const response = await fetch('/api/send-email', {
        method: 'POST',
        body: formDataToSend, // FormData automatically sets Content-Type with boundary
      }).catch((fetchError) => {
        // Network error - server not running or connection failed
        throw new Error(`Cannot connect to server. Please make sure the server is running on port 3001. Error: ${fetchError.message}`);
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Response is not JSON (likely HTML error page or 404)
        const textResponse = await response.text();
        throw new Error(`API endpoint returned HTML instead of JSON. The /api/send-email route may not exist. Please check server configuration. Status: ${response.status}`);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      // Only throw error if it's a critical failure (not just warnings)
      // Backend returns success: true even with warnings (like database save failure)
      if (!result.success && !result.warning) {
        throw new Error(result.message || 'Failed to send email notifications');
      }

      return result;
    } catch (error) {
      // Return error details so we can show them to the user
      return {
        success: false,
        error: error.message || 'Failed to send email. Please check if the server is running and SMTP is configured.'
      };
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationResult = validateForm();
    if (!validationResult.isValid) {
      // Focus on the first error field
      if (validationResult.firstErrorField) {
        const fieldName = validationResult.firstErrorField;
        const fieldElement = document.querySelector(`[name="${fieldName}"]`);
        if (fieldElement) {
          // Scroll to the field
          fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Focus the field after a short delay to ensure scroll completes
          setTimeout(() => {
            fieldElement.focus();
          }, 300);
        }
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Send email notifications to admin and customer
      const emailResult = await sendEmailNotifications();
      
      // Always show success message regardless of warnings
      setSuccessTitle('Thank You!');
      setSuccessMessage('Thank you! Your form has been submitted successfully. We will be in touch soon.');
      
      // On successful submission - keep loader visible, show success modal, then disable form
      // Show success modal immediately
      setShowSuccessModal(true);
      
      // Keep loader visible briefly while modal appears, then disable form and reset fields
      setTimeout(() => {
        setIsSubmitted(true);
        setIsSubmitting(false);
        
        // Reset form fields after successful submission
        setFormData({
          first_name: '',
          last_name: '',
          mobile_number: '',
          email: '',
          organisation_name: '',
          street_address: '',
          city: '',
          state: '',
          requirement: '',
          estimated_volume: '',
          order_release_date: '',
          cad_file: null,
          rfq_file: null,
        });
        setFormErrors({});
      }, 300);
    } catch (error) {
      setIsSubmitting(false);
      setSuccessTitle('Submission Error');
      setSuccessMessage(`There was an error submitting your form: ${error.message || 'Please try again or contact us directly at marketing@laxmielectronics.com'}`);
      setShowSuccessModal(true);
    }
  };

  return (
    <div className="w-full">
      {/* Full-page submit loader overlay */}
      {isSubmitting && (
        <div className="contact-form-loader-overlay" aria-hidden="true">
          <div className="contact-form-loader-content">
            <span className="contact-form-loader-spinner" aria-hidden="true"></span>
            <span className="contact-form-loader-text">Submitting...</span>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 rounded-none">
          <img
            decoding="auto"
            src="/assets/images/delivering-bg.jpg"
            alt="Delivering background"
            className="block w-full h-full object-cover object-center reveal-image"
          />
        </div>

        {/* Overlay */}
        <div className="contact-us-hero-overlay"></div>

        {/* Content Container */}
        <div className="absolute z-20 w-full bottom-0 left-0 right-0 pt-12 md:pt-16 lg:pt-20 xl-1300:pt-16 2xl:pt-24 pb-12 md:pb-16 lg:pb-16 xl-1300:pb-12 2xl:pb-20">
          <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-[48px] xl-1300:px-[40px] 2xl:px-[48px]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 xl-1300:gap-8 2xl:gap-12 items-end">
              {/* Left Side - Title Section */}
              <div className="flex flex-col items-start justify-end reveal reveal-up delay-100">
                <h2 className="contact-us-hero-title text-white mb-4 reveal-text delay-200">
                Add value <br />to your success with 
                </h2>
                <h2 className="contact-us-hero-subtitle text-white reveal-text delay-300">
                Laxmi Electronics
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
                  <p className="contact-us-hero-description reveal-text delay-400">
                  If you would like to make a request for a quote for the manufacture of a mold or components – fill out the form below and we will be in touch as soon as possible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="section-2" className="contact-form-section">
        <div className="contact-form-container">
          

          {/* Content Grid: Left Text, Right Form */}
          <div className="contact-form-content-grid">
            {/* Tag/Description - Left Side with Two Columns */}
            <div className="contact-form-tag-wrapper reveal reveal-left delay-100">
              <div className="contact-form-tag">
                {/* Divider Line */}
                <div className="contact-form-divider-container">
                  <div className="contact-form-divider reveal-line delay-200"></div>
                </div>
                <p className="contact-form-tag-text reveal-text delay-300">
                  <strong>Let's talk.</strong>
                  <br />
                  Whether you're ready to start a project or just exploring options, we're here to help. Fill out the form and we'll get back to you shortly.
                </p>
              </div>
              <div className="contact-form-tag-spacer"></div>
            </div>

            {/* Form - Right Side */}
            <div id="form" className="contact-form-wrapper reveal reveal-right delay-200">
            <p className="contact-form-mandatory-note">* Fields are mandatory</p>
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              {/* First Name and Last Name Row */}
              <div className="contact-form-row">
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>First Name <span className="contact-form-required">*</span></p>
                  </div>
                  <div className="contact-form-input-wrapper">
                    <input
                      type="text"
                      required
                      name="first_name"
                      placeholder="First Name *"
                      className={`contact-form-input ${formErrors.first_name ? 'error' : ''}`}
                      value={formData.first_name}
                      onChange={handleFirstNameChange}
                      maxLength={50}
                      disabled={isSubmitting || isSubmitted}
                    />
                    {formErrors.first_name && (
                      <span className="contact-form-error">{formErrors.first_name}</span>
                    )}
                  </div>
                </label>
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>Last Name <span className="contact-form-required">*</span></p>
                  </div>
                  <div className="contact-form-input-wrapper">
                    <input
                      type="text"
                      required
                      name="last_name"
                      placeholder="Last Name *"
                      className={`contact-form-input ${formErrors.last_name ? 'error' : ''}`}
                      value={formData.last_name}
                      onChange={handleLastNameChange}
                      maxLength={50}
                      disabled={isSubmitting || isSubmitted}
                    />
                    {formErrors.last_name && (
                      <span className="contact-form-error">{formErrors.last_name}</span>
                    )}
                  </div>
                </label>
              </div>

              {/* Phone Number and Email Row */}
              <div className="contact-form-row">
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>Phone Number <span className="contact-form-required">*</span></p>
                  </div>
                  <div className="contact-form-input-wrapper">
                    <input
                      type="tel"
                      name="mobile_number"
                      placeholder="Phone Number *"
                      className={`contact-form-input ${formErrors.mobile_number ? 'error' : ''}`}
                      value={formData.mobile_number}
                      onChange={handlePhoneChange}
                      maxLength={20}
                      required
                      disabled={isSubmitting || isSubmitted}
                    />
                    {formErrors.mobile_number && (
                      <span className="contact-form-error">{formErrors.mobile_number}</span>
                    )}
                  </div>
                </label>
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>Email Id <span className="contact-form-required">*</span></p>
                  </div>
                  <div className="contact-form-input-wrapper">
                    <input
                      type="email"
                      required
                      name="email"
                      placeholder="Email Id *"
                      className={`contact-form-input ${formErrors.email ? 'error' : ''}`}
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isSubmitting || isSubmitted}
                    />
                    {formErrors.email && (
                      <span className="contact-form-error">{formErrors.email}</span>
                    )}
                  </div>
                </label>
              </div>

              {/* Organisation Name and Street Address Row */}
              <div className="contact-form-row">
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>Organisation Name <span className="contact-form-required">*</span></p>
                  </div>
                  <div className="contact-form-input-wrapper">
                    <input
                      type="text"
                      required
                      name="organisation_name"
                      placeholder="Organisation Name *"
                      className={`contact-form-input ${formErrors.organisation_name ? 'error' : ''}`}
                      value={formData.organisation_name}
                      onChange={handleOrganisationNameChange}
                      maxLength={150}
                      disabled={isSubmitting || isSubmitted}
                    />
                    {formErrors.organisation_name && (
                      <span className="contact-form-error">{formErrors.organisation_name}</span>
                    )}
                  </div>
                </label>
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>Street Address</p>
                  </div>
                  <div className="contact-form-input-wrapper">
                    <input
                      type="text"
                      name="street_address"
                      placeholder="Street Address"
                      className={`contact-form-input ${formErrors.street_address ? 'error' : ''}`}
                      value={formData.street_address}
                      onChange={handleStreetAddressChange}
                      maxLength={150}
                      disabled={isSubmitting || isSubmitted}
                    />
                    {formErrors.street_address && (
                      <span className="contact-form-error">{formErrors.street_address}</span>
                    )}
                  </div>
                </label>
              </div>

              {/* City and State Row */}
              <div className="contact-form-row">
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>City <span className="contact-form-required">*</span></p>
                  </div>
                  <div className="contact-form-input-wrapper">
                    <input
                      type="text"
                      required
                      name="city"
                      placeholder="City *"
                      className={`contact-form-input ${formErrors.city ? 'error' : ''}`}
                      value={formData.city}
                      onChange={handleCityChange}
                      maxLength={50}
                      disabled={isSubmitting || isSubmitted}
                    />
                    {formErrors.city && (
                      <span className="contact-form-error">{formErrors.city}</span>
                    )}
                  </div>
                </label>
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>State <span className="contact-form-required">*</span></p>
                  </div>
                  <div className="contact-form-input-wrapper">
                    <input
                      type="text"
                      required
                      name="state"
                      placeholder="State *"
                      className={`contact-form-input ${formErrors.state ? 'error' : ''}`}
                      value={formData.state}
                      onChange={handleStateChange}
                      maxLength={50}
                      disabled={isSubmitting || isSubmitted}
                    />
                    {formErrors.state && (
                      <span className="contact-form-error">{formErrors.state}</span>
                    )}
                  </div>
                </label>
              </div>

              {/* Requirement Textarea */}
              <div className="contact-form-row-full">
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>Requirement <span className="contact-form-required">*</span></p>
                  </div>
                  <div className="contact-form-input-wrapper">
                    <textarea
                      required
                      name="requirement"
                      placeholder="Requirement *"
                      className={`contact-form-input contact-form-textarea ${formErrors.requirement ? 'error' : ''}`}
                      rows={5}
                      value={formData.requirement}
                      onChange={handleRequirementChange}
                      maxLength={500}
                      disabled={isSubmitting || isSubmitted}
                    ></textarea>
                    {formErrors.requirement && (
                      <span className="contact-form-error">{formErrors.requirement}</span>
                    )}
                  </div>
                </label>
              </div>

              {/* File Uploads Row */}
              <div className="contact-form-row">
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>CAD file (with dimensions and UOM)</p>
                  </div>
                  <div className="contact-form-file-upload">
                    <input
                      type="file"
                      name="cad_file"
                      accept=".doc,.docx,.xl,.xls,.xlsx,.ppt,.pptx,.pdf,.jpg,.jpeg,.dwg"
                      className="contact-form-file-input"
                      id="cad_file"
                      onChange={handleCadFileChange}
                      disabled={isSubmitting || isSubmitted}
                    />
                    <label htmlFor="cad_file" className="contact-form-file-label">
                      <svg viewBox="0 0 1024 1024" width="50px" height="50px" fill="currentColor" aria-hidden="true">
                        <path d="M885.2 446.3l-.2-.8-112.2-285.1c-5-16.1-19.9-27.2-36.8-27.2H281.2c-17 0-32.1 11.3-36.9 27.6L139.4 443l-.3.7-.2.8c-1.3 4.9-1.7 9.9-1 14.8-.1 1.6-.2 3.2-.2 4.8V830a60.9 60.9 0 0 0 60.8 60.8h627.2c33.5 0 60.8-27.3 60.9-60.8V464.1c0-1.3 0-2.6-.1-3.7.4-4.9 0-9.6-1.3-14.1zm-295.8-43l-.3 15.7c-.8 44.9-31.8 75.1-77.1 75.1-22.1 0-41.1-7.1-54.8-20.6S436 441.2 435.6 419l-.3-15.7H229.5L309 210h399.2l81.7 193.3H589.4zm-375 76.8h157.3c24.3 57.1 76 90.8 140.4 90.8 33.7 0 65-9.4 90.3-27.2 22.2-15.6 39.5-37.4 50.7-63.6h156.5V814H214.4V480.1z"></path>
                      </svg>
                      <span className="contact-form-file-text">
                        {formData.cad_file ? formData.cad_file.name : 'Click or drag a file to this area to upload.'}
                      </span>
                    </label>
                    {formData.cad_file && !formErrors.cad_file && (
                      <div className="mt-2 text-sm text-green-600 font-medium">
                        ✓ File selected: {formData.cad_file.name} ({(formData.cad_file.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    )}
                    {formErrors.cad_file && (
                      <div className="contact-form-error mt-2 text-sm font-medium">
                        ✗ {formErrors.cad_file}
                      </div>
                    )}
                    <div className="contact-form-file-description">
                      (Preferred Files: doc, docx, xl, xls, ppt, pptx, pdf, jpg, dwg & below 5mb)
                    </div>
                  </div>
                </label>
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>Copy of RFQ/Contract with applicable clauses</p>
                  </div>
                  <div className="contact-form-file-upload">
                    <input
                      type="file"
                      name="rfq_file"
                      accept=".doc,.docx,.xl,.xls,.xlsx,.pdf"
                      className="contact-form-file-input"
                      id="rfq_file"
                      onChange={handleRfqFileChange}
                      disabled={isSubmitting || isSubmitted}
                    />
                    <label htmlFor="rfq_file" className="contact-form-file-label">
                      <svg viewBox="0 0 1024 1024" width="50px" height="50px" fill="currentColor" aria-hidden="true">
                        <path d="M885.2 446.3l-.2-.8-112.2-285.1c-5-16.1-19.9-27.2-36.8-27.2H281.2c-17 0-32.1 11.3-36.9 27.6L139.4 443l-.3.7-.2.8c-1.3 4.9-1.7 9.9-1 14.8-.1 1.6-.2 3.2-.2 4.8V830a60.9 60.9 0 0 0 60.8 60.8h627.2c33.5 0 60.8-27.3 60.9-60.8V464.1c0-1.3 0-2.6-.1-3.7.4-4.9 0-9.6-1.3-14.1zm-295.8-43l-.3 15.7c-.8 44.9-31.8 75.1-77.1 75.1-22.1 0-41.1-7.1-54.8-20.6S436 441.2 435.6 419l-.3-15.7H229.5L309 210h399.2l81.7 193.3H589.4zm-375 76.8h157.3c24.3 57.1 76 90.8 140.4 90.8 33.7 0 65-9.4 90.3-27.2 22.2-15.6 39.5-37.4 50.7-63.6h156.5V814H214.4V480.1z"></path>
                      </svg>
                      <span className="contact-form-file-text">
                        {formData.rfq_file ? formData.rfq_file.name : 'Click or drag a file to this area to upload.'}
                      </span>
                    </label>
                    {formData.rfq_file && !formErrors.rfq_file && (
                      <div className="mt-2 text-sm text-green-600 font-medium">
                        ✓ File selected: {formData.rfq_file.name} ({(formData.rfq_file.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    )}
                    {formErrors.rfq_file && (
                      <div className="contact-form-error mt-2 text-sm font-medium">
                        ✗ {formErrors.rfq_file}
                      </div>
                    )}
                    <div className="contact-form-file-description">
                      (Preferred Files: doc, docx, xl, xls, pdf & below 5mb)
                    </div>
                  </div>
                </label>
              </div>

              {/* Estimated Volume Textarea */}
              <div className="contact-form-row-full">
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>Estimated volume for the next 18-24 months (Please include the tentative release schedule) <span className="contact-form-required">*</span></p>
                  </div>
                  <div className="contact-form-input-wrapper">
                    <textarea
                      required
                      name="estimated_volume"
                      placeholder="Estimated volume for the next 18-24 months (Please include the tentative release schedule) *"
                      className={`contact-form-input contact-form-textarea ${formErrors.estimated_volume ? 'error' : ''}`}
                      rows={5}
                      value={formData.estimated_volume}
                      onChange={handleEstimatedVolumeChange}
                      maxLength={500}
                      disabled={isSubmitting || isSubmitted}
                    ></textarea>
                    {formErrors.estimated_volume && (
                      <span className="contact-form-error">{formErrors.estimated_volume}</span>
                    )}
                  </div>
                </label>
              </div>

              {/* Tentative Order Release Date Textarea */}
              <div className="contact-form-row-full">
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>Please include the tentative order release date <span className="contact-form-required">*</span></p>
                  </div>
                  <div className="contact-form-input-wrapper">
                    <textarea
                      required
                      name="order_release_date"
                      placeholder="Please include the tentative order release date *"
                      className={`contact-form-input contact-form-textarea ${formErrors.order_release_date ? 'error' : ''}`}
                      rows={5}
                      value={formData.order_release_date}
                      onChange={handleOrderReleaseDateChange}
                      maxLength={500}
                      disabled={isSubmitting || isSubmitted}
                    ></textarea>
                    {formErrors.order_release_date && (
                      <span className="contact-form-error">{formErrors.order_release_date}</span>
                    )}
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="contact-form-submit-container">
                <button
                  type="submit"
                  className="contact-form-submit-button"
                  disabled={isSubmitting || isSubmitted}
                >
                  <span>
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="btn-spinner" aria-hidden="true"></span>
                        Submitting...
                      </span>
                    ) : isSubmitted ? 'Submitted!' : 'Submit'}
                  </span>
                </button>
              </div>

              {/* Honeypot fields for spam protection */}
              <input
                type="text"
                name="wpforms[fields][19]"
                tabIndex="-1"
                aria-hidden="true"
                style={{ position: 'absolute', overflow: 'hidden', display: 'inline', height: '1px', width: '1px', zIndex: -1000, padding: 0 }}
              />
              <input
                type="text"
                name="wpforms[fields][1]"
                tabIndex="-1"
                aria-hidden="true"
                style={{ position: 'absolute', transform: 'scale(0)' }}
              />
            </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contacts Section */}
      <main id="section-2-1" className="contact-contacts-section">
        {/* Decorative Shapes */}
        <figure className="contact-shape-1">
          <img
            decoding="auto"
            width="743"
            height="404"
            sizes="780px"
            src="/assets/images/vfC405O6yaNKJbRR1D2pFFXHE.svg"
            alt="component shape"
            className="contact-shape-img"
          />
        </figure>
        <figure className="contact-shape-2">
          <img
            decoding="auto"
            width="743"
            height="754"
            sizes="600px"
            src="/assets/images/brE0LzaBg4dUMi0nQeg6IAa25c.svg"
            alt="congwheel component"
            className="contact-shape-img"
          />
        </figure>

         {/* Email and Phone Section */}
         <div className="contact-email-phone">
           <div className="contact-email-phone-grid-main">
             {/* Left Side - General Inquiries Tag */}
             <div className="contact-email-phone-left">
               {/* Divider Line */}
               <div className="contact-divider-container">
                 <div className="contact-divider-line"></div>
               </div>
               <div className="contact-section-tag">
                 <p>General Inquiries</p>
               </div>
             </div>
             
             {/* Right Side - Description and Contact Info */}
             <div className="contact-email-phone-right">
               <div className="contact-description">
                 <h6>We are here to help and answer any question you might have. We look forward to hearing from you:</h6>
               </div>
               <ul className="contact-info-list">
                 <li className="contact-info-item">
                   <div className="contact-info-title">
                     <p>Email</p>
                   </div>
                   <div className="contact-info-text">
                     <h6>
                       <a href="mailto:marketing@laxmielectronics.com" target="_blank" rel="noopener">marketing@laxmielectronics.com</a>
                     </h6>
                   </div>
                 </li>
                 {/* <li className="contact-info-item">
                   <div className="contact-info-title">
                     <p>Phone</p>
                   </div>
                   <div className="contact-info-text">
                     <h6>
                       <a href="tel:16175550123" target="_blank" rel="noopener">+1 (617) 555-0123</a>
                     </h6>
                   </div>
                 </li> */}
               </ul>
             </div>
           </div>
         </div>

         {/* Locations Section */}
         <div className="contact-locations">
           <div className="contact-locations-grid-main">
             {/* Left Side - Locations Tag */}
             <div className="contact-locations-left">
               {/* Divider Line */}
               <div className="contact-divider-container">
                 <div className="contact-divider-line"></div>
               </div>
               <div className="contact-section-tag">
                 <p>Locations</p>
               </div>
             </div>
             
             {/* Right Side - Location Addresses */}
             <div className="contact-locations-right">
               <div className="contact-location-item">
                 <div className="contact-location-label">
                   <h6>Headquarters</h6>
                 </div>
                 <div className="contact-location-address">
                   <p>
                   Plot No. 81, EPIP Area, <br />
                   Whitefield,<br />                     
Bangalore 560 066, INDIA
                   </p>
                 </div>
               </div>
               {/* <div className="contact-location-item">
                 <div className="contact-location-label">
                   <h6>R&D Facility – Landrobe, PA</h6>
                 </div>
                 <div className="contact-location-address">
                   <p>
                     456 Advanced Materials Road<br />
                     Landrobe, PA 15650<br />
                     United States
                   </p>
                 </div>
               </div> */}
             </div>
           </div>
         </div>
      </main>

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

export default ContactUs;

