import { useEffect, useRef, useMemo, useState } from 'react';

const Events = () => {
  const fadeInRefs = useRef([]);
  const slideUpRefs = useRef([]);
  const [activeTab, setActiveTab] = useState('events');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allEvents = [
    {
      id: 1,
      title: 'Industry Trade Show 2024',
      date: 'March 15-17, 2024',
      dateValue: '2024-03-15', // For sorting/comparison
      location: 'Bangalore Convention Center',
      description: 'Join us at the premier industry trade show where we showcase our latest innovations in silicone and plastic molding technologies.',
      image: '/assets/images/events-trade-show.jpg',
      category: 'Trade Show',
      isArchived: false
    },
    {
      id: 2,
      title: 'Medical Device Manufacturing Conference',
      date: 'May 20-22, 2024',
      dateValue: '2024-05-20',
      location: 'Mumbai Exhibition Center',
      description: 'Explore the future of medical device manufacturing with our expert team. Learn about precision molding solutions for healthcare applications.',
      image: '/assets/images/events-medical.jpg',
      category: 'Conference',
      isArchived: false
    },
    {
      id: 3,
      title: 'Technology Innovation Summit',
      date: 'July 10-12, 2024',
      dateValue: '2024-07-10',
      location: 'Delhi Tech Park',
      description: 'Discover cutting-edge manufacturing technologies and network with industry leaders. We\'ll be showcasing our advanced molding capabilities.',
      image: '/assets/images/events-tech.jpg',
      category: 'Summit',
      isArchived: false
    },
    {
      id: 4,
      title: 'Customer Appreciation Day',
      date: 'September 5, 2024',
      dateValue: '2024-09-05',
      location: 'Laxmi Electronics Facility, Bangalore',
      description: 'An exclusive event for our valued customers. Tour our state-of-the-art facilities and meet our team of experts.',
      image: '/assets/images/events-customer.jpg',
      category: 'Open House',
      isArchived: false
    },
    {
      id: 5,
      title: 'Manufacturing Excellence Expo 2023',
      date: 'November 10-12, 2023',
      dateValue: '2023-11-10',
      location: 'Chennai Trade Center',
      description: 'Showcased our advanced molding capabilities and connected with industry leaders. Successfully demonstrated our precision manufacturing solutions.',
      image: '/assets/images/events-expo.jpg',
      category: 'Expo',
      isArchived: true
    },
    {
      id: 6,
      title: 'Medical Device Summit 2023',
      date: 'August 15-17, 2023',
      dateValue: '2023-08-15',
      location: 'Hyderabad Convention Center',
      description: 'Participated in discussions about medical device manufacturing standards and showcased our ISO-certified processes.',
      image: '/assets/images/events-medical-summit.jpg',
      category: 'Summit',
      isArchived: true
    },
    {
      id: 7,
      title: 'Plastics & Rubber Industry Conference',
      date: 'June 5-7, 2023',
      dateValue: '2023-06-05',
      location: 'Pune Exhibition Ground',
      description: 'Presented our expertise in thermoplastic and silicone molding technologies. Networked with key industry stakeholders.',
      image: '/assets/images/events-plastics.jpg',
      category: 'Conference',
      isArchived: true
    },
    {
      id: 8,
      title: 'Innovation in Manufacturing 2023',
      date: 'April 20-22, 2023',
      dateValue: '2023-04-20',
      location: 'Bangalore Tech Park',
      description: 'Demonstrated our latest manufacturing innovations and automation solutions. Received positive feedback from attendees.',
      image: '/assets/images/events-innovation.jpg',
      category: 'Exhibition',
      isArchived: true
    }
  ];

  // Separate current and archived events
  const { currentEvents, archivedEvents } = useMemo(() => {
    const current = allEvents.filter(event => !event.isArchived);
    const archived = allEvents.filter(event => event.isArchived);
    return { currentEvents: current, archivedEvents: archived };
  }, []);

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

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 rounded-none">
          <img
            src="/assets/images/about-us-banner.jpg"
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
                  Join Us<br />at Our
                </h2>
                <h2 className="about-us-hero-subtitle text-white whitespace-normal sm:whitespace-nowrap">
                  Events
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

          {/* Section Header - Professional Template Design */}
          <div className="mb-20">
            {/* Top Section with Tag and Title */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-16 mb-12 md:mb-16">
              {/* Left Side - Tag and Title */}
              <div
                className="lg:col-span-1 flex flex-col items-start justify-end about-us-fade-in"
                ref={(el) => (fadeInRefs.current[2] = el)}
              >
                {/* Divider Line */}
                <div className="mb-4 flex justify-start">
                  <div className="h-px w-20 bg-[#9CAEAF]"></div>
                </div>
                {/* Tag */}
                <p className="text-[#08222B] text-sm font-semibold uppercase tracking-wider mb-4">
                  Our Events
                </p>
                {/* Main Title */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-[#08222B] leading-[1.1]">
                  Join Us at<br />
                  Industry<br />
                  Events
                </h2>
              </div>

              {/* Spacer */}
              <div className="hidden lg:block"></div>

              {/* Right Side - Description */}
              <div
                className="lg:col-span-1 flex flex-col justify-end about-us-slide-up"
                ref={(el) => (slideUpRefs.current[0] = el)}
              >
                <div>
                  {/* Divider Line */}
                  <div className="mb-6 flex justify-start">
                    <div className="h-px w-20 bg-[#9CAEAF]"></div>
                  </div>
                  {/* Description */}
                  <p className="text-[#08222B] text-lg md:text-xl lg:text-2xl font-light leading-relaxed">
                    Join us at industry-leading events where we showcase our expertise in precision molding, medical device manufacturing, and advanced manufacturing solutions.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Divider Line */}
            <div
              className="flex justify-start about-us-fade-in"
              ref={(el) => (fadeInRefs.current[3] = el)}
            >
              <div className="full-divider-line"></div>
            </div>
          </div>

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
                Events
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
            <div key={activeTab} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {(activeTab === 'events' ? currentEvents : archivedEvents).map((event, index) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group about-us-slide-up"
                  ref={(el) => {
                    const refIndex = activeTab === 'events' 
                      ? index + 1 
                      : currentEvents.length + index + 1;
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
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white bg-opacity-90 text-[#08222B] backdrop-blur-sm">
                        {event.category}
                      </span>
                    </div>
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


      {/* Let's Connect Section */}
      <section className="about-us-cta-section">
        <div className="about-us-cta-bg">
          <figure className="about-us-cta-bg-image">
            <img
              src="/assets/images/nlflIYUFxh7GOy9fpoBBBlTAkMo.webp"
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
                <div className="h-64 sm:h-80 w-full overflow-hidden">
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/images/about-us-banner.jpg';
                    }}
                  />
                </div>

                {/* Event Details */}
                <div className="px-6 py-8 sm:px-10">
                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#9CAEAF] bg-opacity-15 text-[#08222B] border border-[#9CAEAF] border-opacity-30">
                      {selectedEvent.category}
                    </span>
                  </div>

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
                      <div className="text-lg text-[#08222B] font-medium">
                        {selectedEvent.location}
                      </div>
                    </div>
                  </div>

                  {/* Event Description */}
                  <div>
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      About This Event
                    </div>
                    <p className="text-base text-gray-700 leading-relaxed">
                      {selectedEvent.description}
                    </p>
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
