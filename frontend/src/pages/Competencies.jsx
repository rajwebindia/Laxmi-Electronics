import { useState } from 'react';

const Competencies = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const competencies = [
    {
      id: 1,
      title: 'Medical Molding',
      description: 'Simple sub-assemblies to packaged devices in a certified Class 100,000 clean room.',
      image: '/assets/images/competiencies/competiencies-medical.jpg',
      link: '/mold-making#medical-equipment-devices'
    },
    {
      id: 2,
      title: 'Pharmaceutical Molding',
      description: 'Device design & manufacture.',
      image: '/assets/images/competiencies/competiencise-pharma.jpg',
      link: '/mold-making#pharmaceutical-molding'
    },
    {
      id: 3,
      title: 'Aerospace Molding',
      description: 'Components & Subassemblies Thermoplastic, thermosetting, silicone and elastomer parts.',
      image: '/assets/images/competiencies/competiencies-aerospace-molding.jpg',
      link: '/mold-making#aerospace-industry'
    },
    {
      id: 4,
      title: 'Precision Mold Making',
      description: 'Thermoplastic and thermoset components, HTV/HCR, LSR and elastomer.',
      image: '/assets/images/competiencies/competiencies-precision-mold-making.jpg',
      link: '/mold-making'
    },
    {
      id: 5,
      title: 'Silicone Molding',
      description: 'LSR/HCR flashless, class 8 clean room, white room, 20-80 tons.',
      image: '/assets/images/competiencies/competiencies-silicone.jpg',
      link: '/silicone-molding'
    },
    {
      id: 6,
      title: 'Thermoplastic Molding',
      description: 'Low-cost-per-shot, microprocessor based high-end CNC closed loop machines.',
      image: '/assets/images/competiencies/competiencies-thermoplastic.jpg',
      link: '/thermoplastic-molding'
    },
    {
      id: 7,
      title: '2K Molding',
      description: 'LSR-to-Plastic, Plastic-to-Plastic, Multiple colour combinations.',
      image: '/assets/images/competiencies/competiencies-2K-molding.jpg',
      link: '/silicone-molding#2k-molding'
    },
    {
      id: 8,
      title: 'ISBM',
      description: 'Injection Stretch Blow Molding with little restriction on bottle design.',
      image: '/assets/images/competiencies/competiencies-ISBM.jpg',
      link: '/thermoplastic-molding#isbm'
    },
    {
      id: 9,
      title: 'Assembly',
      description: 'End-to-end contract manufacturing solution through certified production processes.',
      image: '/assets/images/competiencies/competiencies-assembly.jpg',
      link: '/assembly-services'
    }
  ];

  return (
    <div className="w-full bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] md:min-h-[650px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/assets/images/molding-banner.jpg"
            alt="Competencies Banner"
            className="block w-full h-full object-cover object-center reveal-image"
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
                {/* "COMPETENCIES" - Full width, left aligned */}
                <div className="w-full reveal reveal-up delay-100">
                  <h1 className="mold-making-industries text-white text-left reveal-text delay-200">
                    <span className="whitespace-nowrap">COMPETENCIES</span>
                  </h1>
                </div>
                {/* "WE PROVIDE" - Full width, right aligned */}
                <div className="w-full reveal reveal-up delay-200">
                  <h1 className="mold-making-we-serve text-white text-right reveal-text delay-300">
                    <span className="whitespace-nowrap">WE PROVIDE</span>
                  </h1>
                </div>
              </div>

              {/* Subtitle and Description */}
              <div className="mt-12">
                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                  {/* Left Section - Subtitle */}
                  <div className="reveal reveal-up delay-200">
                    <p className="mold-making-subtitle text-white reveal-text delay-300">
                      <span className="whitespace-nowrap">Comprehensive </span><br />
                      <span className="whitespace-nowrap">Manufacturing Solutions</span>
                    </p>
                  </div>
                  <div>

                  </div>
                  {/* Right Section - Description */}
                  <div className="hero-description-container reveal reveal-left delay-300">
                    {/* Divider Line */}
                    <div className="w-full mb-6">
                      <div className="h-px mold-making-divider reveal-line delay-400"></div>
                    </div>
                    <p className="text-white text-base md:text-xl font-light leading-relaxed reveal-text delay-500" style={{ fontFamily: 'Manrope' }}>
                      You will find yourself working in a true partnership that results in an incredible experience and a product that is the best.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competencies Grid Section */}
      <section className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8 lg:px-[48px]">
        <div className="max-w-7xl mx-auto">
          {/* Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {competencies.map((competency, index) => (
              <a
                key={competency.id}
                href={competency.link}
                className={`group relative overflow-hidden rounded-lg bg-[#08222B] text-white transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] reveal reveal-up delay-${Math.min(100 + (index * 100), 600)}`}
                onMouseEnter={() => setHoveredCard(competency.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Image Container - Light image by default, original on hover */}
                <div className="relative h-40 md:h-48 lg:h-52 xl-1300:h-44 2xl:h-56 overflow-hidden">
                  <img
                    src={competency.image}
                    alt={competency.title}
                    className={`w-full h-full object-cover transition-all duration-500 reveal-image ${
                      hoveredCard === competency.id 
                        ? 'scale-110 brightness-100' 
                        : 'scale-100 brightness-[0.3]'
                    }`}
                    onError={(e) => {
                      e.target.src = '/assets/images/about-us-banner.jpg';
                    }}
                  />
                  {/* Light overlay - shown by default, hidden on hover */}
                  <div className={`absolute inset-0 bg-white transition-opacity duration-500 ${
                    hoveredCard === competency.id ? 'opacity-0' : 'opacity-10'
                  }`}></div>
                </div>

                {/* Content Container */}
                <div className="p-5 md:p-6 xl-1300:p-5 2xl:p-8">
                  <h3 className="text-lg md:text-xl lg:text-xl xl-1300:text-lg 2xl:text-2xl font-bold mb-2 xl-1300:mb-2 2xl:mb-3 group-hover:text-[#9CAEAF] transition-colors duration-300 reveal-text">
                    {competency.title}
                  </h3>
                  <p className="text-white/90 text-xs md:text-sm xl-1300:text-xs 2xl:text-base leading-relaxed reveal-text delay-100">
                    {competency.description}
                  </p>
                </div>

                {/* Hover Arrow Indicator */}
                <div className={`absolute bottom-6 right-6 transition-all duration-300 ${
                  hoveredCard === competency.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Alternative Layout Option: Stacked Image with Text Below */}
      <section className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8 lg:px-[48px] bg-white hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#08222B] mb-12 text-center">
            Our Competencies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {competencies.map((competency) => (
              <a
                key={competency.id}
                href={competency.link}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Image on Top */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={competency.image}
                    alt={competency.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = '/assets/images/about-us-banner.jpg';
                    }}
                  />
                </div>
                {/* Text Below */}
                <div className="p-6 bg-[#08222B] text-white">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[#9CAEAF] transition-colors">
                    {competency.title}
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {competency.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Competencies;

