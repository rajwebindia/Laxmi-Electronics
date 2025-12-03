import { useState, useEffect, useRef } from 'react';

const SiliconeMolding = () => {
  const [activeSection, setActiveSection] = useState('lsr-molding');
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
    'lsr-molding': useRef(null),
    'hcr-molding': useRef(null),
    '2k-molding': useRef(null),
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
  const sendEmailNotifications = async () => {
    const adminEmail = 'marketing@laxmielectronics.com';
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
      await sendEmailNotifications();

      setIsSubmitted(true);
      setIsSubmitting(false);

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
            alt="Silicone Molding Banner"
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
                {/* "Silicone" - Full width, left aligned */}
                <div className="w-full">
                  <h1 className="silicone-molding-industries text-white text-left">
                    <span className="whitespace-nowrap">Silicone</span>
                  </h1>
                </div>
                {/* "Molding" - Full width, right aligned */}
                <div className="w-full">
                  <h1 className="silicone-molding-we-serve text-white text-right">
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
                    <p className="silicone-molding-subtitle text-white">
                      <span className="whitespace-nowrap">Flashless molding with </span><br />
                      <span className="whitespace-nowrap">precision and detail </span>
                    </p>
                  </div>
                  <div>

                  </div>
                  {/* Right Section - Description */}
                  <div className="hero-description-container">
                    {/* Divider Line */}
                    <div className="w-full mb-6">
                      <div className="h-px silicone-molding-divider"></div>
                    </div>
                    <p className="text-white text-base md:text-xl font-light leading-relaxed" style={{ fontFamily: 'Manrope' }}>LAXMI is an approved supplier of silicone parts for the aerospace, medical and pharmaceutical industries. We specialize in high volume liquid silicone injection-molded rubber parts, short run-prototype silicone parts, and over-molding of silicone onto plastic. We also process a wide range of compounds such as solid silicone, HCR/HTV/LSR and other elastomer types</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Silicone Molding Section */}
      <section className="silicone-molding-industries-section">
        <div className="silicone-industries-grid">
          {/* LSR Molding */}
          <div className="silicone-lsr-molding">
            <a href="#lsr-molding" className="silicone-industry-card-link">
              <div className="silicone-industry-image-container rounded-[6px]">
                <img
                  decoding="auto"
                  loading="lazy"
                  width="2400"
                  height="2400"
                  src="/assets/images/lsr-molding.jpg"
                  alt="LSR Molding"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <button className="silicone-industry-button bg-white rounded-[4px] text-[#08222B] transition-colors">
                <span className="silicone-industry-button-text">LSR Molding</span>
                <img src="/assets/images/arrow-icon.svg" alt="" className="w-6 h-6" />
              </button>
            </a>
          </div>

          {/* HCR Molding */}
          <div className="silicone-hcr-molding">
            <a href="#hcr-molding" className="silicone-industry-card-link">
              <div className="silicone-industry-image-container rounded-[6px]">
                <img
                  decoding="auto"
                  loading="lazy"
                  width="4000"
                  height="3000"
                  src="/assets/images/hcr-molding.jpg"
                  alt="HCR Molding"
                  className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                />
              </div>
              <button className="silicone-industry-button bg-white rounded-[4px] text-[#08222B] transition-colors">
                <span className="silicone-industry-button-text">HCR Molding</span>
                <img src="/assets/images/arrow-icon.svg" alt="" className="w-6 h-6" />
              </button>
            </a>
          </div>

          {/* Heading Section */}
          <div className="silicone-industry-heading-section">
            <div className="silicone-industry-heading-section-left">
              <h3 className="silicone-industry-heading-text text-[#08222B]">Silicone</h3>
            </div>
            <div className="industry-heading-section-right">
              <h3 className="industry-heading-text-italic text-[#08222B] text-right"> Molding</h3>
            </div>
          </div>

          {/* 2K Molding */}
          <div className="silicone-2k-molding">
            <a href="#2k-molding" className="silicone-industry-card-link">
              <div className="silicone-industry-image-container rounded-[6px]">
                <img
                  decoding="auto"
                  loading="lazy"
                  width="1920"
                  height="1280"
                  src="/assets/images/2k-molding.jpg"
                  alt="2K Molding"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <button className="silicone-industry-button bg-white rounded-[4px] text-[#08222B] transition-colors">
                <span className="silicone-industry-button-text">2K Molding</span>
                <img src="/assets/images/arrow-icon.svg" alt="" className="w-6 h-6" />
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Molding Details Section */}
      <section className="silicone-industries-details-section">
        {/* Navigation Container */}
        <div className="silicone-industries-nav-container">
          <div className="silicone-nav-container">
            <nav className="silicone-industries-nav">
              <div className={`silicone-industries-nav-item ${activeSection === 'lsr-molding' ? 'active' : ''}`}>
                <a href="#lsr-molding">LSR Molding</a>
                <div className="silicone-industries-nav-line"></div>
              </div>
              <div className={`silicone-industries-nav-item ${activeSection === 'hcr-molding' ? 'active' : ''}`}>
                <a href="#hcr-molding">HCR Molding</a>
                <div className="silicone-industries-nav-line"></div>
              </div>
              <div className={`silicone-industries-nav-item ${activeSection === '2k-molding' ? 'active' : ''}`}>
                <a href="#2k-molding">2K Molding</a>
                <div className="silicone-industries-nav-line"></div>
              </div>
            </nav>
          </div>
        </div>

        <div className="mx-auto">
          {/* LSR Molding */}
          <div id="lsr-molding" ref={sectionRefs['lsr-molding']} className="silicone-industry-detail-aerospace scroll-mt-24">
            <div className="silicone-detail-inner">
              <h3 className="silicone-industry-detail-heading">LSR Molding</h3>
              <div className="silicone-industry-detail-divider"></div>
              <div className="silicone-industry-detail-grid">
                <figure className="silicone-industry-detail-figure">
                  <img
                    decoding="auto"
                    loading="lazy"
                    width="1920"
                    height="2918"
                    src="/assets/images/lsr-molding.jpg"
                    alt="LSR Molding"
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="silicone-injection-inner-content">
                  <h3 className="silicone-molding-subheading">Liquid Silicone Rubber - LSR molding </h3>
                  {/* <h3 className="silicone-molding-subheading-italic">Precision molding for medical and industrial applications </h3> */}
                  <p className="silicone-industry-detail-description">
                    Liquid Silicone Rubber is a thermoset material and though a versatile, widely used material, it is a difficult material to process due to its low viscosity and its tendency to "flash" in even the smallest of gap. Aiming for the highest quality in LSR components, Laxmi takes a holistic approach to the engineering of component, tooling and overall process. The manufacture of 120 molds has provided Laxmi with the experience and capability to build molds for a variety of LSR components of varied geometry. We understand and apply our knowledge of how to process LSR. The parts we manufacture have applications ranging from drug delivery such as primary drug packaging or wearable smart drug pump systems, fluid management, diagnostics, to biotechnology. We support high production volumes that feature: - “Flash-less” molding</p>
                  <div className="silicone-industry-detail-items-container">
                    <div className="silicone-industry-detail-item">
                      <div className="silicone-industry-detail-item-divider"></div>
                      <ul>
                        <li>Complex part geometry</li>
                        <li>Fast curing cycles</li>
                        <li>Class 8 clean room</li>
                        <li>Available press sizes: 20 - 80 Tons</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* HCR Molding */}
          <div id="hcr-molding" ref={sectionRefs['hcr-molding']} className="silicone-industry-detail-aerospace silicone-industry-detail-white scroll-mt-24">
            <div className="silicone-detail-inner">
              <h3 className="silicone-industry-detail-heading">HCR Molding</h3>
              <div className="silicone-industry-detail-divider"></div>
              <div className="silicone-industry-detail-grid">
                <figure className="silicone-industry-detail-figure">
                  <img
                    decoding="auto"
                    loading="lazy"
                    width="2400"
                    height="3600"
                    src="/assets/images/hcr-molding.jpg"
                    alt="HCR Molding"
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="silicone-injection-inner-content">
                  <h3 className="silicone-molding-subheading">High Consistency Rubber - HCR molding  </h3>
                  {/* <h3 className="silicone-molding-subheading-italic">Precision molding for medical and industrial applications </h3> */}
                  <p className="silicone-industry-detail-description">Laxmi understands the special considerations required to manufacture quality HCR silicone injection molded parts as it poses unique challenges compared to organic polymer-based rubber compounds. A wide array of colorings is possible. Our capabilities include: -</p>
                  <div className="silicone-industry-detail-items-container">
                    <div className="silicone-industry-detail-item">
                      <div className="silicone-industry-detail-item-divider"></div>
                      <ul>
                        <li>Low to moderate production volumes</li>
                        <li>Compression and transfer molding</li>
                        <li>White room molding</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2K Molding */}
          <div id="2k-molding" ref={sectionRefs['2k-molding']} className="silicone-industry-detail-aerospace scroll-mt-24">
            <div className="silicone-detail-inner">
              <h3 className="silicone-industry-detail-heading">2K Molding</h3>
              <div className="silicone-industry-detail-divider"></div>
              <div className="silicone-industry-detail-grid">
                <figure className="silicone-industry-detail-figure">
                  <img
                    decoding="auto"
                    loading="lazy"
                    width="3213"
                    height="4016"
                    src="/assets/images/2k-molding.jpg"
                    alt="2K Molding"
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="silicone-injection-inner-content">
                  <h3 className="silicone-molding-subheading">2-Component Parts or Over-molded Parts - 2K molding </h3>
                  <p className="silicone-industry-detail-description">We have experience with 2-component parts or overmolding silicone onto plastic parts. Through a highly specialized and automated process we carefully control the injection of multiple materials, including two different kinds of resin, into a single, multi-chambered mold.</p>
                  <div className="silicone-industry-detail-items-container">
                    <div className="silicone-industry-detail-item">
                      <div className="silicone-industry-detail-item-divider"></div>
                      <ul>
                        <li>LSR-to-Plastic</li>
                        <li>Plastic-to-Plastic</li>
                        <li>Multiple color combinations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Evolving into a world-class Tool Maker Section */}
      <section className="silicone-about-us-vision-section">
        <div className="silicone-about-us-vision-container">
          <div className="silicone-about-us-vision-content">
            {/* Title */}
            <div className="silicone-about-us-vision-title">
              <h3>Accredited Quality</h3>
            </div>

            {/* Description */}
            <div className="silicone-about-us-vision-description">
              <p>
                Since 1983, Laxmi has expanded its silicone molding capabilities, focusing on precision manufacturing and quality excellence. Our facilities, cleanroom infrastructure, advanced technology, and quality processes have been continuously enhanced to meet the demanding requirements of silicone molding applications.
              </p>
            </div>
          </div>

          {/* Divider Line */}
          <div className="silicone-about-us-vision-divider">
            <div className="silicone-about-us-vision-line"></div>
          </div>

          {/* Image and Text Section */}
          <div className="silicone-iso-certifications-container">
            <div className="silicone-iso-certifications-grid">
              {/* ISO 9001:2015 */}
              <div
                className="silicone-iso-cert-badge"
                onClick={() => {
                  setSelectedCert('iso-9001');
                  setIsModalOpen(true);
                  setIsSubmitted(false);
                }}
              >
                <div className="silicone-iso-cert-badge-content">
                  <h3 className="silicone-iso-cert-title">ISO</h3>
                  <p className="silicone-iso-cert-subtitle">9001:2015</p>
                </div>
              </div>

              {/* ISO 13485:2016 */}
              <div
                className="silicone-iso-cert-badge"
                onClick={() => {
                  setSelectedCert('iso-13485');
                  setIsModalOpen(true);
                  setIsSubmitted(false);
                }}
              >
                <div className="silicone-iso-cert-badge-content">
                  <h3 className="silicone-iso-cert-title">ISO</h3>
                  <p className="silicone-iso-cert-subtitle">13485:2016</p>
                </div>
              </div>

              {/* AS 9100 D */}
              <div
                className="silicone-iso-cert-badge"
                onClick={() => {
                  setSelectedCert('as-9100');
                  setIsModalOpen(true);
                  setIsSubmitted(false);
                }}
              >
                <div className="silicone-iso-cert-badge-content">
                  <h3 className="silicone-iso-cert-title">AS</h3>
                  <p className="silicone-iso-cert-subtitle">9100 D</p>
                </div>
              </div>

              {/* UL */}
              <div
                className="silicone-iso-cert-badge"
                onClick={() => {
                  setSelectedCert('ul');
                  setIsModalOpen(true);
                  setIsSubmitted(false);
                }}
              >
                <div className="silicone-iso-cert-badge-content">
                  <h3 className="silicone-iso-cert-title">UL</h3>
                  <p className="silicone-iso-cert-subtitle">Traceability<br />File# 251071</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Let's Build the Future Together Section */}
      <section className="silicone-about-us-cta-section">
        <div className="silicone-about-us-cta-bg">
          <figure className="silicone-about-us-cta-bg-image">
            <img
              src="/assets/images/nlflIYUFxh7GOy9fpoBBBlTAkMo.webp"
              alt="Let's Build the Future Together"
              className="w-full h-full object-cover"
            />
          </figure>
        </div>

        <div className="silicone-about-us-cta-container">
          <div className="silicone-about-us-cta-content">
            {/* Title */}
            <div className="silicone-about-us-cta-title">
              <div className="silicone-about-us-cta-title-line1">
                <h3>Let's build the</h3>
              </div>
              <div className="silicone-about-us-cta-title-line2">
                <h3>Future</h3>
                <h3>Together</h3>
              </div>
            </div>

            {/* Divider Line */}
            <div className="silicone-about-us-cta-divider">
              <div className="silicone-about-us-cta-line"></div>
            </div>

            {/* Image and Text Block */}
            <div className="silicone-about-us-cta-image-text">
              <figure className="silicone-about-us-cta-image">
                <img
                  src="/assets/images/help-bring.jpg"
                  alt="Let's Build the Future Together"
                  className="w-full h-full object-cover"
                />
              </figure>

              <div className="silicone-about-us-cta-text-block">
                <div className="silicone-about-us-cta-description">
                  <p>We believe in long-term partnerships and shared innovation. Contact us to explore how our silicone molding expertise can help bring your most ambitious projects to life.</p>
                </div>

                {/* CTA Button */}
                <div className="silicone-about-us-cta-button-container">
                  <a href="./contact-us" className="silicone-about-us-cta-button">
                    <div className="silicone-about-us-cta-button-content">
                      <div className="silicone-about-us-cta-button-text">
                        <p>Request a Quote</p>
                      </div>
                      <div className="silicone-about-us-cta-button-icon">
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
        <div className="silicone-cert-modal-overlay" onClick={closeModal}>
          <div className="silicone-cert-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="silicone-cert-modal-close" onClick={closeModal} aria-label="Close modal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="silicone-cert-modal-content">
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

                  <form className="silicone-cert-form" onSubmit={handleSubmit}>
                    <div className="silicone-cert-form-row">
                      <div className="silicone-cert-form-field silicone-cert-form-field-half">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className={`silicone-cert-form-input ${formErrors.name ? 'error' : ''}`}
                          placeholder="Name *"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                        {formErrors.name && (
                          <span className="silicone-cert-form-error">{formErrors.name}</span>
                        )}
                      </div>

                      <div className="silicone-cert-form-field silicone-cert-form-field-half">
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          className="silicone-cert-form-input"
                          placeholder="Phone"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          maxLength="10"
                        />
                      </div>
                    </div>

                    <div className="silicone-cert-form-row">
                      <div className="silicone-cert-form-field silicone-cert-form-field-half">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className={`silicone-cert-form-input ${formErrors.email ? 'error' : ''}`}
                          placeholder="Email Id *"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                        {formErrors.email && (
                          <span className="silicone-cert-form-error">{formErrors.email}</span>
                        )}
                      </div>

                      <div className="silicone-cert-form-field silicone-cert-form-field-half">
                        <input
                          type="text"
                          id="organisationName"
                          name="organisationName"
                          className={`silicone-cert-form-input ${formErrors.organisationName ? 'error' : ''}`}
                          placeholder="Organisation Name *"
                          value={formData.organisationName}
                          onChange={handleInputChange}
                          required
                        />
                        {formErrors.organisationName && (
                          <span className="silicone-cert-form-error">{formErrors.organisationName}</span>
                        )}
                      </div>
                    </div>

                    <div className="silicone-cert-form-row">
                      <div className="silicone-cert-form-field silicone-cert-form-field-half">
                        <input
                          type="text"
                          id="city"
                          name="city"
                          className={`silicone-cert-form-input ${formErrors.city ? 'error' : ''}`}
                          placeholder="City *"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                        {formErrors.city && (
                          <span className="silicone-cert-form-error">{formErrors.city}</span>
                        )}
                      </div>

                      <div className="silicone-cert-form-field silicone-cert-form-field-half">
                        <input
                          type="text"
                          id="state"
                          name="state"
                          className={`silicone-cert-form-input ${formErrors.state ? 'error' : ''}`}
                          placeholder="State *"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        />
                        {formErrors.state && (
                          <span className="silicone-cert-form-error">{formErrors.state}</span>
                        )}
                      </div>
                    </div>

                    <div className="silicone-cert-form-submit-container">
                      <button
                        type="submit"
                        className="silicone-cert-form-submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Submit'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="silicone-cert-form-success">
                  <h3>Thank You!</h3>
                  <p>Your form has been submitted successfully. The certification PDF should start downloading automatically.</p>
                  <button
                    className="silicone-cert-form-submit"
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

export default SiliconeMolding;
