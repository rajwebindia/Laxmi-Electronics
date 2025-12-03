import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Locations = () => {
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

  const locations = [
    {
      id: 1,
      title: 'UNIT 1',
      address: 'B-25, KSSIDC, I.T.I Ancillary Industrial Estate, Mahadevpura',
      city: 'Bangalore – 560 048',
      size: 'Size: 10,000 sq.ft.'
    },
    {
      id: 2,
      title: 'UNIT 2',
      address: 'P-2, KSSIDC, I.T.I. Ancillary Industrial Estate, Dyavasandra, Mahadevapura',
      city: 'Bangalore - 560 048',
      size: 'Size: 6,000 sq.ft.'
    },
    {
      id: 3,
      title: 'UNIT 3',
      address: 'Plot No: 81, EPIP Area, Whitefield',
      city: 'Bangalore - 560 066',
      size: 'Size: 25,000 sq.ft.'
    },
    {
      id: 4,
      title: 'UNIT 4',
      address: 'Plot No 69/A, Bengaluru Aerospace Park, Dummanahalli Village, Jala Hobli',
      city: 'Bengaluru North - 562 110',
      size: 'Size: 40,000 sq.ft.'
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 rounded-none">
          <img
            src="/assets/images/about-us-banner.jpg"
            alt="Locations Banner"
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
                  Our<br />Manufacturing
                </h2>
                <h2 className="about-us-hero-subtitle text-white whitespace-normal sm:whitespace-nowrap">
                  Locations
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
                    Strategically located manufacturing facilities in Bangalore, India. We have the logistics infrastructure in place to deliver your product anywhere in the world.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-[48px] bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
            {/* Left Side - Image */}
            <div
              className="about-us-fade-in"
              ref={(el) => (fadeInRefs.current[1] = el)}
            >
              <div className="relative about-img-box">
                <img
                  decoding="async"
                  src="/assets/images/one-stop.jpg"
                  alt="Manufacturing Plant"
                  className="w-full h-auto max-h-[400px] object-cover"
                  onError={(e) => {
                    e.target.src = '/assets/images/about-us-banner.jpg';
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#08222B] via-[#08222B]/90 to-transparent p-4 sm:p-5 md:p-6">
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-white">
                    4 Manufacturing plants
                  </h3>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div
              className="about-content about-us-slide-up flex flex-col justify-center"
              ref={(el) => (slideUpRefs.current[0] = el)}
            >
              <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-[#08222B] mb-4 md:mb-6">
                Company owned assets - Site area – 100,000 sq. ft., Built area – 81,000 sq. ft.
              </h3>
              <p className="text-[#08222B] text-sm sm:text-base md:text-lg leading-relaxed mb-4 md:mb-6">
                Laxmi's manufacturing processes deliver a broad range of product solutions consistently in a built-to-order environment. We can fulfill orders worldwide through strategically located manufacturing facilities in Bangalore, India. We have the logistics infrastructure in place to deliver your product anywhere in the world.
              </p>
              <p className="text-[#08222B] text-sm sm:text-base md:text-lg leading-relaxed">
                Having lived up to our client's expectations consistently we have acquired knowledge garnered in our related fields of operation over the years. Seamless integration in the production, economic viability, state-of-the-art facilities, engineering excellence and ISO certified manufacturing processes is what we offer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Grid Section */}
      <section className="relative w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-[48px] bg-gradient-to-b from-gray-50 to-white">
        <div className="elementor-background-overlay"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-gray-200">
            {locations.map((location, index) => (
              <div
                key={location.id}
                className="bg-white border-r border-b border-gray-200 last:border-r-0 sm:last:border-r sm:even:border-r lg:last:border-r-0 lg:border-r lg:last:border-r p-4 sm:p-5 md:p-6 lg:p-8 transform transition-all duration-300 hover:shadow-lg hover:bg-gray-50 about-us-slide-up plant-sect-box"
                ref={(el) => (slideUpRefs.current[index + 1] = el)}
              >
                <div className="elementor-image-box-wrapper">
                  <div className="elementor-image-box-content">
                    <h4 className="elementor-image-box-title text-lg sm:text-xl md:text-2xl font-semibold text-[#08222B] mb-3 md:mb-4">
                      {location.title}
                    </h4>
                    <p className="elementor-image-box-description text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-line">
                      {location.address}
                      {'\n'}
                      {location.city}
                      {'\n'}
                      <span className="text-[#08222B] font-medium mt-2 block">
                        {location.size}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Locations;

