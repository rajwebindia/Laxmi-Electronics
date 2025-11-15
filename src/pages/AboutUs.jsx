import { useEffect, useRef, useState } from 'react';

const AboutUs = () => {
  const fadeInRefs = useRef([]);
  const slideUpRefs = useRef([]);
  const imageFigureRef = useRef(null);
  const [selectedMember, setSelectedMember] = useState(null);

  const teamMembers = [
    {
      id: 1,
      name: 'John Anderson Doe',
      position: 'CEO',
      description: 'John leads Omnis with strategic vision and deep expertise in advanced materials. His leadership drives innovation and excellence across all operations.',
      linkedin: 'https://www.linkedin.com/in/johndoe/',
      image: 'https://framerusercontent.com/images/VoU3qboba5ygSydAYfgXdnJE.jpg',
      imageBase: 'https://framerusercontent.com/images/VoU3qboba5ygSydAYfgXdnJE.jpg'
    },
    {
      id: 2,
      name: 'Jane Baptista',
      position: 'Operations Director',
      description: 'Jane oversees all aspects of Omnis\' production, ensuring seamless workflows and precision at every stage. With a strong background in engineering and manufacturing processes, he optimizes efficiency, quality, and scalability. His expertise in advanced forming technologies and supply chain management helps deliver high-performance solutions that meet the strictest industry demands.',
      linkedin: 'https://www.linkedin.com/in/joaoduartebarbosa/',
      image: 'https://framerusercontent.com/images/jxqVcu1HwOUNecs9g53IU7QJa3c.jpg',
      imageBase: 'https://framerusercontent.com/images/jxqVcu1HwOUNecs9g53IU7QJa3c.jpg'
    },
    {
      id: 3,
      name: 'Angel Mango',
      position: 'Strategist Director',
      description: 'Angel drives strategic initiatives and market development at Omnis. With extensive experience in business strategy and client relations, he helps shape the future of advanced manufacturing.',
      linkedin: 'https://www.linkedin.com/in/angelmango/',
      image: 'https://framerusercontent.com/images/gKNTvjSkd4abZzoqiD2tazwMxnk.jpg',
      imageBase: 'https://framerusercontent.com/images/gKNTvjSkd4abZzoqiD2tazwMxnk.jpg'
    }
  ];

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
            decoding="auto"
            width="7952"
            height="5304"
            sizes="100vw"
            srcSet="https://framerusercontent.com/images/Bv0QjsCvSu2euejKIMf3oLbybAI.webp?scale-down-to=512&width=7952&height=5304 512w,https://framerusercontent.com/images/Bv0QjsCvSu2euejKIMf3oLbybAI.webp?scale-down-to=1024&width=7952&height=5304 1024w,https://framerusercontent.com/images/Bv0QjsCvSu2euejKIMf3oLbybAI.webp?scale-down-to=2048&width=7952&height=5304 2048w,https://framerusercontent.com/images/Bv0QjsCvSu2euejKIMf3oLbybAI.webp?scale-down-to=4096&width=7952&height=5304 4096w,https://framerusercontent.com/images/Bv0QjsCvSu2euejKIMf3oLbybAI.webp?width=7952&height=5304 7952w"
            src="https://framerusercontent.com/images/Bv0QjsCvSu2euejKIMf3oLbybAI.webp?width=7952&height=5304"
            alt="Young Female Engineer working"
            className="block w-full h-full object-cover object-center"
          />
        </div>

        {/* Overlay */}
        <div className="about-us-hero-overlay"></div>

        {/* Content Container */}
        <div className="absolute z-20 w-full bottom-0 left-0 right-0 pt-24 pb-20">
          <div className="mx-auto px-[48px]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-end">
              {/* Left Side - Title Section */}
              <div
                className="flex flex-col items-start justify-end about-us-fade-in"
                ref={(el) => (fadeInRefs.current[0] = el)}
              >
                <h2 className="about-us-hero-title text-white mb-4 whitespace-nowrap">
                  Your<br />one-stop
                </h2>
                <h2 className="about-us-hero-subtitle text-white whitespace-nowrap">
                  Solution
                </h2>
              </div>
              <div></div>

              {/* Right Side - Description Section */}
              <div
                className="flex flex-col justify-end about-us-fade-in"
                ref={(el) => (fadeInRefs.current[1] = el)}
              >
                {/* Divider Line */}
                <div className="mb-6 flex justify-start">
                  <div className="h-px w-20 bg-[#9CAEAF]"></div>
                </div>

                {/* Description Text */}
                <div className="max-w-md">
                  <p className="about-us-hero-description">
                    Laxmi is a full services manufacturer of silicone and plastic, injection molds and components. At our state-of-the-art manufacturing facilities in Bangalore, we deploy the latest technology and top-of-the-line systems that allow us to seamlessly integrate with your production strategy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Expertise Section */}
      <section className="relative w-full py-40 px-[48px] bg-white">
        <div className=" mx-auto">
         

          {/* Pyramid Shape Decoration */}
          <figure className="about-us-pyramid-shape">
            <img
              decoding="auto"
              loading="lazy"
              width="375"
              height="410"
              sizes=""
              srcSet="/assets/images/sap-s.png"
              src="/assets/images/sap-s.png"
              alt="History"
            />
          </figure>

           

          {/* Our Expertise Header and Description - Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
            {/* Left Side - Tag */}
            <div
              className="flex flex-col items-start about-us-fade-in"
              ref={(el) => (fadeInRefs.current[3] = el)}
            >
              {/* Divider Line */}
              <div className="mb-2 flex justify-start">
                <div className="h-px w-20 bg-[#9CAEAF]"></div>
              </div>
              <p className="text-[#08222B] text-sm font-semibold uppercase tracking-wider">
                Our Expertise
              </p>
            </div>

            {/* Right Side - Description */}
            <div
              className="about-us-slide-up"
              ref={(el) => (slideUpRefs.current[0] = el)}
            >
              <h6 className="text-[#08222B] text-xl md:text-2xl font-light leading-relaxed">
              Laxmi has a proven track record as an effective solution provider. Our major clients are from the medical, aviation, space and healthcare industries. We provide our customers with economic viability, engineering excellence, total quality management and certified manufacturing processes that enable a quick turnaround from design to production.
              </h6>
              <div
                className="mb-8 flex justify-start about-us-fade-in"
                ref={(el) => (fadeInRefs.current[2] = el)}
              >
                <div className="full-divider-line"></div>
              </div>
            
            {/* Stats List */}
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
              {/* Stat 1 */}
              <li
                className="text-center about-us-slide-up"
                ref={(el) => (slideUpRefs.current[1] = el)}
              >
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-0">
                    <span className="about-us-stat-number">60</span>
                    <span className="about-us-stat-suffix">K</span>
                    <div className="about-us-stat-symbol">+</div>
                  </div>
                  
                </div>
                <p className="about-us-stat-text">
                  state-of-the-art facility in Boston, MA, designed for innovation.
                </p>
              </li>

              {/* Stat 2 */}
              <li
                className="text-center about-us-slide-up"
                ref={(el) => (slideUpRefs.current[2] = el)}
              >
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-0">
                    <span className="about-us-stat-number">70</span>
                    <div className="about-us-stat-symbol">+</div>
                  </div>
                  
                </div>
                <p className="about-us-stat-text">
                  high-qualified engineers across various industries.
                </p>
              </li>

              {/* Stat 3 */}
              <li
                className="text-center about-us-slide-up"
                ref={(el) => (slideUpRefs.current[3] = el)}
              >
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-0">
                    <span className="about-us-stat-number">70</span>
                    <div className="about-us-stat-symbol">%</div>
                  </div>
                  
                </div>
                <p className="about-us-stat-text">
                  success rate on all the projects we were involved in.
                </p>
              </li>
            </ul>
            </div>
          </div>




        </div>
      </section>

      {/* Image Section */}
      <section className="about-us-image-section" id="img-trigger">
        <div className="about-us-image-wrapper">
          <figure className="about-us-image-figure" ref={imageFigureRef}>
            <div className="about-us-image-bg">
              <img
                decoding="auto"
                loading="lazy"
                width="4000"
                height="2667"
                sizes="100vw"
                srcSet="https://framerusercontent.com/images/DkfHm2nr8vANshPszskYGhtUXrI.webp?scale-down-to=512&width=4000&height=2667 512w,https://framerusercontent.com/images/DkfHm2nr8vANshPszskYGhtUXrI.webp?scale-down-to=1024&width=4000&height=2667 1024w,https://framerusercontent.com/images/DkfHm2nr8vANshPszskYGhtUXrI.webp?scale-down-to=2048&width=4000&height=2667 2048w,https://framerusercontent.com/images/DkfHm2nr8vANshPszskYGhtUXrI.webp?width=4000&height=2667 4000w"
                src="https://framerusercontent.com/images/DkfHm2nr8vANshPszskYGhtUXrI.webp?width=4000&height=2667"
                alt="Young engineers working"
              />
            </div>
          </figure>
          <div className="about-us-image-overlay"></div>
        </div>
      </section>

      {/* Why Laxmielectronics Section */}
      <section className="about-us-why-section">
        {/* Decorative Shape */}
        <figure className="about-us-why-shape">
          <div className="about-us-why-shape-wrapper">
            <img
              decoding="auto"
              loading="lazy"
              width="542"
              height="472"
              sizes="calc(100vw * 0.48)"
              srcSet="https://framerusercontent.com/images/2oGOKoxie1i2rI0AiZYOaVk.svg?scale-down-to=512&width=542&height=472 512w,https://framerusercontent.com/images/2oGOKoxie1i2rI0AiZYOaVk.svg?width=542&height=472 542w"
              src="https://framerusercontent.com/images/2oGOKoxie1i2rI0AiZYOaVk.svg?width=542&height=472"
              alt="Component shape"
            />
          </div>
        </figure>

        <div className="about-us-why-content">
          {/* Image */}
          <div className="about-us-why-image about-us-fade-in" ref={(el) => (fadeInRefs.current[5] = el)}>
            <figure className="about-us-why-image-wrapper">
              <img
                decoding="auto"
                loading="lazy"
                width="3132"
                height="4859"
                sizes="calc(max(100vw, 1px) * 0.32)"
                srcSet="https://framerusercontent.com/images/6FPQ5LqdPa5evdm22BmtGdXbP0Y.webp?scale-down-to=1024&width=3132&height=4859 660w,https://framerusercontent.com/images/6FPQ5LqdPa5evdm22BmtGdXbP0Y.webp?scale-down-to=2048&width=3132&height=4859 1320w,https://framerusercontent.com/images/6FPQ5LqdPa5evdm22BmtGdXbP0Y.webp?scale-down-to=4096&width=3132&height=4859 2640w,https://framerusercontent.com/images/6FPQ5LqdPa5evdm22BmtGdXbP0Y.webp?width=3132&height=4859 3132w"
                src="https://framerusercontent.com/images/6FPQ5LqdPa5evdm22BmtGdXbP0Y.webp?width=3132&height=4859"
                alt="Bridge"
              />
            </figure>
          </div>

          {/* Text Content */}
          <div className="about-us-why-text">
            {/* Heading */}
            <div className="about-us-why-heading about-us-slide-up" ref={(el) => (slideUpRefs.current[4] = el)}>
              <h3>Why</h3>
              <h3>Laxmielectronics</h3>
            </div>

            {/* List */}
            <ul className="about-us-why-list">
              <li className="about-us-why-item about-us-slide-up" ref={(el) => (slideUpRefs.current[5] = el)}>
                <div className="about-us-why-item-title">
                  <h5>Mission</h5>
                </div>
                <div className="about-us-why-item-text">
                  <p>Deliver best in class products to customers seeking peak performance by providing standard and custom solutions</p>
                </div>
              </li>

              <li className="about-us-why-item about-us-slide-up" ref={(el) => (slideUpRefs.current[6] = el)}>
                <div className="about-us-why-item-title">
                  <h5>Differentiators</h5>
                </div>
                <div className="about-us-why-item-text">
                  <p>40+ years of industry experience In-house integration of mold building, part production & value addition Lean & efficient management & customer support</p>
                </div>
              </li>

              <li className="about-us-why-item about-us-slide-up" ref={(el) => (slideUpRefs.current[7] = el)}>
                <div className="about-us-why-item-title">
                  <h5>Process</h5>
                </div>
                <div className="about-us-why-item-text">
                  <p>QMS to ISO and AS Standards Signatory to UN Global Compact Ecovadis Silver recognition level in CSR Evaluation Program</p>
                </div>
              </li>

              <li className="about-us-why-item about-us-slide-up" ref={(el) => (slideUpRefs.current[8] = el)}>
                <div className="about-us-why-item-title">
                  {/* <h5>Delivering best in class products</h5> */}
                </div>
                <div className="about-us-why-item-text">
                  {/* <p>Partnering with clients from prototype to large-scale production.</p> */}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Our company history Section */}
      <section className="about-us-vision-section">
        <div className="about-us-vision-container">
          <div className="about-us-vision-content">
            {/* Title */}
            <div className="about-us-vision-title">
              <h3>Company history at a glance</h3>
            </div>
            
            {/* Description */}
            <div className="about-us-vision-description">
              <p>Since 1983, Laxmi has added to its portfolio of capabilities focusing on being the one-stop for precision molding. Our facilities, machining infrastructure, technology, quality processes and human resources have been augmented to meet customer needs.</p>
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
                  srcSet="/assets/images/History-Horizontal-2048x703.png 2048w"
                  src="/assets/images/History-Horizontal-2048x703.png"
                  alt="History"
                />
              </figure>
            </div>
            
            
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-us-team-section">
        <div className="about-us-team-container">
          <div className="about-us-team-header">
            <div className="about-us-team-title-wrapper">
              <div className="about-us-team-title">
                <h3>Meet the industry</h3>
              </div>
              <div className="about-us-team-subtitle">
                <h3>Experts</h3>
              </div>
            </div>
            <div className="about-us-team-description">
              <p>With expertise and vision, our leadership team drives innovation, precision, and excellence—shaping the future of advanced manufacturing.</p>
            </div>
          </div>

          {/* Divider Line */}
          <div className="about-us-team-divider">
            <div className="about-us-team-line"></div>
          </div>

          {/* Team Members Grid */}
          <div className="about-us-team-members">
            {teamMembers.map((member) => (
              <div 
                key={member.id} 
                className="about-us-team-member"
                onClick={() => setSelectedMember(member)}
                style={{ cursor: 'pointer' }}
              >
                <div className="about-us-team-member-image">
                  <figure>
                    <img
                      decoding="auto"
                      loading="lazy"
                      width="1800"
                      height="2400"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      srcSet={`${member.imageBase}?scale-down-to=512&width=1800&height=2400 512w,${member.imageBase}?scale-down-to=1024&width=1800&height=2400 1024w,${member.imageBase}?scale-down-to=2048&width=1800&height=2400 2048w,${member.imageBase}?width=1800&height=2400 1800w`}
                      src={`${member.imageBase}?width=1800&height=2400`}
                      alt={`Portrait of ${member.name}, ${member.position} at Omnis.`}
                      onError={(e) => {
                        console.error('Image failed to load:', member.imageBase);
                        e.target.style.display = 'none';
                      }}
                    />
                  </figure>
                </div>
                <div className="about-us-team-member-info">
                  <button 
                    className="about-us-team-linkedin-btn" 
                    aria-label="LinkedIn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMember(member);
                    }}
                  >
                    <img
                      decoding="auto"
                      loading="lazy"
                      width="24"
                      height="24"
                      src="https://framerusercontent.com/images/6LK5i2MdOVhqo0MNLKRkK0CEU.svg"
                      alt="LinkedIn"
                    />
                  </button>
                  <div className="about-us-team-member-details">
                    <h6>{member.name}</h6>
                    <p>{member.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Let's Build the Future Together Section */}
      <section className="about-us-cta-section">
        <div className="about-us-cta-bg">
          <figure className="about-us-cta-bg-image">
            <img
              decoding="auto"
              loading="lazy"
              width="2400"
              height="1920"
              sizes="100vw"
              srcSet="https://framerusercontent.com/images/nlflIYUFxh7GOy9fpoBBBlTAkMo.webp?scale-down-to=512 512w,https://framerusercontent.com/images/nlflIYUFxh7GOy9fpoBBBlTAkMo.webp?scale-down-to=1024 1024w,https://framerusercontent.com/images/nlflIYUFxh7GOy9fpoBBBlTAkMo.webp?scale-down-to=2048 2048w,https://framerusercontent.com/images/nlflIYUFxh7GOy9fpoBBBlTAkMo.webp 2400w"
              src="https://framerusercontent.com/images/nlflIYUFxh7GOy9fpoBBBlTAkMo.webp"
              alt="Futuristic place with person"
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
                  decoding="auto"
                  loading="lazy"
                  width="3361"
                  height="4652"
                  sizes="300px"
                  srcSet="https://framerusercontent.com/images/kWHf2CUHeyzFcQp7qTeNXgb6k.webp?scale-down-to=1024 739w,https://framerusercontent.com/images/kWHf2CUHeyzFcQp7qTeNXgb6k.webp?scale-down-to=2048 1479w,https://framerusercontent.com/images/kWHf2CUHeyzFcQp7qTeNXgb6k.webp?scale-down-to=4096 2959w,https://framerusercontent.com/images/kWHf2CUHeyzFcQp7qTeNXgb6k.webp 3361w"
                  src="https://framerusercontent.com/images/kWHf2CUHeyzFcQp7qTeNXgb6k.webp"
                  alt="Person looking to a wind tower"
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

      {/* Team Member Modal */}
      {selectedMember && (
        <div 
          className="about-us-team-modal-overlay"
          onClick={() => setSelectedMember(null)}
        >
          <div 
            className="about-us-team-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="about-us-team-modal-close"
              onClick={() => setSelectedMember(null)}
              aria-label="Close"
            >
              <img
                decoding="auto"
                width="24"
                height="24"
                src="https://framerusercontent.com/images/foEdcFGV5TFMvzOIqL9BhxwjYG4.svg"
                alt="Close"
              />
            </button>
            
            <div className="about-us-team-modal-content">
              <div className="about-us-team-modal-header">
                <h5>{selectedMember.name}</h5>
                <p>{selectedMember.position}</p>
              </div>

              <div className="about-us-team-modal-divider">
                <div className="about-us-team-modal-line"></div>
              </div>

              <div className="about-us-team-modal-description">
                <p>{selectedMember.description}</p>
              </div>

              <div className="about-us-team-modal-linkedin">
                <a 
                  href={selectedMember.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-us-team-modal-linkedin-link"
                >
                  <div className="about-us-team-modal-linkedin-icon">
                    <img
                      decoding="auto"
                      width="24"
                      height="24"
                      sizes="24px"
                      src="https://framerusercontent.com/images/TnvjNUCCG7N8YOHVHjIagUCrpc.svg"
                      alt="LinkedIn"
                    />
                  </div>
                  <p>LinkedIn</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUs;

