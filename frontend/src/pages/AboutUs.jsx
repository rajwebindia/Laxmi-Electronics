import { useEffect, useRef, useState } from 'react';

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

const AboutUs = () => {
  const fadeInRefs = useRef([]);
  const slideUpRefs = useRef([]);
  const imageFigureRef = useRef(null);
  const [selectedMember, setSelectedMember] = useState(null);

  // Counter animations for stats
  const count15 = useCounter(15, 2000);
  const count40 = useCounter(40, 2000);
  const count230 = useCounter(230, 2000);

  // const teamMembers = [
  //   {
  //     id: 1,
  //     name: 'John Anderson Doe',
  //     position: 'CEO',
  //     description: 'John leads Omnis with strategic vision and deep expertise in advanced materials. His leadership drives innovation and excellence across all operations.',
  //     linkedin: 'https://www.linkedin.com/in/johndoe/',
  //     image: 'https://framerusercontent.com/images/VoU3qboba5ygSydAYfgXdnJE.jpg',
  //     imageBase: 'https://framerusercontent.com/images/VoU3qboba5ygSydAYfgXdnJE.jpg'
  //   },
  //   {
  //     id: 2,
  //     name: 'Jane Baptista',
  //     position: 'Operations Director',
  //     description: 'Jane oversees all aspects of Omnis\' production, ensuring seamless workflows and precision at every stage. With a strong background in engineering and manufacturing processes, he optimizes efficiency, quality, and scalability. His expertise in advanced forming technologies and supply chain management helps deliver high-performance solutions that meet the strictest industry demands.',
  //     linkedin: 'https://www.linkedin.com/in/joaoduartebarbosa/',
  //     image: 'https://framerusercontent.com/images/jxqVcu1HwOUNecs9g53IU7QJa3c.jpg',
  //     imageBase: 'https://framerusercontent.com/images/jxqVcu1HwOUNecs9g53IU7QJa3c.jpg'
  //   },
  //   {
  //     id: 3,
  //     name: 'Angel Mango',
  //     position: 'Strategist Director',
  //     description: 'Angel drives strategic initiatives and market development at Omnis. With extensive experience in business strategy and client relations, he helps shape the future of advanced manufacturing.',
  //     linkedin: 'https://www.linkedin.com/in/angelmango/',
  //     image: 'https://framerusercontent.com/images/gKNTvjSkd4abZzoqiD2tazwMxnk.jpg',
  //     imageBase: 'https://framerusercontent.com/images/gKNTvjSkd4abZzoqiD2tazwMxnk.jpg'
  //   }
  // ];

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

  // Parallax scroll effect for image section
  useEffect(() => {
    const handleScroll = () => {
      if (!imageFigureRef.current) return;

      const section = document.getElementById('img-trigger');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate when section is in viewport
      if (rect.top < windowHeight && rect.bottom > 0) {
        const scrollProgress = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight));
        const scale = 1 + (scrollProgress * 0.2725); // Scale from 1 to 1.2725
        imageFigureRef.current.style.transform = `scale(${scale})`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedMember]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 rounded-none">
          <img
            src="/assets/images/about-us-banner-1.jpg"
            alt="About Us Banner"
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
                  Your<br />one-stop
                </h2>
                <h2 className="about-us-hero-subtitle text-white whitespace-normal sm:whitespace-nowrap reveal-text delay-300">
                  Solution
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
                    Laxmi is a full services manufacturer of silicone and plastic, injection molds and components. At our state-of-the-art manufacturing facilities in Bangalore, we deploy the latest technology and top-of-the-line systems that allow us to seamlessly integrate with your production strategy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Expertise Section */}
      <section className="relative w-full py-20 md:py-32 lg:py-40 px-4 sm:px-6 md:px-8 lg:px-[48px] bg-white">
        <div className=" mx-auto">
         

          {/* Pyramid Shape Decoration */}
          <figure className="about-us-pyramid-shape reveal reveal-scale delay-300">
            <img
              decoding="auto"
              loading="lazy"
              width="375"
              height="410"
              sizes=""
              srcSet="/assets/images/sap-s.png"
              src="/assets/images/sap-s.png"
              alt="History"
              className="reveal-image"
            />
          </figure>

           

          {/* Our Expertise Header and Description - Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
            {/* Left Side - Tag */}
            <div className="flex flex-col items-start reveal reveal-up delay-100">
              {/* Divider Line */}
              <div className="mb-2 flex justify-start">
                <div className="h-px w-20 bg-[#9CAEAF] reveal-line delay-200"></div>
              </div>
              <p className="text-[#08222B] text-sm font-semibold uppercase tracking-wider reveal-text delay-300">
                Our Expertise
              </p>
            </div>

            {/* Right Side - Description */}
            <div className="reveal reveal-up delay-200">
              <h6 className="text-[#08222B] text-xl md:text-2xl font-light leading-relaxed reveal-text delay-300">
              Laxmi has a proven track record as an effective solution provider. Our major clients are from the medical, pharmaceutical, aviation, space and healthcare industries. We provide our customers with economic viability, engineering excellence, total quality management and certified manufacturing processes that enable a quick turnaround from design to production.

              </h6>
              <div className="mb-8 flex justify-start reveal reveal-up delay-400">
                <div className="full-divider-line reveal-line delay-500"></div>
              </div>
            
            {/* Stats List */}
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
              {/* Stat 1 */}
              <li
                className="text-center about-us-slide-up"
                ref={(el) => {
                  slideUpRefs.current[1] = el;
                  count15.ref.current = el;
                }}
              >
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-0">
                    <span className="about-us-stat-number">{count15.count}</span>
                    <div className="about-us-stat-symbol">+ million</div>
                  </div>
                  
                </div>
                <p className="about-us-stat-text">
                Production per month
                </p>
              </li>

              {/* Stat 2 */}
              <li
                className="text-center about-us-slide-up"
                ref={(el) => {
                  slideUpRefs.current[2] = el;
                  count40.ref.current = el;
                }}
              >
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-0">
                    <span className="about-us-stat-number">{count40.count}</span>
                    <div className="about-us-stat-symbol">+</div>
                  </div>
                  
                </div>
                <p className="about-us-stat-text">
                Active Customers
                </p>
              </li>

              {/* Stat 3 */}
              <li
                className="text-center about-us-slide-up"
                ref={(el) => {
                  slideUpRefs.current[3] = el;
                  count230.ref.current = el;
                }}
              >
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-0">
                    <span className="about-us-stat-number">{count230.count}</span>
                    {/* <div className="about-us-stat-symbol">%</div> */}
                  </div>
                  
                </div>
                <p className="about-us-stat-text">
                Employees
                </p>
              </li>
            </ul>
            </div>
          </div>




        </div>
      </section>

      

      {/* Why Laxmielectronics Section - Commented Out */}
      {false && (
      <section className="about-us-why-section">
        <figure className="about-us-why-shape">
          <div className="about-us-why-shape-wrapper">
            <img
              src="/assets/images/2oGOKoxie1i2rI0AiZYOaVk.svg"
              alt="Component shape"
              className="w-full h-full object-contain"
            />
          </div>
        </figure>

        <div className="about-us-why-content">
          <div className="about-us-why-image reveal reveal-up delay-200">
            <figure className="about-us-why-image-wrapper">
              <img
                src="/assets/images/why-banner.jpg"
                alt="Why Laxmielectronics"
                className="w-full h-full object-cover reveal-image"
              />
            </figure>
          </div>

          <div className="about-us-why-text">
            <div className="about-us-why-heading reveal reveal-up delay-100">
              <h3 className="reveal-text delay-200">Why</h3>
              <h3 className="reveal-text delay-300">
                <span className="about-us-why-heading-laxmi">LAXMI</span>{' '}
                <span className="about-us-why-heading-electronics">ELECTRONICS</span>
              </h3>
            </div>

            <ul className="about-us-why-list reveal-stagger">
              <li className="about-us-why-item reveal reveal-up delay-200">
                <div className="about-us-why-item-title">
                  <h5 className="reveal-text delay-300">Mission</h5>
                </div>
                <div className="about-us-why-item-text">
                  <p className="reveal-text delay-400">Deliver best in class products to customers seeking peak performance by providing standard and custom solutions</p>
                </div>
              </li>

              <li className="about-us-why-item reveal reveal-up delay-300">
                <div className="about-us-why-item-title">
                  <h5 className="reveal-text delay-400">Differentiators</h5>
                </div>
                <div className="about-us-why-item-text">
                  <p className="reveal-text delay-500">40+ years of industry experience In-house integration of mold building, part production & value addition Lean & efficient management & customer support</p>
                </div>
              </li>

              <li className="about-us-why-item reveal reveal-up delay-400">
                <div className="about-us-why-item-title">
                  <h5 className="reveal-text delay-500">Process</h5>
                </div>
                <div className="about-us-why-item-text">
                  <p className="reveal-text delay-600">QMS to ISO and AS Standards Signatory to UN Global Compact Ecovadis Silver recognition level in CSR Evaluation Program</p>
                </div>
              </li>

              <li className="about-us-why-item about-us-slide-up" ref={(el) => (slideUpRefs.current[8] = el)}>
                <div className="about-us-why-item-title">
                </div>
                <div className="about-us-why-item-text">
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      )}

      {/* Our company history Section */}
      <section className="about-us-vision-section">
        <div className="about-us-vision-container">
          <div className="about-us-vision-content">
            {/* Title */}
            <div className="about-us-vision-title reveal reveal-up delay-100">
              <h3 className="reveal-text delay-200">Company history at a glance</h3>
            </div>
            
            {/* Description */}
            <div className="about-us-vision-description reveal reveal-up delay-200">
              <p className="reveal-text delay-300">Since 1983, Laxmi has added to its portfolio of capabilities focusing on being the one-stop for precision molding. Our facilities, machining infrastructure, technology, quality processes and human resources have been augmented to meet customer needs.</p>
            </div>
          </div>

          {/* Divider Line */}
          <div className="about-us-vision-divider reveal reveal-up delay-300">
            <div className="about-us-vision-line reveal-line delay-400"></div>
          </div>

          {/* Image and Text Section */}
          <div className="about-us-vision-image-text">
            <div className="about-us-vision-image-wrapper">
              <figure className="about-us-vision-image">
                {/* Mobile Image */}
                <img
                  decoding="auto"
                  loading="lazy"
                  src="/assets/images/History.png"
                  alt="Business Focus"
                  className="about-us-vision-mobile-image block md:hidden w-full h-full object-cover"
                />
                {/* Desktop Image */}
                <img
                  decoding="auto"
                  loading="lazy"
                  width="2048"
                  height="703"
                  sizes=""
                  srcSet="/assets/images/History-Horizontal-2025.png 2048w"
                  src="/assets/images/History-Horizontal-2025.png"
                  alt="Business Focus"
                  className="about-us-vision-desktop-image hidden md:block w-full h-full object-cover"
                />
                {/* Mobile Image */}
                <img
                  decoding="auto"
                  loading="lazy"
                  src="/assets/images/Business-Focus-Vertical-2026-m.png"
                  alt="Business Focus"
                  className="about-us-vision-mobile-image block md:hidden w-full h-full object-cover"
                />
                {/* Desktop Image */}
                <img
                  decoding="auto"
                  loading="lazy"
                  width="2048"
                  height="703"
                  sizes=""
                  srcSet="/assets/images/Business-Focus-Horizontal-2026-d.png 2048w"
                  src="/assets/images/Business-Focus-Horizontal-2026-d.png"
                  alt="Business Focus"
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

export default AboutUs;

