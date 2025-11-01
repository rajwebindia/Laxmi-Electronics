import React from 'react';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-[#08222B] text-white">
      {/* Top CTA */}
      <div className="w-full px-[48px] py-20 grid grid-cols-1 md:grid-cols-1 gap-10 items-center">
        <div className="text-center md:text-left">
          <p className="faster-turnarounds-heading">
            Faster Turnarounds <span className="faster-turnarounds-assured footer-grad-2">Assured</span>
          </p>
        </div>
        
      </div>

      {/* Main Footer Content */}
      <div className="relative">
        {/* blur ellipses */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-[300px] h-[300px] rounded-full" style={{ backgroundColor: 'rgba(23,103,130,0.4)', filter: 'blur(80px)' }} />
        <div className="pointer-events-none absolute top-24 left-1/3 w-[420px] h-[420px] rounded-full" style={{ backgroundColor: 'rgba(23,103,130,0.4)', filter: 'blur(142px)' }} />
        <div className="pointer-events-none absolute -bottom-24 right-1/4 w-[360px] h-[360px] rounded-full" style={{ backgroundColor: 'rgba(23,103,130,0.34)', filter: 'blur(90px)' }} />

        <div className="relative w-full px-[48px] pb-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            
            {/* Column 1: Logo + newsletter + socials */}
            <div className="md:col-span-5 space-y-8">
            <div className='touch-section mb-12'>
            <h3 className="footer-section-heading">GET IN TOUCH</h3>  
            <p className="text-white/90 text-sm">We are here to help and answer any question you might have.</p>
            <p className="text-white/90 text-sm">We look forward to hearing from you.</p>
            </div>
              <img src="/assets/images/footer-logo-w.png" alt="Laxmi Electronics" className="h-12 object-contain" />
              <div className="space-y-3">
                <p className="text-white/90 text-sm">We blend seamless integration, economic viability, engineering excellence, 
total quality management and certified manufacturing processes to enable a 
quick turnaround from concept to product.</p>
               
              </div>
              
            </div>

            {/* Column 2: Navigate */}
            <div className="md:col-span-2">
              <ul className="space-y-1 text-white/90">
                <li><a href="/" className="hover:text-white text-sm">Home</a></li>
                <li><a href="/about-us" className="hover:text-white text-sm">About Us</a></li>
                <li><a href="/competencies" className="hover:text-white text-sm">Competencies</a></li>
                <li><a href="/industries-served" className="hover:text-white text-sm">Industries Served</a></li>
                <li><a href="/quality" className="hover:text-white text-sm">Quality</a></li>
                <li><a href="/locations" className="hover:text-white text-sm">Locations</a></li>
                <li><a href="/careers" className="hover:text-white text-sm">Careers</a></li>
                <li><a href="/contact-us" className="hover:text-white text-sm">Contact Us</a></li>
                <li><a href="/gallery" className="hover:text-white text-sm">Gallery</a></li>
                <li><a href="/events" className="hover:text-white text-sm">Events</a></li>
              </ul>
            </div>

            {/* Column 3: Molding Services */}
            <div className="md:col-span-2">
              <ul className="space-y-1 text-white/90">
                <li><a href="/mold-making" className="hover:text-white text-sm">Mold Making</a></li>
                <li><a href="/injection-molding" className="hover:text-white text-sm">Injection Molding</a></li>
                <li><a href="/medical-molding" className="hover:text-white text-sm">Medical Molding</a></li>
                <li><a href="/aerospace-molding" className="hover:text-white text-sm">Aerospace Molding</a></li>
                <li><a href="/blow-molding" className="hover:text-white text-sm">Blow Molding</a></li>
                <li><a href="/silicone-molding-lsr" className="hover:text-white text-sm">Silicone Molding - LSR</a></li>
                <li><a href="/silicone-molding-hcr" className="hover:text-white text-sm">Silicone Molding - HCR</a></li>
                <li><a href="/2k-molding" className="hover:text-white text-sm">2K Molding</a></li>
                <li><a href="/assembly" className="hover:text-white text-sm">Assembly</a></li>
              </ul>
            </div>

            {/* Column 4: Contacts */}
            <div className="md:col-span-3 space-y-4">
              <h6 className="footer-section-heading">Contact Us</h6>
              <div className="space-y-3">
                {/* Email */}
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-white mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="flex-1"><a href="mailto:info@laxmielectronics.com" className="hover:text-white">info@laxmielectronics.com</a></p>
                </div>
                
                {/* Address */}
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-white mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-white/90 flex-1">
                    Plot No. 81,<br />
                    EPIP Area, Whitefield,<br />
                    Bangalore 560 066, INDIA
                  </p>
                </div>
                
                {/* Website */}
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-white mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <p className="flex-1"><a href="https://www.laxmielectronics.co" target="_blank" rel="noopener noreferrer" className="hover:text-white">www.laxmielectronics.co</a></p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row items-center md:justify-end gap-4 text-white/80 text-sm">
            <p className="md:text-right">© Copyright Laxmi Electronics. All rights reserved.</p>
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


