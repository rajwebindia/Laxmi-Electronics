import { useState, useEffect, useRef } from 'react';

const Gallery = () => {
  const fadeInRefs = useRef([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('LSR');

  // Gallery images from folders
  const galleryData = {
    LSR: [
      'LSR_0016_1.jpg',
      'LSR_0015_2.jpg',
      'LSR_0014_3.jpg',
      'LSR_0013_4.jpg',
      'LSR_0012_5.jpg',
      'LSR_0011_6.jpg',
      'LSR_0010_7.jpg',
      'LSR_0009_8.jpg',
      'LSR_0008_9.jpg',
      'LSR_0007_10.jpg',
      'LSR_0006_11.jpg',
      'LSR_0005_12.jpg',
      'LSR_0004_13.jpg',
      'LSR_0003_14.jpg',
      'LSR_0002_15.jpg',
      'LSR_0001_16.jpg',
      'LSR_0000_17.jpg',
    ].map((filename, index) => ({
      id: index + 1,
      src: `/assets/images/LSR/${filename}`,
      alt: `LSR ${index + 1}`,
    })),
    HCR: [
      'HCR-_0019_1.jpg',
      'HCR-_0015_5-768x512-1.jpg',
      'HCR-_0013_7.jpg',
      'HCR-_0011_9.jpg',
      'HCR-_0010_10.jpg',
      'HCR-_0009_11.jpg',
      'HCR-_0008_12.jpg',
      'HCR-_0007_13.jpg',
      'HCR-_0006_14.jpg',
      'HCR-_0005_15.jpg',
      'HCR-_0003_17.jpg',
      'HCR-_0002_18.jpg',
      'HCR-_0001_19.jpg',
      'HCR-_0000_20.jpg',
    ].map((filename, index) => ({
      id: index + 1,
      src: `/assets/images/HCR/${filename}`,
      alt: `HCR ${index + 1}`,
    })),
    Thermoplastic: [
      'TP-_0019_1.jpg',
      'TP-_0018_2.jpg',
      'TP-_0017_3-768x512-1.jpg',
      'TP-_0016_4-768x512-2.jpg',
      'TP-_0015_5-768x512-1.jpg',
      'TP-_0014_6-768x512-1.jpg',
      'TP-_0013_7-768x512-1.jpg',
      'TP-_0010_10-768x512-1.jpg',
      'TP-_0009_11-768x512-1.jpg',
      'TP-_0008_12-768x512-1.jpg',
      'TP-_0006_14.jpg',
      'TP-_0005_15-768x512-1.jpg',
      'TP-_0004_16.jpg',
      'TP-_0003_17-768x512-1.jpg',
      'TP-_0002_18.jpg',
      'TP-_0001_19.jpg',
      'TP-_0000_20-768x512-2.jpg',
      'Thermoplastic.jpg',
    ].filter(filename => !filename.startsWith('HCR-')).map((filename, index) => ({
      id: index + 1,
      src: `/assets/images/TP/${filename}`,
      alt: `Thermoplastic ${index + 1}`,
    })),
  };

  // Fade in animation for hero section
  useEffect(() => {
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

    return () => {
      fadeInRefs.current.forEach((ref) => {
        if (ref) fadeInObserver.unobserve(ref);
      });
    };
  }, []);

  // Close modal on ESC key and handle keyboard navigation
  useEffect(() => {
    if (!selectedImage || selectedImageIndex === null) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
        setSelectedImageIndex(null);
      } else if (e.key === 'ArrowLeft') {
        const currentImages = galleryData[activeTab];
        let newIndex = selectedImageIndex - 1;
        if (newIndex < 0) newIndex = currentImages.length - 1;
        setSelectedImageIndex(newIndex);
        setSelectedImage({ ...currentImages[newIndex], type: activeTab });
      } else if (e.key === 'ArrowRight') {
        const currentImages = galleryData[activeTab];
        const newIndex = (selectedImageIndex + 1) % currentImages.length;
        setSelectedImageIndex(newIndex);
        setSelectedImage({ ...currentImages[newIndex], type: activeTab });
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedImage, selectedImageIndex, activeTab]);

  const openModal = (image, index) => {
    setSelectedImage(image);
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction) => {
    if (selectedImageIndex === null) return;
    
    const currentImages = galleryData[activeTab];
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (selectedImageIndex + 1) % currentImages.length;
    } else {
      newIndex = selectedImageIndex - 1;
      if (newIndex < 0) newIndex = currentImages.length - 1;
    }
    
    setSelectedImageIndex(newIndex);
    setSelectedImage({ ...currentImages[newIndex], type: activeTab });
  };


  const tabs = ['LSR', 'HCR', 'Thermoplastic'];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 rounded-none">
          <img
            src="/assets/images/gallery-banner.jpg"
            alt="Gallery Banner"
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
                  Explore Our<br />Work &
                </h2>
                <h2 className="about-us-hero-subtitle text-white whitespace-normal sm:whitespace-nowrap">
                  Gallery
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
                    Discover our precision manufacturing capabilities through our comprehensive gallery showcasing LSR, HCR, and Thermoplastic molding solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Tabs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Professional Tab Navigation */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 bg-gray-50 rounded-lg p-2 md:p-3 max-w-4xl mx-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-semibold rounded-md transition-all duration-300 ease-in-out ${
                  activeTab === tab
                    ? 'text-white bg-[#08222b] shadow-lg transform scale-105'
                    : 'text-gray-700 bg-transparent hover:bg-gray-200 hover:text-[#08222b]'
                }`}
              >
                <span className="relative z-10">{tab}</span>
                {activeTab === tab && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#08222b] to-[#0a2d3a] rounded-md"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid with Fade Animation */}
        <div 
          key={activeTab}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {galleryData[activeTab].map((image, index) => (
            <div
              key={image.id}
              className="relative group cursor-pointer overflow-hidden rounded-xl bg-gray-200 aspect-[4/3] shadow-md hover:shadow-2xl transition-all duration-500 animate-fadeIn"
              onClick={() => openModal({ ...image, type: activeTab }, index)}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Zoom Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-xl">
                  <svg
                    className="w-8 h-8 text-[#08222b]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </div>

              {/* Image Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white font-medium text-sm md:text-base">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Image Zoom Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2 hover:bg-black/70"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Previous Button */}
          {galleryData[activeTab].length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3 hover:bg-black/70 swiper-button-prev"
              aria-label="Previous image"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {galleryData[activeTab].length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3 hover:bg-black/70 swiper-button-next"
              aria-label="Next image"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          {/* Image Container */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            {/* Image Info */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg">
              <p className="text-sm font-medium">
                {selectedImage.alt} ({selectedImageIndex !== null ? selectedImageIndex + 1 : ''} / {galleryData[activeTab].length})
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

