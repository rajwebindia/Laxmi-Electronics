import { useState, useEffect, useRef } from 'react';

const ThermoplasticMolding = () => {
  const [activeSection, setActiveSection] = useState('injection-molding');
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
  
  const sectionRefs = {
    'injection-molding': useRef(null),
    'medical-molding': useRef(null),
    'aerospace-molding': useRef(null),
    'isbm': useRef(null),
  };

  // PDF file mapping for each certification
  const certPdfMap = {
    'iso-9001': '/assets/certifications/ISO-9001-2015.pdf',
    'iso-13485': '/assets/certifications/ISO-13485-2016.pdf',
    'as-9100': '/assets/certifications/AS-9100-D.pdf',
    'ul': '/assets/certifications/UL-Traceability.pdf',
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.organisationName.trim()) {
      errors.organisationName = 'Organisation Name is required';
    }
    
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      errors.state = 'State is required';
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

  // Handle phone input with masking
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({
      ...prev,
      phone: value
    }));
  };

  // Send email notifications
  // Option 1: Using Backend API (Current Implementation)
  // Option 2: Using EmailJS (Uncomment and install: npm install @emailjs/browser)
  //          Then initialize: emailjs.init("YOUR_PUBLIC_KEY")
  const sendEmailNotifications = async () => {
    const adminEmail = 'marketing@laxmielectronics.com'; // Admin email from contact page
    const customerEmail = formData.email;
    const certTitle = getCertTitle();

    // Email data for admin notification
    const adminEmailData = {
      to: adminEmail,
      subject: `New Certification Request: ${certTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #08222B;">New Certification Request</h2>
          <p>A new certification request has been submitted for <strong>${certTitle}</strong>.</p>
          <h3 style="color: #08222B; margin-top: 24px;">Customer Details:</h3>
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
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Organisation:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.organisationName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>City:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.city}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>State:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.state}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Certification:</strong></td>
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
      // Call API endpoint to send emails
      // Replace '/api/send-email' with your actual backend API endpoint
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminEmail: adminEmailData,
          customerEmail: customerEmailData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email notifications');
      }

      return await response.json();
    } catch (error) {
      console.error('Email notification error:', error);
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
      await sendEmailNotifications();
      
      // On successful submission
      setIsSubmitted(true);
      setIsSubmitting(false);
      
      // Download PDF after successful submission
      downloadCertificationPDF();
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
      alert('There was an error submitting your form. Please try again.');
    }
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

  // Get certification title
  const getCertTitle = () => {
    const titles = {
      'iso-9001': 'ISO 9001:2015',
      'iso-13485': 'ISO 13485:2016',
      'as-9100': 'AS 9100 D',
      'ul': 'UL Traceability',
    };
    return titles[selectedCert] || 'Certification';
  };

  // Handle hash navigation and scroll to section
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && sectionRefs[hash]?.current) {
      // Wait for page to render, then scroll
      setTimeout(() => {
        const element = sectionRefs[hash].current;
        if (element) {
          const headerOffset = 100; // Account for fixed header
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          setActiveSection(hash);
        }
      }, 100);
    }
  }, []);

  // Handle hash changes (when clicking links on the same page)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && sectionRefs[hash]?.current) {
        setTimeout(() => {
          const element = sectionRefs[hash].current;
          if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
            setActiveSection(hash);
          }
        }, 100);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle hash navigation and scroll to section on page load
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && sectionRefs[hash]?.current) {
      // Wait for page to render, then scroll
      setTimeout(() => {
        const element = sectionRefs[hash].current;
        if (element) {
          const headerOffset = 100; // Account for fixed header
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          setActiveSection(hash);
        }
      }, 300);
    }
  }, []);

  // Handle hash changes (when clicking links on the same page)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && sectionRefs[hash]?.current) {
        setTimeout(() => {
          const element = sectionRefs[hash].current;
          if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
            setActiveSection(hash);
          }
        }, 100);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: '-100px 0px -50% 0px',
    };

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the section with the highest intersection ratio
        let maxRatio = 0;
        let activeId = null;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            activeId = entry.target.id;
          }
        });

        if (activeId && maxRatio > 0) {
          setActiveSection(activeId);
        }
      },
      observerOptions
    );

    // Observe all sections
    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      observer.disconnect();
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
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] md:min-h-[650px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/assets/images/about-us-banner.jpg"
            alt="Thermoplastic Molding Banner"
            className="block w-full h-full object-cover object-center"
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-[#08222B] opacity-75"></div>

        {/* Content Container */}
        <div className="relative z-20 w-full pt-20 md:pt-20 lg:pt-20 xl-1300:pt-16 2xl:pt-24 pb-8 md:pb-12">
          <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-[48px] xl-1300:px-[40px] 2xl:px-[48px]">
            <div className=" mx-auto">
              {/* Title Section */}
              <div className="mb-8">
                {/* "Industries" - Full width, left aligned */}
                <div className="w-full">
                  <h1 className="mold-making-industries text-white text-left">
                    <span className="whitespace-nowrap">Injection</span>
                  </h1>
                </div>
                {/* "We serve" - Full width, right aligned */}
                <div className="w-full">
                  <h1 className="mold-making-we-serve text-white text-right">
                    <span className="whitespace-nowrap">Molding</span>
                  </h1>
                </div>
              </div>

              {/* Subtitle and Description */}
              <div className="mt-12">


                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                  {/* Left Section - Subtitle */}
                  <div>
                    <p className="mold-making-subtitle text-white">
                      <span className="whitespace-nowrap">Detailed features </span><br />
                      <span className="whitespace-nowrap">and complex geometry </span>
                    </p>
                  </div>
                  <div>

                  </div>
                  {/* Right Section - Description */}
                  <div className="hero-description-container">
                    {/* Divider Line */}
                    <div className="w-full mb-6">
                      <div className="h-px mold-making-divider"></div>
                    </div>
                    <p className="text-white text-base md:text-xl font-light leading-relaxed" style={{ fontFamily: 'Manrope' }}>
                      Laxmi provides high capacity, fast turnaround production of injection molded plastic parts from our state-of­the-art injection molding facility in Bangalore. We ensure zero defect manufacturing through process-controlled methodologies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Molding Section */}
      <section className="mold-making-industries-section">


        <div className="industries-grid">
          {/* Injection molding */}
          <div className="injection-molding">
            <a href="#injection-molding" className="industry-card-link">
              <div className="industry-image-container rounded-[6px]">
                <img
                  decoding="auto"
                  loading="lazy"
                  width="2400"
                  height="2400"
                  src="/assets/images/thermoplastic-molding.jpg"
                  alt="Injection Molding"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <button className="industry-button bg-white rounded-[4px] text-[#08222B] transition-colors">
                <span className="industry-button-text">Injection Molding</span>
                <img src="/assets/images/arrow-icon.svg" alt="" className="w-6 h-6" />
              </button>
            </a>
          </div>

          {/* Medical Molding */}
          <div className="medical-molding">
            <a href="#medical-molding" className="industry-card-link">
              <div className="industry-image-container rounded-[6px]">
                <img
                  decoding="auto"
                  loading="lazy"
                  width="4000"
                  height="3000"
                  src="/assets/images/medical-molding.jpg"
                  alt="Medical Molding"
                  className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                />
              </div>
              <button className="industry-button bg-white rounded-[4px] text-[#08222B] transition-colors">
                <span className="industry-button-text">Medical Molding</span>
                <img src="/assets/images/arrow-icon.svg" alt="" className="w-6 h-6" />
              </button>
            </a>
          </div>

          {/* Heading Section */}
          <div className="industry-heading-section">
            <div className="industry-heading-section-left">
              <h3 className="industry-heading-text text-[#08222B]">Molding</h3>
            </div>
          </div>


          {/* Aerospace Molding */}
          <div className="aerospace-molding">
            <a href="#aerospace-molding" className="industry-card-link">
              <div className="industry-image-container rounded-[6px]">
                <img
                  decoding="auto"
                  loading="lazy"
                  width="1920"
                  height="1280"
                  src="/assets/images/aerospace-molding.jpg"
                  alt="Aerospace Molding"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <button className="industry-button bg-white rounded-[4px] text-[#08222B] transition-colors">
                <span className="industry-button-text">Aerospace Molding</span>
                <img src="/assets/images/arrow-icon.svg" alt="" className="w-6 h-6" />
              </button>
            </a>
          </div>

          {/* ISBM */}
          <div className="isbm">
            <a href="#isbm" className="industry-card-link">
              <div className="industry-image-container rounded-[6px]">
                <img
                  decoding="auto"
                  loading="lazy"
                  width="2400"
                  height="1601"
                  src="/assets/images/isbm-molding.jpg"
                  alt="ISBM"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <button className="industry-button bg-white rounded-[4px] text-[#08222B] transition-colors">
                <span className="industry-button-text">ISBM</span>
                <img src="/assets/images/arrow-icon.svg" alt="" className="w-6 h-6" />
              </button>
            </a>
          </div>


        </div>
      </section>

      {/* Molding Details Section */}
      <section className="industries-details-section">
        {/* Navigation Container */}
        <div className="industries-nav-container">
          <div className="nav-container">
            <nav className="industries-nav">
              <div className={`industries-nav-item ${activeSection === 'injection-molding' ? 'active' : ''}`}>
                <a href="#injection-molding">Injection Molding</a>
                <div className="industries-nav-line"></div>
              </div>
              <div className={`industries-nav-item ${activeSection === 'medical-molding' ? 'active' : ''}`}>
                <a href="#medical-molding">Medical Molding</a>
                <div className="industries-nav-line"></div>
              </div>
              <div className={`industries-nav-item ${activeSection === 'aerospace-molding' ? 'active' : ''}`}>
                <a href="#aerospace-molding">Aerospace Molding</a>
                <div className="industries-nav-line"></div>
              </div>
              <div className={`industries-nav-item ${activeSection === 'isbm' ? 'active' : ''}`}>
                <a href="#isbm">ISBM</a>
                <div className="industries-nav-line"></div>
              </div>

            </nav>
          </div>
        </div>

        <div className="mx-auto">
          {/* Injection Molding */}
          <div id="injection-molding" ref={sectionRefs['injection-molding']} className="industry-detail-aerospace scroll-mt-24">
            <div className="detail-inner">
              <h3 className="industry-detail-heading">Injection Molding</h3>
              <div className="industry-detail-divider"></div>
              <div className="industry-detail-grid">
                <figure className="industry-detail-figure">
                  <img
                    decoding="auto"
                    loading="lazy"
                    width="1920"
                    height="2918"
                    src="/assets/images/thermoplastic-molding.jpg"
                    alt="Thermoplastic Molding"
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="injection-inner-content">
                  <h3 className="injection-molding-subheading">Precision injection molding</h3>
                  <h3 className="injection-molding-subheading-italic">Detailed features and complex geometry </h3>
                  <p className="industry-detail-description">
                    Laxmi provides high capacity, fast turnaround production of injection molded plastic parts from our state-of­the-art injection molding facility in Bangalore. We ensure zero defect manufacturing through process-controlled methodologies.
                  </p>
                  <p className="industry-detail-description">We ensure continuous operations by using microprocessor based, high-end CNC closed loop machines with capabilities from 20 tons to 300 tons.</p>
                  <div className="industry-detail-items-container">
                    <div className="industry-detail-item">
                      <div className="industry-detail-item-divider"></div>
                      <h6 className="industry-detail-item-heading">Laxmi Process</h6>
                      <ul>
                        <li>Commodity Polymers – PP, PE &amp; SA</li>
                        <li>Engineering Polymers – PC ABS, PA, PA-GF, Acetals</li>
                        <li>Advanced Polymers – PEEK, PEI, PAA, PPS</li>
                      </ul>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Molding */}
          <div id="medical-molding" ref={sectionRefs['medical-molding']} className="industry-detail-aerospace industry-detail-white scroll-mt-24">
            <div className="detail-inner">
              <h3 className="industry-detail-heading">Medical Molding</h3>
              <div className="industry-detail-divider"></div>
              <div className="industry-detail-grid">
                <figure className="industry-detail-figure">
                  <img
                    decoding="auto"
                    loading="lazy"
                    width="2400"
                    height="3600"
                    src="/assets/images/medical-molding.jpg"
                    alt="Medical Molding"
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="injection-inner-content">
                  <h3 className="injection-molding-subheading">Certainty and reliability in results</h3>
                  <h3 className="injection-molding-subheading-italic">Cleanroom molding and assembly, complete medical manufacturing</h3>
                  <p className="industry-detail-description">From simple medical sub-assemblies to packaged medical devices, LAXMI’s dedicated medical facilities provide complete turnkey product manufacturing services for the healthcare industry. Our core competencies in silicone and thermoplastic molding, combined with our supply chain security, procurement skills and strategic alliances provide the best time-to-market at reduced cost.
                    Injection molding of medical parts are done in a certified Class 8 clean room IQ/OQ/PQ process validations are followed to ensure control over the process and the required quality requirements are met. </p>
                  <p className="industry-detail-description">LAXMI provides custom design and manufacturing services specializing in healthcare industry devices and products. LAXMI ‘s financial strength and resources support program growth and rapid capacity expansion.</p>

                </div>
              </div>
            </div>
          </div>

          {/* Aerospace Molding */}
          <div id="aerospace-molding" ref={sectionRefs['aerospace-molding']} className="industry-detail-aerospace scroll-mt-24">
            <div className="detail-inner">
              <h3 className="industry-detail-heading">Aerospace Molding</h3>
              <div className="industry-detail-divider"></div>
              <div className="industry-detail-grid">
                <figure className="industry-detail-figure">
                  <img
                    decoding="auto"
                    loading="lazy"
                    width="3213"
                    height="4016"
                    src="/assets/images/aerospace-molding.jpg"
                    alt="Aerospace Molding"
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="injection-inner-content">
                  <h3 className="injection-molding-subheading">Zero defect manufacturing</h3>
                  <h3 className="injection-molding-subheading-italic">Design flexibility, complex geometry and fine features</h3>
                  <p className="industry-detail-description">LAXMI provides complete solutions to commercial aviation and space sectors for thermoplastic, thermosetting, silicone and elastomer parts. Our comprehensive facility and in-house molding and tooling capabilities offer a single window for the aviation industry. Our molds for the aviation sector meet international quality standards, have a high mold life and can be customized as per specifications of clients.</p>

                </div>
              </div>
            </div>
          </div>


          {/* ISBM */}
          <div id="isbm" ref={sectionRefs['isbm']} className="industry-detail-aerospace industry-detail-white scroll-mt-24">
            <div className="detail-inner">
              <h3 className="industry-detail-heading">ISBM</h3>
              <div className="industry-detail-divider"></div>
              <div className="industry-detail-grid">
                <figure className="industry-detail-figure">
                  <img
                    decoding="auto"
                    loading="lazy"
                    width="3504"
                    height="5256"
                    src="/assets/images/isbm-molding.jpg"
                    alt="ISBM"
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="injection-inner-content">
                  <h3 className="injection-molding-subheading">Injection Stretch Blow Molding (ISBM)</h3>
                  <h3 className="injection-molding-subheading-italic">High volume for healthcare, medical and pharmaceutical applications</h3>
                  <p className="industry-detail-description">Our world class, single stage, injection stretch blow molding equipment provides high quality bottles produced from multi cavity molds. The machine we use features direct heatcon with one-step, three-stations injection, drawing, blowing, ejection and is integrated with a chiller, mold temperature controller and material drier. We manufacture containers as small as (5 ml to 1000ml), and have considerable experience in the manufacture of ultra-clean bottles, wide mouth jars, round or square shaped bottles, oval, asymmetric or tailor-made containers. ISBM systems have flexibility over a wide range of filling volumes (100 mL – 2400 mL) and shapes, high production rate, high efficiency, “flashless”, lower energy consumption, simple operation, quick change over and easy maintenance.</p>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Evolving into a  world-class Tool Maker Section */}
      <section className="about-us-vision-section">
        <div className="about-us-vision-container">
          <div className="about-us-vision-content">
            {/* Title */}
            <div className="about-us-vision-title">
              <h3>Accredited Quality</h3>
            </div>

            {/* Description */}
            <div className="about-us-vision-description">
              <p>
                Since 1983, Laxmi has added to its portfolio of capabilities focusing on being the one-stop for precision thermoplastic molding. Our facilities, machining infrastructure, technology, quality processes and human resources have been augmented to meet customer needs in thermoplastic injection molding.
              </p>
            </div>
          </div>

          {/* Divider Line */}
          <div className="about-us-vision-divider">
            <div className="about-us-vision-line"></div>
          </div>

          {/* Image and Text Section */}
          <div className="iso-certifications-container">
            <div className="iso-certifications-grid">
              {/* ISO 9001:2015 */}
              <div 
                className="iso-cert-badge" 
                onClick={() => {
                  setSelectedCert('iso-9001');
                  setIsModalOpen(true);
                  setIsSubmitted(false);
                }}
              >
                <div className="iso-cert-badge-content">
                  <h3 className="iso-cert-title">ISO</h3>
                  <p className="iso-cert-subtitle">9001:2015</p>
                </div>
              </div>

              {/* ISO 13485:2016 */}
              <div 
                className="iso-cert-badge" 
                onClick={() => {
                  setSelectedCert('iso-13485');
                  setIsModalOpen(true);
                  setIsSubmitted(false);
                }}
              >
                <div className="iso-cert-badge-content">
                  <h3 className="iso-cert-title">ISO</h3>
                  <p className="iso-cert-subtitle">13485:2016</p>
                </div>
              </div>

              {/* AS 9100 D */}
              <div 
                className="iso-cert-badge" 
                onClick={() => {
                  setSelectedCert('as-9100');
                  setIsModalOpen(true);
                  setIsSubmitted(false);
                }}
              >
                <div className="iso-cert-badge-content">
                  <h3 className="iso-cert-title">AS</h3>
                  <p className="iso-cert-subtitle">9100 D</p>
                </div>
              </div>

              {/* UL */}
              <div 
                className="iso-cert-badge" 
                onClick={() => {
                  setSelectedCert('ul');
                  setIsModalOpen(true);
                  setIsSubmitted(false);
                }}
              >
                <div className="iso-cert-badge-content">
                  <h3 className="iso-cert-title">UL</h3>
                  <p className="iso-cert-subtitle">Traceability<br />File# 251071</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Let's Build the Future Together Section */}
      <section className="about-us-cta-section">
        <div className="about-us-cta-bg">
          <figure className="about-us-cta-bg-image">
            <img
              src="/assets/images/nlflIYUFxh7GOy9fpoBBBlTAkMo.webp"
              alt="Let's Build the Future Together"
              className="w-full h-full object-cover"
            />
          </figure>
        </div>

        <div className="about-us-cta-container">
          <div className="about-us-cta-content">
            {/* Title */}
            <div className="about-us-cta-title">
              <div className="about-us-cta-title-line1">
                <h3>Let's build the</h3>
              </div>
              <div className="about-us-cta-title-line2">
                <h3>Future</h3>
                <h3>Together</h3>
              </div>
            </div>

            {/* Divider Line */}
            <div className="about-us-cta-divider">
              <div className="about-us-cta-line"></div>
            </div>

            {/* Image and Text Block */}
            <div className="about-us-cta-image-text">
              <figure className="about-us-cta-image">
                <img
                  src="/assets/images/help-bring.jpg"
                  alt="Let's Build the Future Together"
                  className="w-full h-full object-cover"
                />
              </figure>

              <div className="about-us-cta-text-block">
                <div className="about-us-cta-description">
                  <p>We believe in long-term partnerships and shared innovation. Contact us to explore how our thermoplastic molding expertise can help bring your most ambitious projects to life.</p>
                </div>

                {/* CTA Button */}
                <div className="about-us-cta-button-container">
                  <a href="./contact-us" className="about-us-cta-button">
                    <div className="about-us-cta-button-content">
                      <div className="about-us-cta-button-text">
                        <p>Request a Quote</p>
                      </div>
                      <div className="about-us-cta-button-icon">
                        <img
                          decoding="auto"
                          loading="lazy"
                          width="24"
                          height="24"
                          sizes="24px"
                          src="https://framerusercontent.com/images/wLYAFc2wy5hrwZC9O8IBSz9oRY.svg"
                          alt=""
                        />
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
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
                  <h2 style={{ 
                    fontFamily: '"Satoshi", "Satoshi Placeholder", sans-serif',
                    fontSize: '32px',
                    fontWeight: 600,
                    color: '#08222B',
                    marginBottom: '8px',
                    textAlign: 'center'
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
                          onChange={handleInputChange}
                          required
                        />
                        {formErrors.name && (
                          <span className="cert-form-error">{formErrors.name}</span>
                        )}
                      </div>

                      <div className="cert-form-field cert-form-field-half">
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          className="cert-form-input"
                          placeholder="Phone"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          maxLength="10"
                        />
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
                          onChange={handleInputChange}
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
                          onChange={handleInputChange}
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
                          onChange={handleInputChange}
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
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Submit'}
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
    </div>
  );
};

export default ThermoplasticMolding;
