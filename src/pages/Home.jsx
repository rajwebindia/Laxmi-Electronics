import { useEffect, useRef, useState, useCallback } from 'react';

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Industry data - matching reference website images
  const industries = [
    { name: 'MEDICAL', image: '/assets/images/medical.jpg' },
    { name: 'AEROSPACE', image: '/assets/images/aero.jpg' },
    { name: 'WRITING INSTRUMENTS', image: '/assets/images/writing.jpg' },
    { name: 'ELECTRONICS', image: '/assets/images/electronics.jpg' },
    { name: 'ELECTRICAL', image: '/assets/images/electrical.jpg' },
    { name: 'PHARMA', image: '/assets/images/pharma.jpg' },
    { name: 'FMCG', image: '/assets/images/fmcg.jpg' },
  ];

  // ISO Certifications gallery data
  const isoCertifications = [
    { name: 'ISO 9100', image: '/assets/images/iso-9100.png' },
    { name: 'ISO 9001:2015', image: '/assets/images/9001-20015.png' },
    { name: 'UL Traceability', image: '/assets/images/ul-traceability.png' },
    { name: 'ISO 13485:2016', image: '/assets/images/13485-2016.png' },
  ];

  // Circular image slider data
  const circularImages = [
    { name: 'Technical Drawing', image: '/assets/images/40years.jpg' },
    { name: 'Operation Room', image: '/assets/images/one-stop.jpg' },
    { name: 'Competencies', image: '/assets/images/lean-efficient.jpg' },
    { name: 'Integrated Mold', image: '/assets/images/integrated-mold.jpg' },
    { name: 'Best in Class', image: '/assets/images/best-in-class.jpg' },
  ];

  // Initialize carousel scroll position and handle infinite scroll
  useEffect(() => {
    if (!carouselRef.current) return;

    const container = carouselRef.current;
    let timeoutId;
    let handleScroll;
    let isAdjusting = false;

    // Wait for cards to render, then calculate dimensions
    timeoutId = setTimeout(() => {
      const cards = container.querySelectorAll('.industry-carousel-card');
      if (cards.length === 0) return;

      const firstCard = cards[0];
      const cardWidth = firstCard.offsetWidth;
      const gap = 32;
      const scrollAmount = cardWidth + gap;
      const clonedItemsCount = 3;
      const originalItemsWidth = scrollAmount * industries.length;
      const startPosition = scrollAmount * clonedItemsCount;
      const endPosition = startPosition + originalItemsWidth;

      // Scroll to first original item (after cloned items)
      container.scrollLeft = startPosition;

      // Handle infinite scroll on scroll event
      handleScroll = () => {
        if (isAdjusting) return;

        const scrollLeft = container.scrollLeft;
        const threshold = scrollAmount * 0.5; // Half a card width threshold

        // If scrolled past the end (into cloned items at end), jump to beginning
        if (scrollLeft >= endPosition - threshold) {
          isAdjusting = true;
          requestAnimationFrame(() => {
            container.scrollLeft = startPosition + (scrollLeft - endPosition + threshold);
            isAdjusting = false;
          });
        }
        // If scrolled before the start (into cloned items at beginning), jump to end
        else if (scrollLeft <= startPosition - threshold) {
          isAdjusting = true;
          requestAnimationFrame(() => {
            const overscroll = startPosition - scrollLeft;
            container.scrollLeft = endPosition - threshold - overscroll;
            isAdjusting = false;
          });
        }
      };

      container.addEventListener('scroll', handleScroll, { passive: true });
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      if (handleScroll && container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [industries.length]);

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

  // Carousel navigation with infinite scroll - one item at a time
  const scrollCarousel = useCallback((direction) => {
    if (!carouselRef.current) return;

    const container = carouselRef.current;
    const cards = container.querySelectorAll('.industry-carousel-card');

    if (cards.length === 0) return;

    // Get the first visible card's width to calculate exact scroll amount
    const firstCard = cards[0];
    const cardWidth = firstCard.offsetWidth;
    const gap = 32;
    const scrollAmount = cardWidth + gap;
    const clonedItemsCount = 3;
    const originalItemsWidth = scrollAmount * industries.length;
    const startPosition = scrollAmount * clonedItemsCount;
    const endPosition = startPosition + originalItemsWidth;

    const currentScroll = container.scrollLeft;

    if (direction === 'next') {
      let targetScroll = currentScroll + scrollAmount;

      // If would scroll past the end, loop to beginning
      if (targetScroll >= endPosition - scrollAmount) {
        // Calculate how much we've overshot
        const overshoot = targetScroll - endPosition;
        // Jump to start and add the overshoot
        targetScroll = startPosition + overshoot;

        // Use requestAnimationFrame for smoother transition
        requestAnimationFrame(() => {
          container.scrollLeft = targetScroll;
          // Continue with smooth scroll
          requestAnimationFrame(() => {
            container.scrollTo({
              left: targetScroll + scrollAmount,
              behavior: 'smooth'
            });
          });
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

      // If would scroll before the start, loop to end
      if (targetScroll <= startPosition - scrollAmount) {
        // Calculate how much we've overshot backwards
        const overshoot = startPosition - targetScroll;
        // Jump to end and subtract the overshoot
        targetScroll = endPosition - overshoot;

        // Use requestAnimationFrame for smoother transition
        requestAnimationFrame(() => {
          container.scrollLeft = targetScroll;
          // Continue with smooth scroll
          requestAnimationFrame(() => {
            container.scrollTo({
              left: targetScroll - scrollAmount,
              behavior: 'smooth'
            });
          });
        });
        return;
      }

      // Normal backward scroll
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  }, [industries.length]);

  // Auto-scroll carousel
  useEffect(() => {
    // Clear any existing interval
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }

    // Only auto-scroll if not hovered
    if (!isCarouselHovered && scrollCarousel) {
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
  }, [isCarouselHovered, scrollCarousel]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden hero-section">
        {/* Background overlays to match Framer look */}
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full hero-ellipse-teal" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[520px] h-[520px] rounded-full hero-ellipse-yellow" />



        {/* Content */}
        <div className="relative z-20 w-full pt-24">
          <div className="max-w-[1200px] mx-auto px-[48px]">
            <div className="max-w-[1200px] mx-auto">
              <div className="space-y-2 text-left w-full md:w-4/5">
                <h1
                  className="text-white hero-heading text-right text-[90px] md:text-[90px] reveal reveal-up delay-100"
                >
                  Fast
                </h1>
                <h1
                  className="text-white hero-heading-turnaround text-right text-[120px] md:text-[120px] reveal reveal-up delay-300"
                >
                  Turnaround
                </h1>
                <h1
                  className="text-white hero-heading text-right text-[90px] md:text-[90px] reveal reveal-up delay-500"
                >
                  Production
                </h1>
              </div>
              {/* Right circular element with inline preview and border (under text) */}
              <div
                className="absolute right-6 md:right-24 top-1/3 -translate-y-1/2 z-10 cursor-pointer reveal reveal-left"
                onClick={openVideo}
                role="button"
                aria-label="Play video"
                title="Play video"
              >
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56">
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

              {/* Description and CTA moved to a separate section below */}
            </div>
            <div className="mt-8 reveal reveal-up delay-300">
              <div className="hero-desc-wrap mx-auto text-center">
                <p className="hero-desc text-white/95">
                  of injection  molded parts -
                  HCR, LSR, 2k, Plastic
                </p>
              </div>
              <div className="mt-6 flex justify-center">
                <a
                  href="/contact-us"
                  className="group inline-flex items-center gap-3 px-6 py-3 rounded-[4px] text-white btn-gradient font-bold cta-motion"
                >
                  Learn more
                  <img src="/assets/icons/arrow.svg" alt="" className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process & About (split image/text blocks) */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Block */}
          <div className="relative min-h-[520px] md:h-[800px] overflow-hidden">
            <img
              src="/assets/images/Competencies.jpg"
              alt="Scientist and solar panels"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
            <div className="relative z-10 h-full flex flex-col justify-between items-end px-[48px] py-[120px] flex-none">
              <div className="self-start">
                <h3 className="text-white heading-competencies"> COMPETENCIES</h3>
                <h3 className="text-white heading-competencies1">WE PROVIDE</h3>

              </div>
              <div className="mt-8 self-start">
                <a
                  href="/process"
                  className="inline-flex items-center gap-2 rounded-[4px] px-5 py-2 text-white border border-white/60 hover:bg-white/10 transition cta-motion"
                >
                  <span className="text-[13px] font-semibold uppercase tracking-[0.25px]"> Take a look at what we do</span>
                  <img src="/assets/icons/arrow.svg" alt="" className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Block */}
          <div className="relative min-h-[520px] md:h-[800px] overflow-hidden">
            <img
              src="/assets/images/one-stop-solution.jpg"
              alt="Ceramic Components"
              className="absolute inset-0 w-full h-full object-cover object-right-top"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(217deg, #fff 0%, rgba(255, 255, 255, 0.3) 100%)' }}
            />
            <div className="relative z-10 h-full flex flex-col justify-between items-end px-[48px] py-[120px] flex-none">
              <div className="mb-8 order-1 self-end">
                <a
                  href="/about-us"
                  className="inline-flex items-center gap-2 px-5 py-2 text-[#08222B] btn-outline-gradient-dark hover:bg-[#08222B]/5 transition cta-motion"
                >
                  <span className="text-[13px] font-semibold uppercase tracking-[0.25px]">Know more about us</span>
                  <img src="/assets/icons/info.svg" alt="" className="w-5 h-5" />
                </a>
              </div>
              <div className="text-right order-2 self-end">
                <h3 className="heading-onestop">YOUR ONE-STOP</h3>
                <h3 className="heading-onestop1">SOLUTION</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners you Can Trust Section - Omnis Design */}
      <section className="partners-trust-section py-40 px-[48px] reveal reveal-up" data-framer-name="Trustful Partners">
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
            <h3 className="partners-heading-you-can">A Partners</h3>
            <h3 className="partners-heading-you-can">You Can</h3>
            <h3 className="partners-heading-trust">Trust</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-12 md:gap-16 mb-16">
            {/* Left Side - Text Content */}
            <div> </div>
            <div className="partners-content-left">
              {/* First Paragraph */}
              <div className="partners-text-block">
              
                <p className="partners-text-laxmi">
                  LAXMI is a design based, full services leading manufacturer of
                  silicone and plastic injection molds and components. Our major
                  clients are from the Medical, Aviation, Space, and Healthcare
                  industries.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-12 md:gap-16 mb-16">
              {/* Second Paragraph */}
              <div className="partners-text-block">
                <div className="partners-desc-top-line"></div>
                <p className="partners-text-innovative">
                  We provide innovative,
                  high-performance solutions to
                  customers across critical
                  industries, ensuring precision
                  and reliability at every stage.</p>
              </div>

              {/* Third Paragraph */}
              <div className="partners-text-block">
                <div className="partners-desc-top-line"></div>
                <p className="partners-text-innovative">
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
          <div className="partners-image-stats-wrapper">
            <div className="partners-image-container">
              <img
                src="/assets/images/delivering-bg.jpg"
                alt="Wind towers on sea"
                className="w-full h-full object-cover"
              />
              <div className="partners-image-overlay"></div>

              {/* Content Over Image */}
              <div className="partners-image-content">
                {/* Top Section - Expertise Full Width */}
                <div className="partners-image-top-section">
                  {/* Our Expertise - Full Width */}
                  <div className="partners-expertise-section-fullwidth">
                    <div className="partners-expertise-tag-wrapper">
                      <p className="partners-expertise-tag"> Delivering best in class products</p>
                      <h4 className="partners-onestop-heading">Your one-stop solution</h4>
                    </div>
                    <div className="partners-desc-top-line"></div>
                  </div>

                  {/* Our Goal - Right */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-16 mb-16">
                    <div>

                    </div>
                    <div>
                      
                    </div>
                  <div className="partners-goal-section-right">
                    <p className="partners-expertise-tag">Our Goal</p>
                    <h6 className="partners-goal-heading"> Delivery of  best in class products to customers seeking 
peak performance by providing standard and custom 
solutions</h6>
                  </div>
                  </div>
                 
                </div>

                {/* Stats Grid - Bottom */}
                <ul className="partners-stats-grid">
                  <li className="partners-stat-item" ref={count75.ref}>
                    <div className="partners-stat-number-wrapper">
                      <span className="partners-stat-number">{count75.count}</span>
                      <span className="partners-stat-title">+</span>
                    <span className="partners-stat-title">Years</span>
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
                      <span className="partners-stat-title">million</span>
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
        className="relative py-40 px-[48px] overflow-hidden"
        style={{ background: 'linear-gradient(59deg, #e0e8eb 0%, #fff 100%)' }}
      >
        {/* Decorative component shape */}
        <img
          src="/assets/images/industies-served-1.svg"
          alt=""
          className="absolute top-0 right-0 w-[509px] h-[472px] hidden md:block opacity-100 z-0"
        />

        <div className="relative z-10 w-full">
          {/* Headings */}
          <div className="mb-12 reveal reveal-up px-[48px]">
            <p className="heading-industries-served">INDUSTRIES SERVED</p>
            <h3 className="heading-custom-solutions">CUSTOM</h3>
            <h3 className="heading-custom-solutions-italic">ENGINEERING SOLUTIONS</h3>
          </div>

          {/* Content with dividers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 reveal reveal-right px-[48px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 reveal reveal-right">
              <div className="max-w-4xl mx-auto space-y-12 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-1">
                  {/* Top line */}
                  <div className="partners-desc-top-line"></div>
                  <p className="industries-served-desc">
                    Across industries and manufacturing sectors, we deliver custom-engineered solutions for performance and precision.
                  </p>
                </div>
              </div>
              <div className="max-w-4xl mx-auto space-y-12 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-1">
                  {/* Top line */}
                  <div className="partners-desc-top-line"></div>
                  <p className="industries-served-desc">
                    Our expertise in mold design, mold manufacture, injection molding material, injection molding and product assembly drives innovation in:
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Industry Carousel - Full Width */}
          <div className="relative reveal reveal-up mt-16 w-full">
            <div
              ref={carouselRef}
              className="industry-carousel-container"
              style={{ scrollSnapType: 'x mandatory' }}
              onMouseEnter={() => setIsCarouselHovered(true)}
              onMouseLeave={() => setIsCarouselHovered(false)}
            >
              {/* Duplicate last item at the beginning for infinite scroll */}
              {industries.slice(-3).map((industry, index) => (
                <div
                  key={`clone-start-${index}`}
                  className="industry-carousel-card"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div className="industry-carousel-image">
                    <img
                      src={industry.image}
                      alt={industry.name}
                      className="w-full h-full object-cover"
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
                </div>
              ))}

              {/* Original items */}
              {industries.map((industry, index) => (
                <div
                  key={index}
                  className="industry-carousel-card"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div className="industry-carousel-image">
                    <img
                      src={industry.image}
                      alt={industry.name}
                      className="w-full h-full object-cover"
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
                </div>
              ))}

              {/* Duplicate first items at the end for infinite scroll */}
              {industries.slice(0, 3).map((industry, index) => (
                <div
                  key={`clone-end-${index}`}
                  className="industry-carousel-card"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div className="industry-carousel-image">
                    <img
                      src={industry.image}
                      alt={industry.name}
                      className="w-full h-full object-cover"
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
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="absolute -top-20 right-0 flex gap-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  scrollCarousel('prev');
                }}
                className="w-16 h-16 rounded-full bg-transparent hover:bg-black/5 transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Previous"
                type="button"
              >
                <img src="/assets/icons/arrow-left.svg" alt="Back Arrow" className="w-16 h-16" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  scrollCarousel('next');
                }}
                className="w-16 h-16 rounded-full bg-transparent hover:bg-black/5 transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Next"
                type="button"
              >
                <img src="/assets/icons/arrow-right.svg" alt="Next Arrow" className="w-16 h-16" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ISO Certifications Section */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
          {/* Left Side - Image with Overlay */}
          <div className="relative min-h-[600px] md:h-auto overflow-hidden achieving-progress-left">
            <img
              src="/assets/images/iso-back.jpg"
              alt="Operation Room with doctors conducting surgery"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: '40.4% 39.6%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
            <div className="relative z-10 h-full flex flex-col justify-center items-center px-[48px] py-[120px]">
              <div className='iso-gallery-content'>
                <h3 className='iso-gallery-title'>ACCREDITED QUALITY</h3>
                <p className='iso-gallery-description'>
                  Our commitment to quality is the foundation of our business. A dedicated team and process validations are backed up by e ective Quality Management Systems and certi cations that include </p>
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
            </div>
          </div>

          {/* Right Side - Slider */}
          <div className="achieving-progress-right relative min-h-[600px] md:h-auto">
            <div className="h-full flex items-center justify-center px-[48px] py-[120px]">
              <div className="max-w-2xl w-full">
                {/* Headings */}
                <div className="achieving-progress-headings mb-16">
                    <h4 className="achieving-progress-heading-main">40+ years</h4>
                    <h4 className="achieving-progress-heading-main1">of industry experience</h4>
                  </div>
                {/* Slider Content */}
                <div className="achieving-progress-slider">
                  {/* Circular Image Slider with Overlay Content */}
                  <div className="achieving-progress-image mb-8 relative">
                    <img
                      src={circularImages[currentSlide].image}
                      alt={circularImages[currentSlide].name}
                      className="w-[450px] h-[450px] rounded-full object-cover mx-auto"
                    />
                    
                    {/* Tag with Line - Overlay on Image */}
                    <div className="absolute inset-0 flex flex-col justify-end items-start px-8 pb-8">
                      <div className="partners-desc-top-line mb-6"></div>
                      <p className="achieving-progress-tag mb-4 text-left">WHY OUR CUSTOMERS CHOOSE US</p>
                      {/* Counter */}
                      <div className="achieving-progress-counter text-left">
                        <span className="text-white">0{currentSlide + 1}</span>
                        <span className="text-[#809298]"> / </span>
                        <span className="text-[#809298]">05</span>
                      </div>
                    </div>
                  </div>

                  

                  {/* Navigation Arrows */}
                  <div className="achieving-progress-nav flex justify-end gap-4 mt-12">
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Come to Meet Section */}
      <section
        className="relative py-40 px-[48px] overflow-hidden"
        style={{ background: 'linear-gradient(59deg, #e0e8eb 0%, #fff 100%)' }}
      >
        {/* Decorative component shape */}
        <img
          src="/assets/images/industies-served-1.svg"
          alt=""
          className="absolute top-0 right-0 w-[509px] h-[472px] hidden md:block opacity-100 z-0"
        />

        <div className="relative z-10 max-w-[1600px] mx-auto">
          <div className="come-to-meet-heading mb-8">
            <h3 className="come-to-meet-heading-text">We are coming to meet you.</h3>
             <h3 className="come-to-meet-heading-text1">We will be at:</h3>
          </div>
          <div className="come-to-meet-image">
            <img
              src="/assets/images/Web-1920-x-705.jpg"
              alt="Come to Meet"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>



      {/* Request a Quote Section */}
      <section className="partners-section py-40 px-[48px] reveal reveal-up">
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

        <div className="relative z-10 max-w-[1600px] mx-auto pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">

            <div className="reveal reveal-left flex flex-col justify-center space-y-6">
              <h3 className="heading-partners">Request a Quote</h3>
              <p>If you would like to make a request for a quote for the manufacture of a mold or components – fill
                out the form below and we will be in touch as soon as possible.</p>

              <p>Please give us as much information as possible about the application of the product you need.</p>

              <p>We may have questions to ask during the process. </p>

            </div>
            <div className='form-section'>
              <form
                className="quote-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsSubmitting(true);
                  // Handle form submission here
                  console.log('Form submitted:', formData);
                  // Simulate API call
                  setTimeout(() => {
                    setIsSubmitting(false);
                    alert('Thank you! We will be in touch soon.');
                    setFormData({ name: '', email: '', phone: '', message: '' });
                  }, 1000);
                }}
              >
                <div className="form-description mb-6">
                  <p>Fill all information details to consult with us to get services from us.</p>
                </div>

                <div className="form-field-container space-y-4">
                  {/* Name and Phone on same line */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Your Name */}
                    <div className="form-field">
                      <label htmlFor="quote-name" className="form-label-hidden">
                        Your Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="quote-name"
                        className="form-input form-input-large"
                        name="name"
                        placeholder="Your Name *"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    {/* Your Phone */}
                    <div className="form-field">
                      <label htmlFor="quote-phone" className="form-label-hidden">
                        Your Phone
                      </label>
                      <input
                        type="tel"
                        id="quote-phone"
                        className="form-input form-input-large"
                        name="phone"
                        placeholder="Your Phone"
                        value={formData.phone}
                        onChange={(e) => {
                          // Limit to 10 digits
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setFormData({ ...formData, phone: value });
                        }}
                        maxLength={10}
                      />
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
                      className="form-input form-input-large"
                      name="email"
                      placeholder="Your Email *"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  {/* How may we help you? */}
                  <div className="form-field">
                    <textarea
                      id="quote-message"
                      className="form-textarea form-input-large"
                      name="message"
                      placeholder="How may we help you? *"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <div className="form-submit-container mt-6">
                  <button
                    type="submit"
                    className="form-submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Submit'}
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
          <div className="relative z-10 w-[96%] max-w-6xl aspect-video bg-black rounded-md overflow-hidden shadow-2xl transform transition duration-300 ease-out scale-100">
            <button
              className="absolute -top-12 right-0 text-white/90 hover:text-white px-3 py-2"
              onClick={closeVideo}
              aria-label="Close video"
            >
              Close ✕
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


    </div>
  );
};

export default Home;

