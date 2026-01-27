import { useState, useEffect, useRef } from 'react';

const MoldMaking = () => {
  const [activeSection, setActiveSection] = useState('electrical-electronics');
  const sectionRefs = {
    'electrical-electronics': useRef(null),
    'pharmaceutical-molding': useRef(null),
    'medical-equipment-devices': useRef(null),
    'aerospace-industry': useRef(null),
    'writing-instruments': useRef(null),
    'caps-closures': useRef(null),
    'fast-moving-consumer-goods': useRef(null),
    industrial: useRef(null),
  };

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

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] md:min-h-[650px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/assets/images/mold-making-banner.jpg"
            alt="Mold Making Banner"
            className="block w-full h-full object-cover object-center reveal-image"
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
                <div className="w-full reveal reveal-up delay-100">
                  <h1 className="mold-making-industries text-white text-left reveal-text delay-200">
                    <span className="whitespace-nowrap">Engineering</span>
                  </h1>
                </div>
                {/* "We serve" - Full width, right aligned */}
                <div className="w-full reveal reveal-up delay-200">
                  <h1 className="mold-making-we-serve text-white text-right reveal-text delay-300">
                    <span className="whitespace-nowrap">Design</span>
                  </h1>
                </div>
              </div>

              {/* Subtitle and Description */}
              <div className="mt-12">


                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                  {/* Left Section - Subtitle */}
                  <div className="reveal reveal-up delay-200">
                    <p className="mold-making-subtitle text-white reveal-text delay-300">
                      <span className="whitespace-nowrap">Leading Precision </span><br />
                      <span className="whitespace-nowrap">Mold Maker Since 1983</span>
                    </p>
                  </div>
                  <div>

                  </div>
                  {/* Right Section - Description */}
                  <div className="hero-description-container reveal reveal-left delay-300">
                    {/* Divider Line */}
                    <div className="w-full mb-6">
                      <div className="h-px mold-making-divider reveal-line delay-400"></div>
                    </div>
                    <p className="text-white text-base md:text-xl font-light leading-relaxed industry-detail-description-manrope reveal-text delay-500">
                      Laxmi commenced its mold manufacturing enterprise in 1983. The company deploys the latest technology to manufacture high-precision multi-cavity hot runner injection molds.
                    </p>
                    <p className="text-white text-base md:text-xl font-light leading-relaxed reveal-text delay-600">Our investments in top-of-the-line digitally driven manufacturing systems and quality management systems allows for continuous process improvements.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Design Section */}
      <section className="mold-making-industries-section">


        <div className="industries-grid">
          {/* Row 1 - Column 1: ENGINEERING title */}
          <div className="industry-heading-section reveal reveal-up delay-100">
            <div className="industry-heading-section-left">
              <h3 className="industry-heading-text text-[#08222B] reveal-text delay-200">Engineering</h3>
            </div>
          </div>
          
          {/* Row 1 - Column 2: Electrical & Electronics */}
          <div className="reveal reveal-scale delay-200">
            <a href="#electrical-electronics" className="industry-card-link">
              <div className="industry-image-container rounded-[6px]">
                <img
                  decoding="auto"
                  loading="lazy"
                  width="2400"
                  height="2400"
                  src="/assets/images/mold-making/electonic-electrics-thumbnail.jpg"
                  alt="Electrical & Electronics"
                  className="w-full h-full object-cover object-center reveal-image"
                />
              </div>
              <button className="industry-button bg-white rounded-[4px] text-[#08222B] transition-colors">
                <span className="industry-button-text">Electrical & Electronics</span>
                <img src="/assets/images/arrow-icon.svg" alt="" className="w-6 h-6" />
              </button>
            </a>
          </div>

          {/* Row 1 - Column 3: Pharmaceutical Molding */}
          <div className="reveal reveal-scale delay-300">
            <a href="#pharmaceutical-molding" className="industry-card-link">
              <div className="industry-image-container rounded-[6px]">
                <img
                  decoding="auto"
                  loading="lazy"
                  width="2400"
                  height="2400"
                  src="/assets/images/mold-making/mold-making-pharma.jpg"
                  alt="Pharmaceutical Molding"
                  className="w-full h-full object-cover object-center reveal-image"
                />
              </div>
              <button className="industry-button bg-white rounded-[4px] text-[#08222B] transition-colors">
                <span className="industry-button-text">Pharmaceutical Molding</span>
                <img src="/assets/images/arrow-icon.svg" alt="" className="w-6 h-6" />
              </button>
            </a>
          </div>

          {/* Row 2 - Column 1: Medical Devices */}
          <div className="reveal reveal-scale delay-400">
            <a href="#medical-equipment-devices" className="industry-card-link">
              <div className="industry-image-container rounded-[6px]">
                <img
                  decoding="auto"
                  loading="lazy"
                  width="4000"
                  height="3000"
                  src="/assets/images/mold-making/medical-device-thumbnail.jpg"
                  alt="Medical Equipment & Devices"
                  className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105 reveal-image"
                />
              </div>
              <button className="industry-button bg-white rounded-[4px] text-[#08222B] transition-colors">
                <span className="industry-button-text">Medical Devices</span>
                <img src="/assets/images/arrow-icon.svg" alt="" className="w-6 h-6" />
              </button>
            </a>
          </div>

          {/* Row 2 - Column 2: Aerospace Industry */}
          <div className="reveal reveal-scale delay-500">
            <a href="#aerospace-industry" className="industry-card-link">
              <div className="industry-image-container rounded-[6px]">
                <img
                  decoding="auto"
                  loading="lazy"
                  width="1920"
                  height="1277"
                  src="/assets/images/mold-making/aerospace-thumbnail.jpg"
                  alt="Aerospace Industry"
                  className="w-full h-full object-cover object-center reveal-image"
                />
              </div>
              <button className="industry-button bg-white rounded-[4px] text-[#08222B] transition-colors">
                <span className="industry-button-text">Aerospace Industry</span>
                <img src="/assets/images/arrow-icon.svg" alt="" className="w-6 h-6" />
              </button>
            </a>
          </div>

          {/* Row 2 - Column 3: Writing Instruments */}
          <div className="reveal reveal-scale delay-600">
            <a href="#writing-instruments" className="industry-card-link">
              <div className="industry-image-container rounded-[6px]">
                <img
                  decoding="auto"
                  loading="lazy"
                  width="1920"
                  height="1280"
                  src="/assets/images/mold-making/writing-instruments-thumbnail.jpg"
                  alt="Writing Instruments"
                  className="w-full h-full object-cover object-center reveal-image"
                />
              </div>
              <button className="industry-button bg-white rounded-[4px] text-[#08222B] transition-colors">
                <span className="industry-button-text">Writing Instruments</span>
                <img src="/assets/images/arrow-icon.svg" alt="" className="w-6 h-6" />
              </button>
            </a>
          </div>

          {/* Row 3 - Column 1: Caps and Closures */}
          <div className="reveal reveal-scale delay-400">
            <a href="#caps-closures" className="industry-card-link">
              <div className="industry-image-container rounded-[6px]">
                <img
                  decoding="auto"
                  loading="lazy"
                  width="2400"
                  height="1601"
                  src="/assets/images/mold-making/caps-closures-thumbnail.jpg"
                  alt="Caps and Closures"
                  className="w-full h-full object-cover object-center reveal-image"
                />
              </div>
              <button className="industry-button bg-white rounded-[4px] text-[#08222B] transition-colors">
                <span className="industry-button-text">Caps and Closures</span>
                <img src="/assets/images/arrow-icon.svg" alt="" className="w-6 h-6" />
              </button>
            </a>
          </div>

          {/* Row 3 - Column 2: FMCG */}
          <div className="reveal reveal-scale delay-500">
            <a href="#fast-moving-consumer-goods" className="industry-card-link">
              <div className="industry-image-container rounded-[6px]">
                <img
                  decoding="auto"
                  loading="lazy"
                  width="2400"
                  height="1600"
                  src="/assets/images/mold-making/fmcg-thumbnail.jpg"
                  alt="Fast Moving Consumer Goods"
                  className="w-full h-full object-cover object-center reveal-image"
                />
              </div>
              <button className="industry-button bg-white rounded-[4px] text-[#08222B] transition-colors">
                <span className="industry-button-text">FMCG</span>
                <img src="/assets/images/arrow-icon.svg" alt="" className="w-6 h-6" />
              </button>
            </a>
          </div>

          {/* Row 3 - Column 3: Design title */}
          <div className="industry-heading-section">
            <div className="industry-heading-section-right">
              <h3 className="industry-heading-text-italic text-[#08222B] text-right">Design</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Details Section */}
      <section className="industries-details-section">
        {/* Navigation Container */}
        <div className="industries-nav-container">
          <div className="nav-container">
            <nav className="industries-nav">
              <div className={`industries-nav-item ${activeSection === 'electrical-electronics' ? 'active' : ''}`}>
                <a href="#electrical-electronics">Electrical & Electronics</a>
                <div className="industries-nav-line"></div>
              </div>
              <div className={`industries-nav-item ${activeSection === 'pharmaceutical-molding' ? 'active' : ''}`}>
                <a href="#pharmaceutical-molding">Pharmaceutical Molding</a>
                <div className="industries-nav-line"></div>
              </div>
              <div className={`industries-nav-item ${activeSection === 'medical-equipment-devices' ? 'active' : ''}`}>
                <a href="#medical-equipment-devices">Medical Devices</a>
                <div className="industries-nav-line"></div>
              </div>
              <div className={`industries-nav-item ${activeSection === 'aerospace-industry' ? 'active' : ''}`}>
                <a href="#aerospace-industry">Aerospace Industry</a>
                <div className="industries-nav-line"></div>
              </div>
              <div className={`industries-nav-item ${activeSection === 'writing-instruments' ? 'active' : ''}`}>
                <a href="#writing-instruments">Writing Instruments</a>
                <div className="industries-nav-line"></div>
              </div>
              <div className={`industries-nav-item ${activeSection === 'caps-closures' ? 'active' : ''}`}>
                <a href="#caps-closures">Caps and Closures</a>
                <div className="industries-nav-line"></div>
              </div>
              <div className={`industries-nav-item ${activeSection === 'fast-moving-consumer-goods' ? 'active' : ''}`}>
                <a href="#fast-moving-consumer-goods">FMCG</a>
                <div className="industries-nav-line"></div>
              </div>
            
            </nav>
          </div>
        </div>

        <div className="mx-auto">
          {/* Electrical & Electronics */}
          <div id="electrical-electronics" ref={sectionRefs['electrical-electronics']} className="industry-detail-aerospace scroll-mt-24 reveal reveal-up delay-100">
            <div className="detail-inner">
              <h3 className="industry-detail-heading reveal-text delay-200">Electrical & Electronics</h3>
              <div className="industry-detail-divider reveal-line delay-300"></div>
              <div className="industry-detail-grid">
                <figure className="industry-detail-figure reveal reveal-scale delay-400">
                  <img
                    decoding="auto"
                    loading="lazy"
                    width="1920"
                    height="2918"
                    src="/assets/images/mold-making/electrical-electronics.jpg"
                    alt="Electrical & Electronics"
                    className="w-full h-full object-cover reveal-image"
                  />
                </figure>
                <div className="inner-content reveal reveal-left delay-500">
                  <p className="industry-detail-description reveal-text delay-600">
                  Electrical and electronic molds for injection molding, involve both cold and hut runner technologies for thermoplastic or thermoset materials. Laxmi manufactures high precision-engineered molds to form parts that meet stringent electrical insulation, mechanical strength, and dimensional accuracy requirements.

                  </p>
                  <p className="industry-detail-description reveal-text delay-700">
                  The benefits of electrical plastic molding include cost-efficiency, high precision and consistency, material versatility, design flexibility, lightweight durability, and electrical insulation. These advantages make electrical plastic molding a preferred choice for electronics manufacturers worldwide.

                  </p>
                  <p className="industry-detail-description industry-detail-description-heading reveal-text delay-800">Common applications of electrical and electronic molding include:
                  </p>
                  <ul className="industry-detail-bullet-list reveal-stagger">
                    <li className="reveal-text">Housings and Enclosures</li>
                    <li className="reveal-text">Connectors and Sockets</li>
                    <li className="reveal-text">Circuit Board Components</li>
                    <li className="reveal-text">Switches and Buttons</li>
                    <li className="reveal-text">Cable Management Systems</li>
                    <li className="reveal-text">Contactors</li>
                    <li className="reveal-text">Circuit Breakers</li>
                    <li className="reveal-text">Light Guides</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Pharmaceutical Molding */}
          <div id="pharmaceutical-molding" ref={sectionRefs['pharmaceutical-molding']} className="industry-detail-aerospace industry-detail-white scroll-mt-24 reveal reveal-up delay-100">
            <div className="detail-inner">
              <h3 className="industry-detail-heading reveal-text delay-200">Pharmaceutical Molding</h3>
              <div className="industry-detail-divider reveal-line delay-300"></div>
              <div className="industry-detail-grid">
                <figure className="industry-detail-figure reveal reveal-scale delay-400">
                  <img
                    decoding="auto"
                    loading="lazy"
                    width="1920"
                    height="2918"
                    src="/assets/images/mold-making/pharma-molding-1.jpg"
                    alt="Pharmaceutical Molding"
                    className="w-full h-full object-cover reveal-image"
                  />
                </figure>
                <div className="inner-content reveal reveal-left delay-500">
                  <p className="industry-detail-description reveal-text delay-600">
                  LAXMI is a Contract Development and Manufacturing Organization (CDMO) for industry-leading, multinational healthcare companies, global Original Equipment Manufacturers (OEMs), and emerging technology companies. It is one of the world's leading manufacturers of made-to-spec and specializes in the manufacture of precision micro-components, and sub-assemblies for the medical device industry. The company also manufactures a wide range of inhalation devices for leading pharmaceutical companies. with an in-house Mold Design and Development capability.
                 </p>
                  
                  <p className="industry-detail-description industry-detail-description-subheading reveal-text delay-700">Compliance:</p>
                  <ul className="industry-detail-bullet-list reveal-stagger">
                    <li className="reveal-text">Regulatory</li>
                    <li className="reveal-text">IQ/OQ/PQ</li>
                    <li className="reveal-text">Stability</li>
                    <li className="reveal-text">Performance</li>
                  </ul>

                  
                </div>
              </div>
            </div>
          </div>

          {/* Medical Equipment & Devices */}
          <div id="medical-equipment-devices" ref={sectionRefs['medical-equipment-devices']} className="industry-detail-aerospace industry-detail-white scroll-mt-24 reveal reveal-up delay-100">
            <div className="detail-inner">
              <h3 className="industry-detail-heading reveal-text delay-200">Medical Devices</h3>
              <div className="industry-detail-divider reveal-line delay-300"></div>
              <div className="industry-detail-grid">
                <figure className="industry-detail-figure reveal reveal-scale delay-400">
                  <img
                    decoding="auto"
                    loading="lazy"
                    width="2400"
                    height="3600"
                    src="/assets/images/mold-making/medical-equipment-devices.jpg"
                    alt="Medical Equipment & Devices"
                    className="w-full h-full object-cover reveal-image"
                  />
                </figure>
                <div className="inner-content reveal reveal-left delay-500">
                  <p className="industry-detail-description reveal-text delay-600">
                    Medical mold manufacture, for medical injection molding, is a critical manufacturing process used to produce precision components for the healthcare industry, ensuring compliance with stringent regulatory standards.
                  </p>
                  <p className="industry-detail-description reveal-text delay-700">
                    The process is essential for producing a wide range of medical products, including syringes, catheters, surgical instruments, and implantable devices. This process is often conducted in a cleanroom environment to minimize contamination, which is crucial for ensuring the safety and efficacy of medical devices.
                  </p>
                  <p className="industry-detail-description reveal-text delay-800">
                    Laxmi's Class 100,000 molding facility is ISO 13485 compliant, that provides a sterile, scalable manufacturing and assembly environment.
                  </p>
                  <ul className="industry-detail-bullet-list reveal-stagger">
                    <li className="reveal-text">Implantable medical devices that meet stringent biocompatibility standards.</li>
                    <li className="reveal-text">Surgical tools and precision components designed for longevity and high performance.</li>
                    <li className="reveal-text">Advanced diagnostic equipment using precision-engineered materials.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Aerospace Industry */}
          <div id="aerospace-industry" ref={sectionRefs['aerospace-industry']} className="industry-detail-aerospace scroll-mt-24 reveal reveal-up delay-100">
            <div className="detail-inner">
              <h3 className="industry-detail-heading reveal-text delay-200">Aerospace Industry</h3>
              <div className="industry-detail-divider reveal-line delay-300"></div>
              <div className="industry-detail-grid">
                <figure className="industry-detail-figure reveal reveal-scale delay-400">
                  <img
                    decoding="auto"
                    loading="lazy"
                    width="3213"
                    height="4016"
                    src="/assets/images/mold-making/aerospace-industry.jpg"
                    alt="Aerospace Industry"
                    className="w-full h-full object-cover reveal-image"
                  />
                </figure>
                <div className="inner-content reveal reveal-left delay-500">
                  <p className="industry-detail-description reveal-text delay-600">
                    LAXMI provides complete mold making solutions to commercial aviation and space sectors for thermoplastic, thermosetting, silicone and elastomer parts. Our comprehensive facility and in-house molding and tooling capabilities offer a single window for the aviation industry. Our molds for the aviation sector meet international quality standards, have a high mold life and can be customized as per specifications of clients.
                  </p>
                  
                  <p className="industry-detail-description industry-detail-description-subheading reveal-text delay-700">Quality and Regulatory Systems:</p>
                  <ul className="industry-detail-bullet-list reveal-stagger">
                    <li className="reveal-text">AS 9100D certified</li>
                    <li className="reveal-text">ISO 9001:2015 certified</li>
                  </ul>

                  <p className="industry-detail-description industry-detail-description-subheading-spaced reveal-text delay-800">Aviation and Space Industry Experience:</p>
                  <ul className="industry-detail-bullet-list reveal-stagger">
                    <li className="reveal-text">Connectors – Thermoset and Elastomer</li>
                    <li className="reveal-text">Lighting Systems – Thermoplastic</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Writing Instruments */}
          <div id="writing-instruments" ref={sectionRefs['writing-instruments']} className="industry-detail-aerospace industry-detail-white scroll-mt-24 reveal reveal-up delay-100">
            <div className="detail-inner">
              <h3 className="industry-detail-heading reveal-text delay-200">Writing Instruments</h3>
              <div className="industry-detail-divider reveal-line delay-300"></div>
              <div className="industry-detail-grid">
                <figure className="industry-detail-figure reveal reveal-scale delay-400">
                  <img
                    decoding="auto"
                    loading="lazy"
                    width="3715"
                    height="5577"
                    src="/assets/images/mold-making/writing-instruments.jpg"
                    alt="Writing Instruments"
                    className="w-full h-full object-cover reveal-image"
                  />
                </figure>
                <div className="inner-content reveal reveal-left delay-500">
                  <p className="industry-detail-description reveal-text delay-600">
                    Writing instrument mold manufacture involves the production of minute components for various writing instruments, including pens and pencils. The choice of material for a pen casing directly impacts its weight, strength, feel in hand, and overall longevity. Visual and tactile appeal plays a crucial role in consumer preference. Over-molding or co-injection molding, is a technique that enables the integration of two or more materials on to a single pen casing during one production cycle. This eliminates the need for secondary assembly steps and enhances both functionality and design complexity.
                  </p>
                  <p className="industry-detail-description reveal-text delay-700">
                    LAXMI will work with your team from design development to production, assembly and packaging to create high precision molds.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Caps and Closures */}
          <div id="caps-closures" ref={sectionRefs['caps-closures']} className="industry-detail-aerospace scroll-mt-24 reveal reveal-up delay-100">
            <div className="detail-inner">
              <h3 className="industry-detail-heading reveal-text delay-200">Caps and Closures</h3>
              <div className="industry-detail-divider reveal-line delay-300"></div>
              <div className="industry-detail-grid">
                <figure className="industry-detail-figure reveal reveal-scale delay-400">
                  <img
                    decoding="auto"
                    loading="lazy"
                    width="3504"
                    height="5256"
                    src="/assets/images/mold-making/caps-closeures.jpg"
                    alt="Caps and Closures"
                    className="w-full h-full object-cover reveal-image"
                  />
                </figure>
                <div className="inner-content reveal reveal-left delay-500">
                  <p className="industry-detail-description reveal-text delay-600">
                    Cap and closure mold making involves a range of technologies and processes to create the molds used in the production of caps and closures. Designing an optimal cap mold requires attention to ensuring a secure seal that is easy to open and incorporating tamper-evident features.
                  </p>
                  <p className="industry-detail-description industry-detail-description-subheading reveal-text delay-700">Innovations include:</p>
                  <ul className="industry-detail-bullet-list reveal-stagger">
                    <li className="reveal-text">Creating multi-cavity molds for increased production</li>
                    <li className="reveal-text">Utilizing robotics and automation for handling, quality control, and packaging</li>
                    <li className="reveal-text">In-mold labeling to streamline the production process</li>
                    <li className="reveal-text">Employing hot runner systems to maintain smooth plastic flow</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Fast Moving Consumer Goods */}
          <div id="fast-moving-consumer-goods" ref={sectionRefs['fast-moving-consumer-goods']} className="industry-detail-aerospace industry-detail-white scroll-mt-24 reveal reveal-up delay-100">
            <div className="detail-inner">
              <h3 className="industry-detail-heading reveal-text delay-200">FMCG</h3>
              <div className="industry-detail-divider reveal-line delay-300"></div>
              <div className="industry-detail-grid">
                <figure className="industry-detail-figure reveal reveal-scale delay-400">
                  <img
                    decoding="auto"
                    loading="lazy"
                    width="1920"
                    height="2880"
                    src="/assets/images/mold-making/mold-making-fmcg.jpg"
                    alt="Fast Moving Consumer Goods"
                    className="w-full h-full object-cover reveal-image"
                  />
                </figure>
                <div className="inner-content reveal reveal-left delay-500">
                  <p className="industry-detail-description reveal-text delay-600">
                  In the FMCG sector, mold making involves the manufacture of high-precision custom molds for injection molding and blow molding. We build high-cavitation multi-cavity injection molds for global customers. Our molds can be tailored to create a variety of shapes, sizes, and closure types. We work with a range of materials, ensuring that the packaging is not only visually appealing but also durable and compatible with the contents. Our molds are designed for high-speed production, enabling FMCG companies to meet market demands with ease.

                  </p>
                  {/* <p className="industry-detail-description" style={{ fontFamily: 'Manrope' }}>Our materials are used for:</p>
                  <div className="industry-detail-items-container">
                    <div className="industry-detail-item">
                      <div className="industry-detail-item-divider"></div>
                      <h6 className="industry-detail-item-heading">Protective armor solutions for military and law enforcement.</h6>
                    </div>
                    <div className="industry-detail-item">
                      <div className="industry-detail-item-divider"></div>
                      <h6 className="industry-detail-item-heading">Aerospace defense components that withstand high-impact and extreme environments.</h6>
                    </div>
                    <div className="industry-detail-item">
                      <div className="industry-detail-item-divider"></div>
                      <h6 className="industry-detail-item-heading">Specialized coatings and composites for enhanced durability and protection.</h6>
                    </div>
                  </div> */}
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
              <h3>Evolving into a <br />world-class Tool Maker</h3>
            </div>

            {/* Description */}
            <div className="about-us-vision-description">
              <p>
                Since 1983, Laxmi has added to its portfolio of capabilities focusing on being the one-stop for precision molding. Our facilities, machining infrastructure, technology, quality processes and human resources have been augmented to meet customer needs.
              </p>
            </div>
          </div>

          {/* Divider Line */}
          <div className="about-us-vision-divider">
            <div className="about-us-vision-line"></div>
          </div>

          {/* Image and Text Section */}
          <div className="about-us-vision-image-text">
            <div className="about-us-vision-image-wrapper">
              <figure className="about-us-vision-image">
                {/* Mobile Image */}
                <img
                  decoding="auto"
                  loading="lazy"
                  src="/assets/images/Toolroom.png"
                  alt="History"
                  className="about-us-vision-mobile-image block md:hidden w-full h-full object-cover"
                />
                {/* Desktop Image */}
                <img
                  decoding="auto"
                  loading="lazy"
                  width="2048"
                  height="703"
                  sizes=""
                  srcSet="/assets/images/Toolroom-Horizontal-2025.png 2048w"
                  src="/assets/images/Toolroom-Horizontal-2025.png"
                  alt="History"
                  className="about-us-vision-desktop-image hidden md:block w-full h-full object-cover"
                />
              </figure>
            </div>


          </div>
        </div>
      </section>
      {/* Let's Build the Future Together Section */}
      <section className="about-us-cta-section">
        <div className="about-us-cta-bg">
          <figure className="about-us-cta-bg-image">
            <img
              src="/assets/images/ler-us-background.jpg"
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
                  <p>We believe in long-term partnerships and shared innovation. Contact us to explore how our expertise can help bring your most ambitious projects to life.</p>
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
                          src="/assets/icons/arrow-right-white.svg"
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
    </div>
  );
};

export default MoldMaking;

