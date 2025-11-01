import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

