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
    { id: 'competencies', label: 'Competencies', href: '/competencies' },
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
      return active ? 'text-[#08222B]' : 'text-[#08222B]/90 hover:text-[#08222B]';
    }
    return active ? 'text-white' : 'text-white/90 hover:text-white';
  };

  const iconColor = isScrolled ? '#08222B' : '#FFFFFF';

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      {/* Full-width bar: transparent at top, white on scroll */}
      <div className={`${isScrolled ? 'bg-white' : 'bg-transparent'} w-full transition-colors duration-300`}>
        <div className="h-20 w-full px-[48px] flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="block w-[190px] h-10 relative flex items-center">
            <img
              src="/assets/logo.png"
              alt="Laxmi Electronics"
              className="w-full h-full object-contain object-left"
              onError={(e) => {
                e.currentTarget.src = 'https://www.laxmielectronics.com/wp-content/uploads/2021/10/logo-new-blak.png';
              }}
            />
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-2">
            {menuItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`px-3 py-2 text-[13px] font-semibold uppercase leading-[130%] tracking-[0.25px] rounded-md transition-colors ${linkClass(isCurrent(item.href))}`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA button (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/contact-us"
              className={`inline-flex items-center gap-2 px-3 py-2 rounded border transition cta-motion ${
                isScrolled
                  ? 'border-[#08222B]/20 text-[#08222B] hover:bg-[#08222B]/5'
                  : 'border-white/30 text-white hover:bg-white/10'
              }`}
            >
              <span className="text-[13px] font-extrabold uppercase leading-[130%] tracking-[0.25px]">Request a Quote</span>
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md focus:outline-none"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            style={{ color: iconColor }}
          >
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden px-[48px] pb-4 transition-[max-height,opacity] duration-300 ${mobileMenuOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="w-full rounded-none bg-white p-2">
            {menuItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`block px-3 py-3 rounded-md text-[13px] font-extrabold uppercase leading-[130%] tracking-[0.25px] ${
                  isCurrent(item.href) ? 'text-[#08222B]' : 'text-[#08222B]/90 hover:text-[#08222B]'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="/contact-us"
              className="mt-2 flex items-center justify-center gap-2 px-3 py-3 rounded-md text-[#08222B] border border-[#08222B]/20 hover:bg-[#08222B]/5"
            >
              <span className="text-[13px] font-extrabold uppercase leading-[130%] tracking-[0.25px]">Request a Quote</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

