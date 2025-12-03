import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
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

function App() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <ScrollToHash />
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
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

