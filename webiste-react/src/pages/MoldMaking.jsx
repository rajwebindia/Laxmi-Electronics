import { useState, useEffect, useRef } from 'react';

const MoldMaking = () => {
  const [activeSection, setActiveSection] = useState('electrical-electronics');
  const sectionRefs = {
    'electrical-electronics': useRef(null),
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
            src="/assets/images/about-us-banner.jpg"
            alt="Mold Making Banner"
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
                    <span className="whitespace-nowrap">Engineering</span>
                  </h1>
                </div>
                {/* "We serve" - Full width, right aligned */}
                <div className="w-full">
                  <h1 className="mold-making-we-serve text-white text-right">
                    <span className="whitespace-nowrap">Design</span>
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
                      <span className="whitespace-nowrap">Leading Precision </span><br />
                      <span className="whitespace-nowrap">Mold Maker Since 1983</span>
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
                      Laxmi commenced its mold manufacturing enterprise in 1983. The company deploys the latest technology to manufacture high-precision multi-cavity hot runner injection molds.
                    </p>
                    <p className="text-white text-base md:text-xl font-light leading-relaxed">Our investments in top-of-the-line digitally driven manufacturing systems and quality management systems allows for continuous process improvements.</p>
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
          {/* Electrical & Electronics */}
          <div className="industry-aerospace">
            <a href="#electrical-electronics" className="industry-card-link">
              <div className="industry-image-container rounded-[6px]">
                <img
                  decoding="auto"
                  loading="lazy"
                  width="2400"
                  height="2400"
                  src="/assets/images/Electrical-Electronics.jpg"
                  alt="Electrical & Electronics"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <button className="industry-button bg-white rounded-[4px] text-[#08222B] transition-colors">
                <span className="industry-button-text">Electrical & Electronics</span>
                <img src="/assets/images/arrow-icon.svg" alt="" className="w-6 h-6" />
              </button>
            </a>
          </div>

          {/* Medical Equipment & Devices */}
          <div className="industry-energy">
            <a href="#medical-equipment-devices" className="industry-card-link">
              <div className="industry-image-container rounded-[6px]">
                <img
                  decoding="auto"
                  loading="lazy"
                  width="4000"
                  height="3000"
                  src="/assets/images/Medical-Equipment-Devices.jpg"
                  alt="Medical Equipment & Devices"
                  className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                />
              </div>
              <button className="industry-button bg-white rounded-[4px] text-[#08222B] transition-colors">
                <span className="industry-button-text">Medical Equipment & Devices</span>
                <img src="/assets/images/arrow-icon.svg" alt="" className="w-6 h-6" />
              </button>
            </a>
          </div>

          {/* Aerospace Industry */}
          <div className="industry-automotive">
            <a href="#aerospace-industry" className="industry-card-link">
              <div className="industry-image-container rounded-[6px]">
                <img
                  decoding="auto"
                  loading="lazy"
                  width="1920"
                  height="1277"
                  src="/assets/images/Aerospace-Industry.jpg"
                  alt="Aerospace Industry"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <button className="industry-button bg-white rounded-[4px] text-[#08222B] transition-colors">
                <span className="industry-button-text">Aerospace Industry</span>
                <img src="/assets/images/arrow-icon.svg" alt="" className="w-6 h-6" />
              </button>
            </a>
          </div>

          {/* Heading Section */}
          <div className="industry-heading-section">
            <div className="industry-heading-section-left">
              <h3 className="industry-heading-text text-[#08222B]">Engineering</h3>
            </div>
            <div className="industry-heading-section-right">
              <h3 className="industry-heading-text-italic text-[#08222B] text-right">Design</h3>
            </div>
          </div>


          {/* Writing Instruments */}
          <div className="industry-defense">
            <a href="#writing-instruments" className="industry-card-link">
              <div className="industry-image-container rounded-[6px]">
                <img
                  decoding="auto"
                  loading="lazy"
                  width="1920"
                  height="1280"
                  src="/assets/images/Writing-Instruments.jpg"
                  alt="Writing Instruments"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <button className="industry-button bg-white rounded-[4px] text-[#08222B] transition-colors">
                <span className="industry-button-text">Writing Instruments</span>
                <img src="/assets/images/arrow-icon.svg" alt="" className="w-6 h-6" />
              </button>
            </a>
          </div>

          {/* Caps and Closures */}
          <div className="industry-electronics">
            <a href="#caps-closures" className="industry-card-link">
              <div className="industry-image-container rounded-[6px]">
                <img
                  decoding="auto"
                  loading="lazy"
                  width="2400"
                  height="1601"
                  src="/assets/images/Caps-and-Closures.jpeg"
                  alt="Caps and Closures"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <button className="industry-button bg-white rounded-[4px] text-[#08222B] transition-colors">
                <span className="industry-button-text">Caps and Closures</span>
                <img src="/assets/images/arrow-icon.svg" alt="" className="w-6 h-6" />
              </button>
            </a>
          </div>

          {/* Fast Moving Consumer Goods */}
          <div className="industry-medical">
            <a href="#fast-moving-consumer-goods" className="industry-card-link">
              <div className="industry-image-container rounded-[6px]">
                <img
                  decoding="auto"
                  loading="lazy"
                  width="2400"
                  height="1600"
                  src="/assets/images/Fast-Moving-Consumer-Goods.jpg"
                  alt="Fast Moving Consumer Goods"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <button className="industry-button bg-white rounded-[4px] text-[#08222B] transition-colors">
                <span className="industry-button-text">Fast Moving Consumer Goods</span>
                <img src="/assets/images/arrow-icon.svg" alt="" className="w-6 h-6" />
              </button>
            </a>
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
              <div className={`industries-nav-item ${activeSection === 'medical-equipment-devices' ? 'active' : ''}`}>
                <a href="#medical-equipment-devices">Medical Equipment & Devices</a>
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
                <a href="#fast-moving-consumer-goods">Fast Moving Consumer Goods</a>
                <div className="industries-nav-line"></div>
              </div>
              {/* <div className={`industries-nav-item ${activeSection === 'industrial' ? 'active' : ''}`}>
              <a href="#industrial">Industrial & Science</a>
              <div className="industries-nav-line"></div>
            </div> */}
            </nav>
          </div>
        </div>

        <div className="mx-auto">
          {/* Electrical & Electronics */}
          <div id="electrical-electronics" ref={sectionRefs['electrical-electronics']} className="industry-detail-aerospace scroll-mt-24">
            <div className="detail-inner">
              <h3 className="industry-detail-heading">Electrical & Electronics</h3>
              <div className="industry-detail-divider"></div>
              <div className="industry-detail-grid">
                <figure className="industry-detail-figure">
                  <img
                    decoding="auto"
                    loading="lazy"
                    width="1920"
                    height="2918"
                    src="/assets/images/Electrical-Electronics.jpg"
                    alt="Electrical & Electronics"
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="inner-content">
                  <p className="industry-detail-description">
                    The aerospace and aviation industries demand high-performance materials that can withstand extreme temperatures, high pressure, and rigorous mechanical stress. Omnis supplies lightweight yet incredibly strong alloys, thermal-resistant composites, and precision-engineered components that improve efficiency, safety, and longevity in both commercial and defense aviation.
                  </p>
                  <p className="industry-detail-description" style={{ fontFamily: 'Manrope' }}>Our materials are used in:</p>
                  <div className="industry-detail-items-container">
                    <div className="industry-detail-item">
                      <div className="industry-detail-item-divider"></div>
                      <h6 className="industry-detail-item-heading">Aircraft structural components to enhance aerodynamics and reduce weight.</h6>
                    </div>
                    <div className="industry-detail-item">
                      <div className="industry-detail-item-divider"></div>
                      <h6 className="industry-detail-item-heading">Propulsion systems and engine parts that require extreme heat resistance.</h6>
                    </div>
                    <div className="industry-detail-item">
                      <div className="industry-detail-item-divider"></div>
                      <h6 className="industry-detail-item-heading">Thermal shielding materials for spacecraft and high-altitude applications.</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Equipment & Devices */}
          <div id="medical-equipment-devices" ref={sectionRefs['medical-equipment-devices']} className="industry-detail-aerospace industry-detail-white scroll-mt-24">
            <div className="detail-inner">
              <h3 className="industry-detail-heading">Medical Equipment & Devices</h3>
              <div className="industry-detail-divider"></div>
              <div className="industry-detail-grid">
                <figure className="industry-detail-figure">
                  <img
                    decoding="auto"
                    loading="lazy"
                    width="2400"
                    height="3600"
                    src="/assets/images/Medical-Equipment-Devices.jpg"
                    alt="Medical Equipment & Devices"
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="inner-content">
                  <p className="industry-detail-description">
                    The medical industry relies on biocompatible, sterilizable, and wear-resistant materials to manufacture life-saving devices and tools. At Omnis, we produce high-performance polymers and metals for surgical instruments, implantable devices, and diagnostic equipment, ensuring both patient safety and regulatory compliance.
                  </p>
                  <p className="industry-detail-description" style={{ fontFamily: 'Manrope' }}>Our expertise supports:</p>
                  <div className="industry-detail-items-container">
                    <div className="industry-detail-item">
                      <div className="industry-detail-item-divider"></div>
                      <h6 className="industry-detail-item-heading">Implantable medical devices that meet stringent biocompatibility standards.</h6>
                    </div>
                    <div className="industry-detail-item">
                      <div className="industry-detail-item-divider"></div>
                      <h6 className="industry-detail-item-heading">Surgical tools and precision components designed for longevity and high performance.</h6>
                    </div>
                    <div className="industry-detail-item">
                      <div className="industry-detail-item-divider"></div>
                      <h6 className="industry-detail-item-heading">Advanced diagnostic equipment using precision-engineered materials.</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Aerospace Industry */}
          <div id="aerospace-industry" ref={sectionRefs['aerospace-industry']} className="industry-detail-aerospace scroll-mt-24">
            <div className="detail-inner">
              <h3 className="industry-detail-heading">Aerospace Industry</h3>
              <div className="industry-detail-divider"></div>
              <div className="industry-detail-grid">
                <figure className="industry-detail-figure">
                  <img
                    decoding="auto"
                    loading="lazy"
                    width="3213"
                    height="4016"
                    src="/assets/images/Aerospace-Industry.jpg"
                    alt="Aerospace Industry"
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="inner-content">
                  <p className="industry-detail-description">
                    In the fast-evolving world of electronics and semiconductors, material purity and performance are critical to ensuring reliability and efficiency. Omnis provides high-purity ceramics, advanced polymers, and conductive materials that power modern electronics, from consumer devices to industrial-grade microelectronics.
                  </p>
                  <p className="industry-detail-description" style={{ fontFamily: 'Manrope' }}>Our materials are used in:</p>
                  <div className="industry-detail-items-container">
                    <div className="industry-detail-item">
                      <div className="industry-detail-item-divider"></div>
                      <h6 className="industry-detail-item-heading">Semiconductor fabrication with ultra-pure and high-precision materials.</h6>
                    </div>
                    <div className="industry-detail-item">
                      <div className="industry-detail-item-divider"></div>
                      <h6 className="industry-detail-item-heading">Electronic insulation and protective coatings to enhance durability.</h6>
                    </div>
                    <div className="industry-detail-item">
                      <div className="industry-detail-item-divider"></div>
                      <h6 className="industry-detail-item-heading">Micro-components with superior heat and electrical resistance.</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Writing Instruments */}
          <div id="writing-instruments" ref={sectionRefs['writing-instruments']} className="industry-detail-aerospace industry-detail-white scroll-mt-24">
            <div className="detail-inner">
              <h3 className="industry-detail-heading">Writing Instruments</h3>
              <div className="industry-detail-divider"></div>
              <div className="industry-detail-grid">
                <figure className="industry-detail-figure">
                  <img
                    decoding="auto"
                    loading="lazy"
                    width="3715"
                    height="5577"
                    src="/assets/images/Writing-Instruments.jpg"
                    alt="Writing Instruments"
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="inner-content">
                  <p className="industry-detail-description">
                    The energy sector requires resilient and high-performance materials to support power generation, transmission, and storage. Omnis develops corrosion-resistant, thermally stable, and high-strength components that contribute to the sustainability and efficiency of renewable and conventional energy solutions.
                  </p>
                  <p className="industry-detail-description" style={{ fontFamily: 'Manrope' }}>Key applications include:</p>
                  <div className="industry-detail-items-container">
                    <div className="industry-detail-item">
                      <div className="industry-detail-item-divider"></div>
                      <h6 className="industry-detail-item-heading">Wind and solar energy infrastructure, using lightweight and durable materials.</h6>
                    </div>
                    <div className="industry-detail-item">
                      <div className="industry-detail-item-divider"></div>
                      <h6 className="industry-detail-item-heading">Advanced thermal insulation for nuclear and high-temperature energy systems.</h6>
                    </div>
                    <div className="industry-detail-item">
                      <div className="industry-detail-item-divider"></div>
                      <h6 className="industry-detail-item-heading">Wear-resistant components for oil, gas, and geothermal operations.</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Caps and Closures */}
          <div id="caps-closures" ref={sectionRefs['caps-closures']} className="industry-detail-aerospace scroll-mt-24">
            <div className="detail-inner">
              <h3 className="industry-detail-heading">Caps and Closures</h3>
              <div className="industry-detail-divider"></div>
              <div className="industry-detail-grid">
                <figure className="industry-detail-figure">
                  <img
                    decoding="auto"
                    loading="lazy"
                    width="3504"
                    height="5256"
                    src="/assets/images/Caps-and-Closures.jpeg"
                    alt="Caps and Closures"
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="inner-content">
                  <p className="industry-detail-description">
                    The future of automotive and mobility solutions depends on lightweight, durable, and high-strength materials that improve vehicle performance, efficiency, and safety. Omnis provides advanced alloys, composites, and engineered polymers that enhance everything from electric vehicles to next-gen mobility solutions.
                  </p>
                  <p className="industry-detail-description" style={{ fontFamily: 'Manrope' }}>Our contributions include:</p>
                  <div className="industry-detail-items-container">
                    <div className="industry-detail-item">
                      <div className="industry-detail-item-divider"></div>
                      <h6 className="industry-detail-item-heading">Lightweight materials for structural and battery components in EVs.</h6>
                    </div>
                    <div className="industry-detail-item">
                      <div className="industry-detail-item-divider"></div>
                      <h6 className="industry-detail-item-heading">Wear-resistant and heat-tolerant materials for high-performance engines.</h6>
                    </div>
                    <div className="industry-detail-item">
                      <div className="industry-detail-item-divider"></div>
                      <h6 className="industry-detail-item-heading">High-strength composites for safety and aerodynamic performance.</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fast Moving Consumer Goods */}
          <div id="fast-moving-consumer-goods" ref={sectionRefs['fast-moving-consumer-goods']} className="industry-detail-aerospace industry-detail-white scroll-mt-24">
            <div className="detail-inner">
              <h3 className="industry-detail-heading">Fast Moving Consumer Goods</h3>
              <div className="industry-detail-divider"></div>
              <div className="industry-detail-grid">
                <figure className="industry-detail-figure">
                  <img
                    decoding="auto"
                    loading="lazy"
                    width="1920"
                    height="2880"
                    src="/assets/images/Fast-Moving-Consumer-Goods.jpg"
                    alt="Fast Moving Consumer Goods"
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="inner-content">
                  <p className="industry-detail-description">
                    The defense and security industries require rugged, high-performance materials that offer superior strength, protection, and reliability under extreme conditions. Omnis works with military-grade alloys, ballistic composites, and specialized coatings to enhance mission-critical defense applications.
                  </p>
                  <p className="industry-detail-description" style={{ fontFamily: 'Manrope' }}>Our materials are used for:</p>
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
                  </div>
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
                <img
                  decoding="auto"
                  loading="lazy"
                  width="2048"
                  height="703"
                  sizes=""
                  srcSet="/assets/images/Toolroom-Horizontal-2025.png 2048w"
                  src="/assets/images/Toolroom-Horizontal-2025.png"
                  alt="History"
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
    </div>
  );
};

export default MoldMaking;

