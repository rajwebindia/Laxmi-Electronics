import { useState, useEffect } from 'react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
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

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [selectedImage]);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const tabs = ['LSR', 'HCR', 'Thermoplastic'];

  return (
    <div className="w-full">
      {/* Banner Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            decoding="auto"
            width="1920"
            height="1080"
            sizes="100vw"
            srcSet="https://framerusercontent.com/images/Bv0QjsCvSu2euejKIMf3oLbybAI.webp?scale-down-to=512&width=7952&height=5304 512w,https://framerusercontent.com/images/Bv0QjsCvSu2euejKIMf3oLbybAI.webp?scale-down-to=1024&width=7952&height=5304 1024w,https://framerusercontent.com/images/Bv0QjsCvSu2euejKIMf3oLbybAI.webp?scale-down-to=2048&width=7952&height=5304 2048w"
            src="https://framerusercontent.com/images/Bv0QjsCvSu2euejKIMf3oLbybAI.webp?width=1920&height=1080"
            alt="Gallery Banner"
            className="block w-full h-full object-cover object-center"
          />
        </div>

        {/* Overlay */}
        <div
          style={{
            backgroundColor: 'var(--token-43499f00-df33-426d-a5ae-f67005f2c3dc, #08222b)',
            flex: '0 0 auto',
            height: '100%',
            left: '0px',
            opacity: 0.75,
            position: 'absolute',
            top: '0px',
            width: '100%',
            willChange: 'transform',
            zIndex: 0
          }}
        ></div>

        {/* Content Container */}
        <div className="relative z-20 w-full text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Gallery
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Explore our work and achievements
          </p>
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
              onClick={() => openModal({ ...image, type: activeTab })}
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
              <p className="text-sm font-medium">{selectedImage.alt}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

