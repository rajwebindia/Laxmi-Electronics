import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import SEOHead from './components/SEOHead';
import { getSEOData } from './utils/seoData';
import { loadRecaptcha } from './utils/recaptcha';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import MoldMaking from './pages/MoldMaking';
import ThermoplasticMolding from './pages/ThermoplasticMolding';
import MedicalMolding from './pages/MedicalMolding';
import AerospaceMolding from './pages/AerospaceMolding';
import BlowMolding from './pages/BlowMolding';
import SiliconeMolding from './pages/SiliconeMolding';
import AssemblyServices from './pages/AssemblyServices';
import ContactUs from './pages/ContactUs';
import Gallery from './pages/Gallery';
import Events from './pages/Events';
import Careers from './pages/Careers';
import Locations from './pages/Locations';
import Quality from './pages/Quality';
import Competencies from './pages/Competencies';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Component to handle scroll to hash on route change
function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
    } else {
      // Scroll to top when no hash
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return null;
}

// Component to handle reveal animations on route change
function RevealAnimations() {
  const location = useLocation();

  useEffect(() => {
    // Reset all reveal animations first
    try {
      const revealEls = Array.from(document.querySelectorAll('.reveal, .reveal-text, .reveal-image, .reveal-line'));
      revealEls.forEach((el) => {
        if (el && el.classList) {
          el.classList.remove('in', 'visible', 'animated');
        }
      });
    } catch (error) {
    }

    // Small delay to ensure DOM is ready after route change
    let observer = null;
    const timer = setTimeout(() => {
      try {
        // Enhanced IntersectionObserver with better performance
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('in');
                // For images, add a slight delay for smoother effect
                if (entry.target.classList.contains('reveal-image')) {
                  setTimeout(() => {
                    entry.target.classList.add('visible');
                  }, 100);
                } else {
                  entry.target.classList.add('visible');
                }
                // Once animated, we can unobserve for performance
                observer.unobserve(entry.target);
              }
            });
          },
          { 
            rootMargin: '0px 0px -5% 0px', 
            threshold: 0.1 
          }
        );
        
        // Observe all reveal elements
        const revealSelectors = ['.reveal', '.reveal-text', '.reveal-image', '.reveal-line'];
        revealSelectors.forEach((selector) => {
          const elements = Array.from(document.querySelectorAll(selector));
          elements.forEach((el) => {
            if (el) {
              observer.observe(el);
            }
          });
        });
      } catch (error) {
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      if (observer) {
        try {
          observer.disconnect();
        } catch (error) {
          // Silently handle cleanup errors
        }
      }
    };
  }, [location]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const seoData = getSEOData(location.pathname);
  const isAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    loadRecaptcha();
  }, []);

  return (
    <>
      <SEOHead {...seoData} />
      <div className={isAdminPage ? "min-h-screen" : "min-h-screen bg-gray-50"}>
        {!isAdminPage && <Navigation />}
        {!isAdminPage && <ScrollToHash />}
        {!isAdminPage && <RevealAnimations />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/mold-making" element={<MoldMaking />} />
          <Route path="/thermoplastic-molding" element={<ThermoplasticMolding />} />
          <Route path="/medical-molding" element={<MedicalMolding />} />
          <Route path="/aerospace-molding" element={<AerospaceMolding />} />
          <Route path="/blow-molding" element={<BlowMolding />} />
          <Route path="/silicone-molding" element={<SiliconeMolding />} />
          <Route path="/assembly-services" element={<AssemblyServices />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/quality" element={<Quality />} />
          <Route path="/competencies" element={<Competencies />} />
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/submissions" element={<AdminDashboard />} />
          <Route path="/admin/seo" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<AdminDashboard />} />
        </Routes>
        {!isAdminPage && <Footer />}
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;


