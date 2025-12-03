import { useEffect, useRef } from 'react';

const Careers = () => {
  const fadeInRefs = useRef([]);
  const slideUpRefs = useRef([]);

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


  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 rounded-none">
          <img
            src="/assets/images/about-us-banner.jpg"
            alt="Careers Banner"
            className="block w-full h-full object-cover object-center"
          />
        </div>

        {/* Overlay */}
        <div className="about-us-hero-overlay"></div>

        {/* Content Container */}
        <div className="absolute z-20 w-full bottom-0 left-0 right-0 pt-12 md:pt-16 lg:pt-20 xl-1300:pt-16 2xl:pt-24 pb-12 md:pb-16 lg:pb-16 xl-1300:pb-12 2xl:pb-20">
          <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-[48px] xl-1300:px-[40px] 2xl:px-[48px]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 xl-1300:gap-8 2xl:gap-12 items-end">
              {/* Left Side - Title Section */}
              <div
                className="flex flex-col items-start justify-end about-us-fade-in"
                ref={(el) => (fadeInRefs.current[0] = el)}
              >
                <h2 className="about-us-hero-title text-white mb-4 whitespace-normal sm:whitespace-nowrap">
                  Join Our<br />Team
                </h2>
                <h2 className="about-us-hero-subtitle text-white whitespace-normal sm:whitespace-nowrap">
                  Careers
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
                    At Laxmi Electronics, we're building the future of precision manufacturing. Join a team of passionate professionals dedicated to excellence, innovation, and continuous growth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="relative w-full py-20 md:py-32 lg:py-40 px-4 sm:px-6 md:px-8 lg:px-[48px] bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl">
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
              alt="Careers"
            />
          </figure>

          {/* Section Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12 mb-12 md:mb-16 lg:mb-20">
            {/* Left Side - Tag */}
            <div
              className="flex flex-col items-start about-us-fade-in"
              ref={(el) => (fadeInRefs.current[2] = el)}
            >
              {/* Divider Line */}
              <div className="mb-2 flex justify-start">
                <div className="h-px w-20 bg-[#9CAEAF]"></div>
              </div>
              <p className="text-[#08222B] text-sm font-semibold uppercase tracking-wider">
                Open Positions
              </p>
            </div>

            {/* Right Side - Title and Description */}
            <div
              className="md:col-span-2 about-us-slide-up"
              ref={(el) => (slideUpRefs.current[0] = el)}
            >
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-[#08222B] mb-4 md:mb-6 leading-tight">
                We are always eager to meet experienced talent
              </h3>
              <div
                className="mb-8 flex justify-start about-us-fade-in"
                ref={(el) => (fadeInRefs.current[3] = el)}
              >
                <div className="full-divider-line"></div>
              </div>
            </div>
          </div>

          {/* Education, Experience & Domain Section */}
          <div className="about-us-slide-up mb-16" ref={(el) => (slideUpRefs.current[1] = el)}>
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#08222B] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-3xl md:text-4xl font-light text-[#08222B]">
                  Education, Experience & Domain
                </h4>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#9CAEAF]/30 to-transparent hidden md:block"></div>
            </div>

            {/* Requirements Grid - Matching Job Openings Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Requirement 1 */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-xl font-semibold text-[#08222B] group-hover:text-[#9CAEAF] transition-colors duration-200">
                      01
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#9CAEAF]/10 text-[#08222B]">
                      Education
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Technical Diploma/Engineering Degree from a reputed institution
                </p>
              </div>

              {/* Requirement 2 */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-xl font-semibold text-[#08222B] group-hover:text-[#9CAEAF] transition-colors duration-200">
                      02
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#08222B]/10 text-[#08222B]">
                      Experience
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  3 - 5 years experience
                </p>
              </div>

              {/* Requirement 3 */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group md:col-span-2 lg:col-span-1">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-xl font-semibold text-[#08222B] group-hover:text-[#9CAEAF] transition-colors duration-200">
                      03
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#9CAEAF]/10 text-[#08222B]">
                      Domain
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Molding, Quality, Medical Manufacturing, Mold Making, Mold Designing, Automation, Maintenance, Industrial Engineering and Sales
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="about-us-fade-in" ref={(el) => (fadeInRefs.current[5] = el)}>
            <div className="bg-gradient-to-r from-[#08222B] to-[#0a2d38] p-6 sm:p-8 md:p-10 lg:p-12 rounded-lg shadow-lg">
              <div className="max-w-4xl">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-8 h-8 text-[#9CAEAF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-2xl md:text-3xl font-light text-white mb-4">
                      Ready to Join Us?
                    </h4>
                    <p className="text-gray-200 text-lg leading-relaxed mb-6">
                      If you are inspired by self-determination and a desire to meet challenges backed by relevant industry experience, please email your resume with cover letter clearly marked <span className="font-semibold text-white">"Application for Job"</span> to
                    </p>
                    <a 
                      href="mailto:careers@laxmielectronics.com" 
                      className="inline-flex items-center gap-3 text-[#9CAEAF] hover:text-white text-xl font-medium transition-colors duration-200 group"
                    >
                      <span className="border-b-2 border-[#9CAEAF] group-hover:border-white transition-colors duration-200 pb-1">
                        careers@laxmielectronics.com
                      </span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;


