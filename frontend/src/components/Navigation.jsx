import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const menuItems = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'about-us', label: 'About Us', href: '/about-us' },
    { id: 'mold-making', label: 'Mold Making', href: '/mold-making' },
    { id: 'molding', label: 'Molding', href: '/thermoplastic-molding' },
    { id: 'silicone-molding', label: 'Silicone Molding', href: '/silicone-molding' },
    { id: 'assembly-services', label: 'Assembly Services', href: '/assembly-services' },
    { id: 'gallery', label: 'Gallery', href: '/gallery' },
    { id: 'events', label: 'Events', href: '/events' },
    
  ];

  const isCurrent = (href) => href !== '#' && location.pathname === href;

  const linkClass = (active) => {
    if (isScrolled) {
      return active ? 'text-[#f15a22]' : 'text-[#08222B]/90 hover:text-[#f15a22]';
    }
    return active ? 'text-[#f15a22]' : 'text-white/90 hover:text-[#f15a22]';
  };

  const iconColor = isScrolled ? '#08222B' : '#FFFFFF';

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      {/* Full-width bar: transparent at top, white on scroll */}
      <div className={`${isScrolled ? 'bg-white' : 'bg-transparent'} w-full transition-colors duration-300`}>
        <div className="h-14 sm:h-16 md:h-[72px] lg:h-20 w-full px-3 sm:px-4 md:px-6 lg:px-[48px] flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
          {/* Logo */}
          <a href="/" className="block w-[120px] sm:w-[160px] md:w-[170px] lg:w-[190px] h-7 sm:h-8 md:h-9 lg:h-10 relative flex items-center flex-shrink-0">
            <img
              src="/assets/logo.png"
              alt="Laxmi Electronics"
              className="w-full h-full object-contain object-left"
              onError={(e) => {
                e.currentTarget.src = 'https://www.laxmielectronics.com/wp-content/uploads/2021/10/logo-new-blak.png';
              }}
            />
          </a>

          {/* Desktop Links - Show only at lg+ to prevent overlap */}
          <div className="hidden lg:flex items-center gap-2 flex-1 justify-center min-w-0 overflow-hidden">
            {menuItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`px-[10px] py-[10px] text-[13px] font-semibold uppercase leading-[130%] rounded-md transition-colors whitespace-nowrap flex-shrink-0 ${linkClass(isCurrent(item.href))}`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA button - Show at lg+ */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <a
              href="/contact-us"
              className={`inline-flex items-center gap-2 px-3 py-2 rounded border transition cta-motion ${
                isScrolled
                  ? 'border-[#08222B]/20 text-[#08222B] hover:bg-[#08222B]/5'
                  : 'border-white/30 text-white hover:bg-white/10'
              }`}
            >
              <span className="text-[13px] font-extrabold uppercase leading-[130%] whitespace-nowrap">Request a Quote</span>
            </a>
          </div>

          {/* Mobile/Tablet toggle - Show below lg (mobile and tablet) */}
          <button
            className="lg:hidden p-2 rounded-md focus:outline-none flex-shrink-0"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            style={{ color: iconColor }}
          >
            <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile/Tablet menu */}
        <div className={`lg:hidden fixed inset-0 top-[56px] sm:top-[64px] md:top-[72px] z-40 transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}>
          {/* Backdrop overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-white shadow-2xl overflow-y-auto">
            <div className="w-full min-h-full flex flex-col">
              {/* Menu Items */}
              <div className="px-4 sm:px-6 py-6 space-y-2 flex-1">
                {menuItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className={`block px-5 py-4 rounded-xl text-sm sm:text-base font-semibold uppercase tracking-wide transition-all duration-200 ${
                      isCurrent(item.href)
                        ? 'bg-[#f15a22]/10 text-[#f15a22] shadow-lg transform scale-[1.02]'
                        : 'text-[#08222B] hover:text-[#f15a22] hover:bg-[#f15a22]/10 active:bg-[#f15a22]/20 hover:shadow-md'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              
              {/* CTA Button - Sticky at bottom */}
              <div className="px-4 sm:px-6 pb-6 pt-4 mt-auto border-t border-gray-200 bg-white">
                <a
                  href="/contact-us"
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#08222B] text-white font-extrabold uppercase tracking-wide text-sm sm:text-base shadow-lg hover:bg-[#08222B]/90 active:bg-[#08222B]/80 active:scale-[0.98] transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Request a Quote</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

