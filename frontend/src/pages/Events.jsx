import { useEffect, useRef, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const allEvents = [
    {
      id: 1,
      title: 'MD&M West 2026',
      date: '3-5 February, 2026',
      location: 'MedTech',
      description: 'Anaheim Convention Center, Anaheim, CA, USA',
      locationDetails: [
        'Booth # 2133',
        'Anaheim Convention Center',
        '800 W Katella Ave,',
        'Anaheim, CA 92802,',
        'USA'
      ],
      aboutParagraphs: [
        'MD&M West is the leading medical device trade shows in the US, whose mission is to unify the international medical device community and push the boundaries of the medical field to save and improve lives across the globe.',
        "LAXMI is a Contract Development and Manufacturing Organization (CDMO) for industry-leading, multinational healthcare companies, global Original Equipment Manufacturers (OEMs), and emerging technology companies. It is one of the world's leading manufacturers of made-to-spec and specializes in the manufacture of precision micro-components, and sub-assemblies for the medical device industry. The company also manufactures a wide range of inhalation devices for leading pharmaceutical companies, with an in-house Mold Design and Development capability.",
        'Meet us to explore how we may be able to assist in meeting your requirements for molded parts and complete medical devices.',
        'We look forward to seeing you.'
      ],
      image: '/assets/images/events/upcoming-md&m-west.jpg',
      isArchived: false
    },
    {
      id: 2,
      title: 'TAGMA Die & Mould Exhibition',
      date: '21 - 24 April, 2026 ',
      location: 'Mumbai',
      description: 'Bombay Exhibition Centre, Mumbai, India',
      image: '/assets/images/events/upcoming-tagma-india.jpg',
      isArchived: false
    },
    {
      id: 3,
      title: 'CPHI Worldwide 2026 ',
      date: '6 - 8 October, 2026',
      location: 'Milan ',
      description: 'Fiera Milano Exhibition Center, Italy',
      image: '/assets/images/events/upcoming-cphi-milan.jpg',
      isArchived: false
    },
    {
      id: 4,
      title: 'CPHI Americas',
      date: 'May 20-22, 2025',
      location: 'Pennsylvania convention center, philadelphia',
      description: 'Contract Services for a Competitive Edge. Cleanroom molding and assembly, complete medical manufacturing. Booth # 539',
      image: '/assets/images/events/CPHI-Americas.jpg',
      isArchived: true
    },
    {
      id: 5,
      title: 'CPHI Frankfurt',
      date: 'October 28-30, 2025',
      location: 'Messe Frankfurt',
      description: 'Drug Delivery Device Manufacturer. Cleanroom molding and assembly, complete medical manufacturing. Stand # 8.0F74',
      image: '/assets/images/events/cphi-frankfurt.jpg',
      isArchived: true
    }
];

const Events = () => {
  const fadeInRefs = useRef([]);
  const slideUpRefs = useRef([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('events');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Separate current and archived events
  const currentEvents = allEvents.filter(event => !event.isArchived);
  const archivedEvents = allEvents.filter(event => event.isArchived);
  
  // Ensure refs arrays are properly sized
  useEffect(() => {
    const totalNeeded = Math.max(currentEvents.length, archivedEvents.length) + 10;
    if (slideUpRefs.current.length < totalNeeded) {
      slideUpRefs.current = [...slideUpRefs.current, ...new Array(totalNeeded - slideUpRefs.current.length).fill(null)];
    }
  }, [currentEvents.length, archivedEvents.length]);

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

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      slideUpRefs.current.forEach((ref) => {
        if (ref) slideUpObserver.observe(ref);
      });
    });

    return () => {
      fadeInRefs.current.forEach((ref) => {
        if (ref) fadeInObserver.unobserve(ref);
      });
      slideUpRefs.current.forEach((ref) => {
        if (ref) slideUpObserver.unobserve(ref);
      });
    };
  }, [activeTab, currentEvents.length, archivedEvents.length]);

  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    document.body.style.overflow = '';
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  // Check for event parameter in URL and open modal
  useEffect(() => {
    const eventId = searchParams.get('event');
    if (eventId && !isModalOpen) {
      const eventIdNum = parseInt(eventId, 10);
      const event = allEvents.find(e => e.id === eventIdNum);
      if (event) {
        // Switch to archived tab if event is archived
        if (event.isArchived) {
          setActiveTab('archived');
        }
        // Small delay to ensure tab switch completes
        setTimeout(() => {
          setSelectedEvent(event);
          setIsModalOpen(true);
          document.body.style.overflow = 'hidden';
          // Remove the parameter from URL after opening modal
          setSearchParams({});
        }, 100);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isModalOpen]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 rounded-none">
          <img
            src="/assets/images/events-banner.jpg"
            alt="Events Banner"
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
                  JOIN US <br />AT OUR 

                </h2>
                <h2 className="about-us-hero-subtitle text-white whitespace-normal sm:whitespace-nowrap">
                  INDUSTRY EVENTS
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
                    Stay connected with Laxmi Electronics through our industry events, trade shows, and conferences. Discover the latest innovations in precision molding and manufacturing solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section with Tabs */}
      <section className="relative w-full py-20 md:py-32 lg:py-40 px-4 sm:px-6 md:px-8 lg:px-[48px] bg-white">
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
              alt="Events"
            />
          </figure>

          

          {/* Tabs */}
          <div className="mb-8 border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('events')}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                  ${
                    activeTab === 'events'
                      ? 'border-[#08222B] text-[#08222B]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                Upcoming Events
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2.5 rounded-full text-xs font-medium">
                  {currentEvents.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('archived')}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                  ${
                    activeTab === 'archived'
                      ? 'border-[#08222B] text-[#08222B]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                Archived
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2.5 rounded-full text-xs font-medium">
                  {archivedEvents.length}
                </span>
              </button>
            </nav>
          </div>

          {/* Events Grid */}
          {(activeTab === 'events' ? currentEvents : archivedEvents).length > 0 ? (
            <div key={`${activeTab}-grid`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {(activeTab === 'events' ? currentEvents : archivedEvents).map((event, index) => (
                <div
                  key={`${activeTab}-event-${event.id}`}
                  onClick={() => handleEventClick(event)}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group about-us-slide-up"
                  ref={(el) => {
                    const refIndex = activeTab === 'events' 
                      ? index 
                      : currentEvents.length + index;
                    slideUpRefs.current[refIndex] = el;
                  }}
                >
                  {/* Event Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={event.image}
                      alt={event.title}
                      onError={(e) => {
                        e.target.src = '/assets/images/about-us-banner.jpg';
                      }}
                    />
                    {/* Category Badge Overlay */}
                    {event.category && (
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white bg-opacity-90 text-[#08222B] backdrop-blur-sm">
                          {event.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    {/* Event Title */}
                    <h3 className="text-xl font-semibold text-[#08222B] mb-3 line-clamp-2 group-hover:text-[#9CAEAF] transition-colors duration-200">
                      {event.title}
                    </h3>

                    {/* Event Date */}
                    <div className="flex items-center mb-3">
                      <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-[#08222B] font-medium">{event.date}</span>
                    </div>

                    {/* Event Location */}
                    <div className="flex items-start mb-4">
                      <svg className="w-4 h-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm text-gray-600 line-clamp-2">{event.location}</span>
                    </div>

                    {/* Event Description */}
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {event.description}
                    </p>

                    {/* Read More Indicator */}
                    <div className="flex items-center text-sm font-medium text-[#08222B] group-hover:text-[#9CAEAF] transition-colors duration-200">
                      <span>View Details</span>
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-16 text-center">
              <div className="flex flex-col items-center">
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-[#08222B] text-lg font-medium">
                  {activeTab === 'events'
                    ? 'No upcoming events at this time. Check back soon!'
                    : 'No archived events available.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Why Attend Our Events Section */}
      {false && (
        <section className="about-us-why-section">
          {/* Decorative Shape */}
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
            {/* Image */}
            <div className="about-us-why-image about-us-fade-in" ref={(el) => (fadeInRefs.current[4] = el)}>
              <figure className="about-us-why-image-wrapper">
                <img
                  src="/assets/images/why-banner.jpg"
                  alt="Why Attend Our Events"
                  className="w-full h-full object-cover"
                />
              </figure>
            </div>

            {/* Text Content */}
            <div className="about-us-why-text">
              {/* Heading */}
              <div className="about-us-why-heading about-us-slide-up" ref={(el) => (slideUpRefs.current[Math.max(currentEvents.length, archivedEvents.length) + 2] = el)}>
                <h3>Why Attend</h3>
                <h3>Our Events</h3>
              </div>

              {/* List */}
              <ul className="about-us-why-list">
                <li className="about-us-why-item about-us-slide-up" ref={(el) => (slideUpRefs.current[Math.max(currentEvents.length, archivedEvents.length) + 3] = el)}>
                  <div className="about-us-why-item-title">
                    <h5>Networking</h5>
                  </div>
                  <div className="about-us-why-item-text">
                    <p>Connect with industry leaders, potential partners, and fellow professionals in the manufacturing and medical device sectors</p>
                  </div>
                </li>

                <li className="about-us-why-item about-us-slide-up" ref={(el) => (slideUpRefs.current[Math.max(currentEvents.length, archivedEvents.length) + 4] = el)}>
                  <div className="about-us-why-item-title">
                    <h5>Innovation</h5>
                  </div>
                  <div className="about-us-why-item-text">
                    <p>Discover the latest technologies, manufacturing processes, and solutions that can transform your production capabilities</p>
                  </div>
                </li>

                <li className="about-us-why-item about-us-slide-up" ref={(el) => (slideUpRefs.current[Math.max(currentEvents.length, archivedEvents.length) + 5] = el)}>
                  <div className="about-us-why-item-title">
                    <h5>Expertise</h5>
                  </div>
                  <div className="about-us-why-item-text">
                    <p>Learn from our experienced team about best practices, quality standards, and industry insights gained from 40+ years of experience</p>
                  </div>
                </li>

                <li className="about-us-why-item about-us-slide-up" ref={(el) => (slideUpRefs.current[Math.max(currentEvents.length, archivedEvents.length) + 6] = el)}>
                  <div className="about-us-why-item-title">
                    <h5>Solutions</h5>
                  </div>
                  <div className="about-us-why-item-text">
                    <p>Explore customized solutions for your specific manufacturing needs and get expert advice on your projects</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}


      {/* Let's Connect Section */}
      <section className="about-us-cta-section">
        <div className="about-us-cta-bg">
          <figure className="about-us-cta-bg-image">
            <img
              src="/assets/images/ler-us-background.jpg"
              alt="Let's Connect"
              className="w-full h-full object-cover"
            />
          </figure>
        </div>

        <div className="about-us-cta-container">
          <div className="about-us-cta-content">
            {/* Title */}
            <div className="about-us-cta-title">
              <div className="about-us-cta-title-line1">
                <h3>Let's connect</h3>
              </div>
              <div className="about-us-cta-title-line2">
                <h3>at Our</h3>
                <h3>Events</h3>
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
                  alt="Let's Connect"
                  className="w-full h-full object-cover"
                />
              </figure>

              <div className="about-us-cta-text-block">
                <div className="about-us-cta-description">
                  <p>Interested in meeting us at an upcoming event? Contact us to learn more about our participation schedule and how we can help with your manufacturing needs.</p>
                </div>

                {/* CTA Button */}
                <div className="about-us-cta-button-container">
                  <a href="./contact-us" className="about-us-cta-button">
                    <div className="about-us-cta-button-content">
                      <div className="about-us-cta-button-text">
                        <p>Contact Us</p>
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

      {/* Event Details Modal */}
      {isModalOpen && selectedEvent && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#08222B] transition-colors"
                aria-label="Close modal"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Content */}
              <div className="bg-white">
                {/* Event Image */}
                <div className="w-full overflow-hidden">
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    className="w-full h-auto object-contain"
                    onError={(e) => {
                      e.target.src = '/assets/images/about-us-banner.jpg';
                    }}
                  />
                </div>

                {/* Event Details */}
                <div className="px-6 py-8 sm:px-10">
                  {/* Category Badge */}
                  {selectedEvent.category && (
                    <div className="mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#9CAEAF] bg-opacity-15 text-[#08222B] border border-[#9CAEAF] border-opacity-30">
                        {selectedEvent.category}
                      </span>
                    </div>
                  )}

                  {/* Event Title */}
                  <h2 className="text-3xl sm:text-4xl font-light text-[#08222B] mb-6">
                    {selectedEvent.title}
                  </h2>

                  {/* Event Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
                    <div>
                      <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Date
                      </div>
                      <div className="text-lg text-[#08222B] font-medium">
                        {selectedEvent.date}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Location
                      </div>
                      {selectedEvent.locationDetails ? (
                        <div className="text-lg text-[#08222B] font-medium space-y-1">
                          {selectedEvent.locationDetails.map((line, index) => (
                            <div key={index}>{line}</div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-lg text-[#08222B] font-medium">
                          {selectedEvent.location}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Event Description */}
                  <div>
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      ABOUT THIS EVENT
                    </div>
                    {selectedEvent.aboutParagraphs ? (
                      <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                        {selectedEvent.aboutParagraphs.map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-base text-gray-700 leading-relaxed">
                        {selectedEvent.description}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <a
                      href="./contact-us"
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#08222B] hover:bg-[#0a2d38] transition-colors duration-200"
                    >
                      Contact Us
                    </a>
                    <button
                      onClick={closeModal}
                      className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-[#08222B] bg-white hover:bg-gray-50 transition-colors duration-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
