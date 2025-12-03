import { useState, useEffect, useRef } from 'react';

const AssemblyServices = () => {
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
            alt="Assembly Services Banner"
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
                    <span className="whitespace-nowrap">Assembly</span>
                  </h1>
                </div>
                {/* "We serve" - Full width, right aligned */}
                <div className="w-full">
                  <h1 className="mold-making-we-serve text-white text-right">
                    <span className="whitespace-nowrap">Services</span>
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
                      <span className="whitespace-nowrap">Product realization  </span><br />
                      <span className="whitespace-nowrap">through strategic partnering  </span>
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
                      Laxmi provides comprehensive assembly services, combining precision engineering with efficient production processes. Our state-of-the-art assembly facilities ensure high-quality product integration and timely delivery.
                    </p>
                    <p className="text-white text-base md:text-xl font-light leading-relaxed">Our skilled technicians and advanced assembly systems enable us to handle complex assemblies with precision, quality, and efficiency.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assembly Services Details Section */}
      <section className="assembly-services-details-section">
        <div className="mx-auto">
          {/* Consistent, full-life-cycle, integrated manufacturing */}
          <div id="electrical-electronics" ref={sectionRefs['electrical-electronics']} className="assembly-service-detail scroll-mt-24">
            <div className="assembly-detail-inner">
              <h3 className="assembly-detail-heading">Consistent, full-life-cycle, integrated manufacturing</h3>
              <div className="assembly-detail-divider"></div>
              <div className="assembly-detail-grid">
                <figure className="assembly-detail-figure">
                  <img
                    decoding="auto"
                    loading="lazy"
                    width="1920"
                    height="2918"
                    src="/assets/images/assembly-services.jpg"
                    alt="Assembly Services"
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="assembly-inner-content">
                  <p className="assembly-detail-description">LAXMI offers you a cutting-edge manufacturing facility without the burden of running your own plants.</p>
                  <p className="assembly-detail-item-heading" style={{ fontFamily: 'Manrope' }}>Consistent, Full Life-Cycle, Integrated Manufacturing</p>
                  <div className="assembly-detail-items-container">
                    <div className="assembly-detail-item">
                     
                      <p className="assembly-detail-description">We provide you with a comprehensive end-to-end contract manufacturing solution that consistently supports small, medium and high volumes through certified production processes and a world-class infrastructure.</p>
                    </div>
                    <div className="assembly-detail-item">
        
                      <p className="assembly-detail-description">We provide a full range of value-added services to support your strategic sourcing of standard and off-the-shelf components. These include flexibility, responsiveness and a commitment to do whatever it takes to meet ever-changing product requirements in the course of a life-cycle.</p>
                    </div>
                    
                  </div>
                  <div className="assembly-detail-items-container">
                    <p className="assembly-detail-item-heading" style={{ fontFamily: 'Manrope' }}>Capabilities Include</p>
                    <ul className="assembly-capabilities-list">
                      <li className="assembly-capability-item">Tampo Printing</li>
                      <li className="assembly-capability-item">Ultrasonic Welding</li>
                    </ul>
                  </div>
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

export default AssemblyServices;

