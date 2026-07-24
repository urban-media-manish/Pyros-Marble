import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import Contact from './components/Contact';
import ProductDetails from './components/ProductDetails';
import WorldMap from './components/WorldMap';
import AboutUs from './components/AboutUs';
import Blog from './components/Blog';
import CallToAction from './components/CallToAction';
import PortsShowcase from './components/PortsShowcase';
import EnquiryModal from './components/EnquiryModal';
import InteractiveCollection from './components/InteractiveCollection';
import { stones } from './data/stoneData';
import { ArrowUp, Ship, Heart, Shield, Globe, Award, CheckCircle, Package, ArrowRight, Layers, Mountain, Hammer, Sparkles, Search, Quote, Star, ChevronLeft, ChevronRight, Instagram, Facebook, Linkedin, Calendar, Clock } from 'lucide-react';

// Premium Animated Counter Component
function AnimatedCounter({ value, duration = 1500, suffix = "" }) {
  const [count, setCount] = useState(0);
  const elementRef = React.useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasStarted) {
        setHasStarted(true);
      }
    }, { threshold: 0.1 });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end)) {
      setCount(value);
      return;
    }
    if (start === end) return;

    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, value, duration]);

  return <span ref={elementRef}>{count}{suffix}</span>;
}

// Intersection Observer based progress bar component
function ProgressBar({ label, percentage }) {
  const [width, setWidth] = useState(0);
  const ref = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          setWidth(percentage);
        }, 150);
      }
    }, { threshold: 0.1 });

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [percentage]);

  return (
    <div ref={ref} className="space-y-2 text-left">
      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#1C1C21]">
        <span>{label}</span>
        <span className="text-[#D4AF37] font-mono">{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-neutral-200/60 rounded-full overflow-hidden border border-black/5">
        <div
          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#b59228] rounded-full progress-bar-fill shadow-[0_0_10px_rgba(212,175,55,0.3)]"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // home, about-us, catalog, contact, product
  const [catalogCategory, setCatalogCategory] = useState('all');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryProduct, setEnquiryProduct] = useState('');
  const [activeFaq, setActiveFaq] = useState(0);
  const [activeJourneyStep, setActiveJourneyStep] = useState(0);

  useEffect(() => {
    window.openEnquiryModal = (productName = '') => {
      setEnquiryProduct(productName);
      setIsEnquiryOpen(true);
    };
    return () => {
      delete window.openEnquiryModal;
    };
  }, []);

  // Scroll Reveal Observer Effect (IntersectionObserver + MutationObserver for React dynamic DOM changes)
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px', // slightly offset to trigger just before coming fully into view
      threshold: 0.05
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      });
    }, observerOptions);

    // Initial query scan
    const scanAndObserve = () => {
      const revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach(el => {
        observer.observe(el);
        // If element is already inside viewport on load, activate immediately
        const rect = el.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
          el.classList.add('reveal-active');
        }
      });
    };

    scanAndObserve();

    // Set a small delay scan to catch delayed React updates
    const timer = setTimeout(scanAndObserve, 200);

    // Mutation Observer to auto-detect any newly injected React components/elements with .reveal class
    const mutationObserver = new MutationObserver(() => {
      scanAndObserve();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [currentPage]);

  // Dynamic Hash Route Parser
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';

      if (hash.startsWith('#/product/')) {
        const id = hash.replace('#/product/', '');
        setSelectedProductId(id);
        setCurrentPage('product');
      } else if (hash === '#/about-us' || hash === '#about-us') {
        setCurrentPage('about-us');
      } else if (hash.startsWith('#/catalog') || hash.startsWith('#catalog')) {
        const cleanHash = hash.replace(/^#\/?/, '');
        const parts = cleanHash.split('/');
        if (parts.length > 1 && parts[1]) {
          setCatalogCategory(parts[1]);
        } else {
          setCatalogCategory('all');
        }
        setCurrentPage('catalog');
      } else if (hash === '#/blog' || hash === '#blog') {
        setCurrentPage('blog');
      } else if (hash === '#/contact' || hash === '#contact') {
        setCurrentPage('contact');
      } else {
        setCurrentPage('home');
      }
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // parse initial hash load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (pageId) => {
    if (pageId === 'home') {
      window.location.hash = '#/';
    } else {
      window.location.hash = `#/${pageId}`;
    }
  };

  const handleSelectForCalculator = (stone) => {
    window.location.hash = `#/product/${stone.id}`;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Featured Stones on Homepage
  const featuredStones = stones.filter(s =>
    s.id === 'indian-carrara' || s.id === 'absolute-black' || s.id === 'titanium-gold'
  );

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#1C1C21] font-inter selection:bg-[#D4AF37] selection:text-black flex flex-col justify-between overflow-x-hidden">

      {/* Dynamic Header */}
      <Header
        activeSection={currentPage === 'home' ? 'hero' : currentPage}
        setActiveSection={(id) => navigateTo(id === 'hero' ? 'home' : id)}
      />

      {/* Dynamic Page Views */}
      <main className={`flex-grow ${currentPage === 'home' ? '' : 'pt-16'}`}>
        {currentPage === 'home' && (
          <>
            <Hero onExploreClick={navigateTo} />

            {/* Premium Stats Banner */}
            <div className="relative z-20 -mt-10 sm:-mt-14 max-w-7xl mx-auto px-4 sm:px-6 w-full reveal reveal-slide-up delay-300">
              <div className="bg-[#1C1C21]/95 backdrop-blur-md border border-[#D4AF37]/35 rounded-xl sm:rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:border-[#D4AF37]/65 transition-all duration-500 p-5 sm:p-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:divide-x lg:divide-white/10">

                  {/* Stat 1: Heritage */}
                  <div className="flex items-center gap-3 sm:gap-4 px-2 sm:px-4 group hover:translate-y-[-2px] transition-transform duration-300">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37]/20 group-hover:scale-110 transition-all duration-300">
                      <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="font-outfit text-lg sm:text-2xl font-bold text-white tracking-tight">
                        <AnimatedCounter value="10" suffix="+" /> Yrs
                      </div>
                      <div className="text-[10px] sm:text-xs text-white/60 uppercase tracking-widest font-semibold mt-0.5">
                        Heritage
                      </div>
                    </div>
                  </div>

                  {/* Stat 2: Secure Cargo */}
                  <div className="flex items-center gap-3 sm:gap-4 px-2 sm:px-4 group hover:translate-y-[-2px] transition-transform duration-300 lg:pl-8">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37]/20 group-hover:scale-110 transition-all duration-300">
                      <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="font-outfit text-lg sm:text-2xl font-bold text-white tracking-tight">
                        <AnimatedCounter value="100" suffix="%" />
                      </div>
                      <div className="text-[10px] sm:text-xs text-white/60 uppercase tracking-widest font-semibold mt-0.5">
                        Secure Cargo
                      </div>
                    </div>
                  </div>

                  {/* Stat 3: Gloss Luster */}
                  <div className="flex items-center gap-3 sm:gap-4 px-2 sm:px-4 group hover:translate-y-[-2px] transition-transform duration-300 lg:pl-8">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37]/20 group-hover:scale-110 transition-all duration-300">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="font-outfit text-lg sm:text-2xl font-bold text-white tracking-tight">
                        <AnimatedCounter value="95" suffix="+" />
                      </div>
                      <div className="text-[10px] sm:text-xs text-white/60 uppercase tracking-widest font-semibold mt-0.5">
                        Gloss Luster
                      </div>
                    </div>
                  </div>

                  {/* Stat 4: SGS Certified */}
                  <div className="flex items-center gap-3 sm:gap-4 px-2 sm:px-4 group hover:translate-y-[-2px] transition-transform duration-300 lg:pl-8">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37]/20 group-hover:scale-110 transition-all duration-300">
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="font-outfit text-lg sm:text-2xl font-bold text-[#D4AF37] tracking-tight">
                        SGS
                      </div>
                      <div className="text-[10px] sm:text-xs text-white/60 uppercase tracking-widest font-semibold mt-0.5">
                        Certified
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* SECTION 1: Brief About Us (Tilux Style Overlapping Images & Progress Bars) */}
            <section className="py-24 bg-[#F5EFEB] border-t border-b border-[#EADCC9] overflow-hidden">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

                {/* Overlapping Images (Left) */}
                <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-start reveal reveal-slide-left">
                  <div className="w-[85%] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-[#EADCC9] bg-neutral-100">
                    <img
                      src="/about_us_yard.png"
                      alt="Udaipur Processing Yard"
                      onError={(e) => {
                        e.target.src = "/logo.jpeg";
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-[-8%] right-0 w-[55%] aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-neutral-100">
                    <img
                      src="/about_us_factory_saw.png"
                      alt="Calibrated Marble Blocks"
                      onError={(e) => {
                        e.target.src = "/about-us-factory.jpg";
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Rotating Circular Badge */}
                  <div className="absolute top-[40%] left-[-10%] w-28 h-28 z-20 select-none hidden sm:block">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
                        <defs>
                          <path id="circlePathAbout" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                        </defs>
                        <text className="text-[7.5px] fill-[#D4AF37] font-bold tracking-[0.22em] uppercase font-mono">
                          <textPath xlinkHref="#circlePathAbout">
                            PYROS EXPORTS · LUXURY STONES ·
                          </textPath>
                        </text>
                      </svg>
                      <div
                        onClick={() => navigateTo('about-us')}
                        className="absolute w-12 h-12 bg-[#D4AF37] text-black rounded-full flex items-center justify-center shadow-lg border border-white/20 cursor-pointer hover:bg-black hover:text-[#D4AF37] transition-all duration-300"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Content & Progress Bars (Right) */}
                <div className="lg:col-span-7 space-y-8 text-left reveal reveal-slide-right delay-200">
                  <div className="space-y-4">
                    <span className="font-outfit text-xs tracking-widest text-[#D4AF37] uppercase font-bold block">
                      About Our Company
                    </span>
                    <h2 className="font-cormorant text-3xl sm:text-5xl font-medium text-[#1C1C21] leading-tight">
                      Designed for premium living, built for everyday life
                    </h2>
                    <p className="font-inter text-sm text-[#4E4E59] leading-relaxed font-light">
                      Pyros is India's leading exporter of premium natural stones under the Rising Exports Group. We utilize automated Italian diamond cutting technology to calibrate thickness tolerance down to a precise ±1mm.
                    </p>
                  </div>

                  {/* Dynamic Progress Bars */}
                  <div className="space-y-5 border-y border-[#EADCC9] py-6">
                    <ProgressBar label="Italian Cutting Calibration (Tolerance ±1mm)" percentage={99} />
                    <ProgressBar label="Gloss Luster Polish Rating (95+ Gloss)" percentage={95} />
                    <ProgressBar label="Logistics & Customs Clearances" percentage={100} />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => navigateTo('about-us')}
                      className="px-6 py-3.5 bg-transparent border border-[#D4AF37]/50 text-[#1C1C21] hover:border-[#D4AF37] hover:text-[#D4AF37] text-xs tracking-wider uppercase font-semibold rounded transition-all flex items-center gap-2 shadow-sm"
                    >
                      More About Us
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </section>

            {/* SECTION 3: Rebuilt Featured Collections (Vibrant Tilux-style Grid) */}
            <section className="py-24 bg-[#FFFFFF] border-b border-[#EADCC9] overflow-hidden">
              <div className="max-w-7xl mx-auto px-6">

                {/* Title */}
                <div className="text-center mb-16 max-w-3xl mx-auto reveal reveal-slide-up">
                  <span className="font-outfit text-xs tracking-[0.25em] text-[#D4AF37] uppercase font-bold block mb-2">
                    Premium Slabs
                  </span>
                  <h2 className="font-cormorant text-4xl sm:text-5xl font-medium text-[#1C1C21]">
                    Discover Our Premium Stone Collections
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
                  {[
                    {
                      id: 'catalog/quartzite',
                      title: 'Quartz & Quartzite',
                      desc: 'Engineered Calacatta & natural Taj Mahal quartzite slabs with high hardness & zero porosity.',
                      image: '/quartz_quartzite_collection.png',
                    },
                    {
                      id: 'catalog/sandstone',
                      title: 'Sandstone & Slate',
                      desc: 'Teakwood sandstone & Kota blue slate for rustic exterior architectural facades & pool decks.',
                      image: '/sandstone_slate_collection.png',
                    }
                  ].map((col, idx) => (
                    <div
                      key={col.id}
                      onClick={() => navigateTo(col.id)}
                      className={`group cursor-pointer relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-3xl border border-[#EADCC9]/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 reveal reveal-slide-up delay-${(idx + 1) * 100}`}
                    >
                      {/* Full-height backdrop image */}
                      <img
                        src={col.image}
                        alt={col.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0"
                        onError={(e) => { e.target.src = '/logo.jpeg'; }}
                      />

                      {/* Gradient Overlay for high-contrast legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C21]/95 via-[#1C1C21]/45 to-transparent z-10 transition-colors duration-300" />

                      {/* Text content overlay positioned absolute at the bottom */}
                      <div className="absolute inset-0 p-6 z-20 flex flex-col justify-end text-left select-none">
                        <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold mb-1">
                          Collection
                        </span>
                        <h3 className="font-cormorant text-xl sm:text-2xl font-bold text-white leading-tight group-hover:text-[#D4AF37] transition-colors duration-300">
                          {col.title}
                        </h3>
                        <p className="font-inter text-xs text-white/70 leading-relaxed font-light mt-2 max-h-0 opacity-0 group-hover:max-h-[60px] group-hover:opacity-100 overflow-hidden transition-all duration-500">
                          {col.desc}
                        </p>

                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[9px] text-[#D4AF37] font-semibold uppercase tracking-wider">
                          <span>Browse Collection</span>
                          <div className="w-7 h-7 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors duration-300">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Free Quote Button CTA */}
                <div className="mt-12 text-center reveal reveal-slide-up">
                  <button
                    onClick={() => {
                      if (window.openEnquiryModal) {
                        window.openEnquiryModal();
                      } else {
                        navigateTo('contact');
                      }
                    }}
                    className="inline-flex px-8 py-4 bg-[#D4AF37] hover:bg-[#b59228] text-black text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-lg items-center gap-2"
                  >
                    Get Free Quote
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </section>

            {/* SECTION 2: Why Choose Us (Tilux Style Split Layout & Global Presence) */}
            <section className="py-24 bg-[#FAF9F6] overflow-hidden">
              <div className="max-w-7xl mx-auto px-6">

                {/* Title split row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 border-b border-[#EADCC9] pb-8 reveal reveal-slide-up">
                  <div className="lg:col-span-6">
                    <span className="font-outfit text-xs tracking-[0.25em] text-[#D4AF37] uppercase font-bold block mb-2">Why Choose Us</span>
                    <h2 className="font-cormorant text-4xl sm:text-5xl font-medium text-[#1C1C21] leading-tight">
                      Quality, craftsmanship, and reliability you can trust
                    </h2>
                  </div>
                  <div className="lg:col-span-6">
                    <p className="font-inter text-sm text-[#4E4E59] leading-relaxed font-light">
                      We combine premium raw materials sourced directly from exclusive quarries, expert Italian gangsaw machinery, and strict multi-head line polishers to deliver surfaces that stand the test of time.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                  {/* Left Column (Desktop): Quote, Numbers & Target Markets (7 Columns) - Stacks top on mobile */}
                  <div className="lg:col-span-7 space-y-8 text-left reveal reveal-slide-right delay-200 order-1 lg:order-1">

                    {/* Quote Widget */}
                    <div className="bg-[#F5EFEB] border border-[#EADCC9] p-6 rounded-2xl relative shadow-md">
                      <p className="font-cormorant text-lg italic text-[#1C1C21] leading-relaxed">
                        “ We don't just process tiles and marble slabs; we craft architectural surfaces engineered to withstand generations of daily life with absolute calibration integrity. ”
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="w-4 h-0.5 bg-[#D4AF37]" />
                        <span className="font-outfit text-[9px] tracking-widest text-[#D4AF37] uppercase font-bold">Udaipur Operations Desk</span>
                      </div>
                    </div>

                    {/* Global Presence stats */}
                    <div className="flex items-center gap-6">
                      <div className="font-outfit text-5xl font-bold text-[#D4AF37] tracking-tight">
                        100<span className="text-[#1C1C21] font-light">+</span>
                      </div>
                      <div>
                        <h4 className="font-outfit text-sm font-bold text-[#1C1C21] uppercase tracking-wider">Global Export Footprint</h4>
                        <p className="font-inter text-xs text-[#4E4E59] leading-relaxed font-light mt-0.5 max-w-sm">
                          Our active logistics corridors deliver custom FCL containers directly to distributors in over 100 regions globally.
                        </p>
                      </div>
                    </div>

                    {/* Export Markets Badging */}
                    <div className="bg-white border border-[#EADCC9] p-6 rounded-2xl space-y-4 shadow-sm">
                      <div className="font-outfit text-xs font-bold text-[#1C1C21] uppercase tracking-wider">
                        Active Supply Channels
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {['United States', 'Saudi Arabia', 'United Arab Emirates', 'United Kingdom', 'European Union', 'Australia'].map((market, idx) => (
                          <div
                            key={idx}
                            className="px-3.5 py-2 bg-neutral-50 border border-neutral-200 hover:border-[#D4AF37] hover:bg-white text-[10px] uppercase font-bold tracking-widest text-neutral-600 hover:text-black rounded-lg transition-all shadow-sm"
                          >
                            {market}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right Column (Desktop): Photo with Floating Customer Badge (5 Columns) - Stacks bottom on mobile */}
                  <div className="lg:col-span-5 relative reveal reveal-slide-left order-2 lg:order-2">
                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-[#EADCC9] aspect-[4/5] bg-neutral-100">
                      <img
                        src="/why_choose_us_slabs.png"
                        alt="Calibrated Slabs Stack"
                        onError={(e) => {
                          e.target.src = "/premium_photo-1661963559074-9655a9404f1a.avif";
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Floating Customers Badge */}
                    <div className="absolute bottom-6 left-6 right-6 bg-[#1C1C21]/95 backdrop-blur-md border border-white/10 rounded-xl p-5 shadow-2xl text-left">
                      <div className="flex -space-x-2.5 mb-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="w-8 h-8 rounded-full border border-white/20 bg-neutral-800 flex items-center justify-center text-[9px] font-bold font-mono text-[#D4AF37] shadow-md">
                            C{i}
                          </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border border-[#D4AF37] bg-[#D4AF37] text-black flex items-center justify-center text-[9px] font-bold shadow-md">
                          5★
                        </div>
                      </div>
                      <p className="text-xs text-white/90 leading-normal font-light">
                        Chosen by <strong className="text-[#D4AF37]">2,000+ Clients Worldwide</strong> for Premium Tiles & Marble Quality.
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* NEW SECTION: Primary Departure Ports (PDF Specs matching) */}
            <section className="py-24 bg-[#FAF4EC] border-b border-[#EADCC9] overflow-hidden">
              <div className="max-w-7xl mx-auto px-6">

                {/* Heading */}
                <div className="flex justify-between items-end mb-16 gap-6 reveal reveal-slide-up">
                  <div className="text-left max-w-2xl">
                    <span className="font-outfit text-xs tracking-[0.25em] text-[#D4AF37] uppercase font-bold block mb-2">Indian Dispatch Hubs</span>
                    <h2 className="font-cormorant text-4xl sm:text-5xl font-medium text-[#1C1C21]">Our Primary Departure Ports</h2>
                    <p className="font-inter text-sm text-[#4E4E59] leading-relaxed font-light mt-4 hidden sm:block">
                      We coordinate FCL shipments through India's premier container ports. Select a port below to view active stone cargo exports, specific images, and file inquiries.
                    </p>
                  </div>

                  {/* Slider Control Arrows in the Top Right of the section header */}
                  <div className="flex items-center gap-2.5 pb-1 md:hidden shrink-0">
                    <button
                      onClick={() => {
                        document.getElementById('ports-showcase-scroll').scrollBy({ left: -240, behavior: 'smooth' });
                      }}
                      className="w-9 h-9 rounded-full border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
                      aria-label="Previous port cargo card"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        document.getElementById('ports-showcase-scroll').scrollBy({ left: 240, behavior: 'smooth' });
                      }}
                      className="w-9 h-9 rounded-full border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
                      aria-label="Next port cargo card"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Ports Showcase Tabs and filtered grids */}
                <div className="reveal reveal-slide-up delay-200">
                  <PortsShowcase />
                </div>

              </div>
            </section>

            {/* NEW SECTION: Interactive Processing Journey (Luxury Minimalist 5-Column Grid Layout) */}
            <section className="py-24 bg-[#FAF9F6] border-b border-[#EADCC9] overflow-hidden">
              <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex justify-between items-end mb-16 gap-6 reveal reveal-slide-up">
                  <div className="text-left max-w-2xl">
                    <span className="font-outfit text-xs tracking-[0.25em] text-[#D4AF37] uppercase font-bold block mb-2">How We Work</span>
                    <h2 className="font-cormorant text-4xl sm:text-5xl font-medium text-[#1C1C21]">Our Processing Journey</h2>
                    <p className="font-inter text-sm text-[#4E4E59] leading-relaxed font-light mt-4 hidden sm:block">
                      We maintain absolute calibration, veining integrity, and polishing luster levels throughout our five production stages.
                    </p>
                  </div>

                  {/* Slider Control Arrows in the Top Right of the section header */}
                  <div className="flex items-center gap-2.5 pb-1 lg:hidden shrink-0">
                    <button
                      onClick={() => {
                        document.getElementById('processing-journey-scroll').scrollBy({ left: -240, behavior: 'smooth' });
                      }}
                      className="w-9 h-9 rounded-full border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
                      aria-label="Previous step"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        document.getElementById('processing-journey-scroll').scrollBy({ left: 240, behavior: 'smooth' });
                      }}
                      className="w-9 h-9 rounded-full border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
                      aria-label="Next step"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 5-Column horizontal responsive timeline */}
                <div
                  id="processing-journey-scroll"
                  className="flex lg:grid lg:grid-cols-5 overflow-x-auto no-scrollbar gap-6 pb-6 lg:pb-0 snap-x snap-mandatory scroll-smooth w-full"
                >
                  {[
                    {
                      step: '01',
                      title: 'Block Sourcing',
                      desc: 'Hand-selecting raw block formations directly from verified Udaipur white marble quarries and southern granite veins.',
                      image: '/block_sourcing.png'
                    },
                    {
                      step: '02',
                      title: 'Calibrated Slicing',
                      desc: 'Using automated Italian diamond wire gangsaws to slice block sections down to precise thickness tolerances.',
                      image: '/calibrated_slicing.png'
                    },
                    {
                      step: '03',
                      title: 'Vacuum Curing',
                      desc: 'Applying vacuum epoxy cures to reinforce structural veining integrity and eliminate porous micro-fissures.',
                      image: '/vacuum_curing.png'
                    },
                    {
                      step: '04',
                      title: 'Gloss Meter Reading',
                      desc: 'Verifying surface gloss levels using precision gloss meters, ensuring reflectivity meets a 95+ GU benchmark.',
                      image: '/ai_marble_laser_scan.png'
                    },
                    {
                      step: '05',
                      title: 'Secure Lashing',
                      desc: 'Packing finished slabs inside fumigated ISPM-15 pine crates secured with high-tension steel straps.',
                      image: '/secure_lashing.png'
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="card-3d shrink-0 snap-center min-w-[220px] lg:min-w-0 w-[72vw] lg:w-full h-[380px]">
                      <div
                        className="card-3d-inner bg-white border border-[#EADCC9] p-6 rounded-2xl flex flex-col justify-between h-full shadow-sm hover:border-[#D4AF37]/50 transition-all duration-300 group"
                      >
                        <div className="text-left">
                          <span className="font-cormorant text-5xl font-bold text-[#D4AF37]/30 group-hover:text-[#D4AF37] transition-colors duration-300 block translate-3d-title">
                            {item.step}
                          </span>
                          <div className="w-8 h-0.5 bg-[#D4AF37]/30 group-hover:w-16 transition-all duration-500 mt-2" />
                          <h3 className="font-outfit text-xs font-bold text-[#1C1C21] mt-4 uppercase tracking-wider block translate-3d-title">
                            {item.title}
                          </h3>
                          <p className="font-inter text-[11px] text-[#8E8E93] leading-relaxed font-light mt-2 block translate-3d-desc">
                            {item.desc}
                          </p>
                        </div>

                        <div className="w-full aspect-[2/1] rounded-lg overflow-hidden border border-neutral-100 bg-neutral-100 mt-4 shadow-inner translate-3d-icon">
                          <img
                            src={item.image}
                            alt={item.title}
                            onError={(e) => {
                              if (item.step === '01') {
                                e.target.src = '/logo.jpeg';
                              } else if (item.step === '02') {
                                e.target.src = '/about-us-factory.jpg';
                              } else if (item.step === '03') {
                                e.target.src = 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop';
                              } else if (item.step === '04') {
                                e.target.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop';
                              } else if (item.step === '05') {
                                e.target.src = '/logo.jpeg';
                              }
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* SECTION 4: Our Products & Partner Logo Slider */}
            <section className="py-24 bg-[#FAF6F0] border-b border-[#EADCC9] overflow-hidden">
              <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-16 max-w-3xl mx-auto reveal reveal-slide-up">
                  <span className="font-outfit text-xs tracking-[0.25em] text-[#D4AF37] uppercase font-bold block mb-2">Our Products</span>
                  <h2 className="font-cormorant text-4xl sm:text-5xl font-medium text-[#1C1C21]">Timeless tiles & marble designs</h2>
                  <p className="font-inter text-sm text-[#4E4E59] leading-relaxed font-light mt-4">
                    A refined collection of natural stone slabs and engineered quartz surfaces, styled to bring lasting beauty and sophistication to luxury developments.
                  </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                  {[
                    {
                      title: 'Décor Carving Glossy',
                      desc: 'Glossy décor carving surfaces crafted with intricate texturing and reflective highlights, designed to add depth to executive lobby walls.',
                      icon: Sparkles
                    },
                    {
                      title: 'Endless Glossy Vein',
                      desc: 'Endless glossy surfaces designed with continuous book-matched patterns and a 95+ high-shine finish for expansive commercial flooring.',
                      icon: Layers
                    },
                    {
                      title: 'Statuario Marble Look',
                      desc: 'Elite quartz formulations inspired by classic Italian Statuario marble, featuring bright white backgrounds and dramatic bold veins.',
                      icon: Award
                    }
                  ].map((prod, idx) => {
                    const Icon = prod.icon;
                    return (
                      <div key={idx} className="card-3d h-full">
                        <div
                          className="card-3d-inner bg-[#D4AF37] border border-[#b59228] p-8 rounded-2xl flex flex-col justify-between h-full shadow-lg group"
                        >
                          <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-[#1C1C21] text-[#D4AF37] flex items-center justify-center translate-3d-icon">
                              <Icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-outfit text-lg font-bold text-[#1C1C21] translate-3d-title">{prod.title}</h3>
                            <p className="font-inter text-xs text-[#1C1C21]/80 leading-relaxed font-medium translate-3d-desc">{prod.desc}</p>
                          </div>
                          <div className="mt-8 pt-4 border-t border-[#1C1C21]/15">
                            <button
                              onClick={() => navigateTo('catalog')}
                              className="text-xs font-bold uppercase tracking-wider text-[#1C1C21] hover:text-black transition-colors flex items-center gap-2"
                            >
                              View Products
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Looping Partner Marquee Slider */}
                <div className="pt-12 text-center reveal reveal-slide-up">
                  <span className="font-outfit text-[9px] uppercase tracking-widest text-[#8E8E93] font-bold block mb-4">
                    Partnering with Trusted Suppliers and Industry Experts
                  </span>

                  {/* Full-Width Marquee Strip (Patti BG) */}
                  <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] overflow-hidden py-6 bg-[#1C1C21] border-y border-[#D4AF37]/25 shadow-xl">
                    <div className="flex gap-16 items-center animate-marquee whitespace-nowrap min-w-max justify-around">
                      {/* Repeat twice for seamless loop */}
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex gap-16 items-center">
                          {['SGS CERTIFIED', 'ISO 9001:2015', 'APEDA MEMBER', 'CAPEXIL EXPORTER', 'GST REGISTERED', 'IEC COMPLIANT'].map((logo, idx) => (
                            <span
                              key={idx}
                              className="font-outfit text-xs font-bold tracking-[0.25em] text-white/90 hover:text-[#D4AF37] cursor-default transition-colors uppercase flex items-center gap-2"
                            >
                              <span className="text-[#D4AF37] font-sans">✦</span> {logo}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* SECTION 5: Core Features & Expandable Accordion (Tilux-style qualities) */}
            <section className="py-24 bg-[#FFFFFF] border-b border-[#EADCC9] overflow-hidden">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

                  {/* Left Side (Desktop): Accordion elements (7 Columns) - Stacks top on mobile */}
                  <div className="lg:col-span-7 space-y-8 text-left reveal reveal-slide-right delay-200 order-1 lg:order-1">
                    <div className="space-y-4">
                      <span className="font-outfit text-xs tracking-widest text-[#D4AF37] uppercase font-bold block">
                        Our Core Features
                      </span>
                      <h2 className="font-cormorant text-3xl sm:text-5xl font-medium text-[#1C1C21] leading-tight">
                        Reliable features built for lasting performance
                      </h2>
                      <p className="font-inter text-sm text-[#4E4E59] leading-relaxed font-light">
                        Our tiles and marble surfaces are engineered through advanced calibration techniques to deliver consistent strength, water resistance, and long-term durability.
                      </p>
                    </div>

                    {/* Interactive Accordion */}
                    <div className="space-y-3">
                      {[
                        {
                          id: 0,
                          title: 'Hygienic & Non-Porous',
                          desc: 'Slabs are treated with specialized vacuum epoxy layers that seal micro-pores. This resists bacteria, moisture, and staining, making them ideal for high-end countertops.'
                        },
                        {
                          id: 1,
                          title: 'Scratch & Acid Resistant',
                          desc: 'Formed under high geological pressure and diamond polished, our quartzite and granites register an exceptional Mohs hardness index, remaining resilient against acid spills and knife cuts.'
                        },
                        {
                          id: 2,
                          title: 'Sustainably Mined & Certified',
                          desc: 'All blocks are sourced in accordance with APEDA and custom clearances, processed using environmentally audited gangsaw factories in Udaipur with zero child labor.'
                        }
                      ].map((faq) => {
                        const isExpanded = activeFaq === faq.id;
                        return (
                          <div
                            key={faq.id}
                            className="border border-[#EADCC9] rounded-xl overflow-hidden bg-[#FAF9F6] transition-all"
                          >
                            <button
                              onClick={() => setActiveFaq(isExpanded ? null : faq.id)}
                              className="w-full px-6 py-4 flex items-center justify-between text-left font-outfit text-sm font-bold text-[#1C1C21] hover:text-[#D4AF37] transition-colors"
                            >
                              <span>{faq.title}</span>
                              <span className="text-[#D4AF37] font-mono text-base">{isExpanded ? '−' : '+'}</span>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[150px] border-t border-[#EADCC9]' : 'max-h-0'
                              }`}>
                              <p className="p-6 text-xs text-[#4E4E59] leading-relaxed font-light bg-white">
                                {faq.desc}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Right Side (Desktop): Photo with Rating Badge (5 Columns) - Stacks bottom on mobile */}
                  <div className="lg:col-span-5 relative reveal reveal-slide-left order-2 lg:order-2">
                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-[#EADCC9] aspect-[4/5] bg-neutral-100">
                      <img
                        src="/core_features_calibration.png"
                        alt="Quality Calibration Inspection"
                        onError={(e) => {
                          e.target.src = "/about-us-factory.jpg";
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Floating Rating Badge */}
                    <div className="absolute top-6 left-6 bg-[#D4AF37] text-black rounded-xl p-4 shadow-xl border border-white/20 text-left">
                      <div className="flex items-center gap-1.5 mb-1 text-black">
                        <span className="font-outfit text-xl font-bold">4.9</span>
                        <span className="text-xs font-medium">/ 5</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-black">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <span className="block text-[8px] uppercase tracking-wider font-bold mt-2 opacity-80">
                        Based on 2500 reviews
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* SECTION 4: Global Reach / Interactive World Map */}
            <section className="py-24 bg-neutral-900 text-white border-y border-neutral-800 overflow-hidden">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-4 space-y-6 reveal reveal-slide-left">
                    <span className="font-outfit text-xs tracking-[0.25em] text-[#D4AF37] uppercase font-bold block">Global Export Footprint</span>
                    <h2 className="font-cormorant text-4xl sm:text-5xl font-medium tracking-wide text-white leading-tight">
                      International Delivery Markets
                    </h2>
                    <p className="font-inter text-sm text-neutral-300 leading-relaxed font-light">
                      Pyros surfaces are selected by premium luxury builders worldwide. We supply container-load shipments directly from our Udaipur head offices to major sea terminals in the United States, Europe/UK, and the Arab Gulf countries.
                    </p>
                    <p className="font-inter text-xs text-[#D4AF37]/85 leading-relaxed font-light">
                      * Hover or click the gold destination pins on the map to inspect active operations and logistics specifications at each location.
                    </p>
                  </div>
                  <div className="lg:col-span-8 reveal reveal-scale-up delay-200">
                    <WorldMap />
                  </div>
                </div>
              </div>
            </section>



            {/* NEW SECTION: Homepage Blog Highlights */}
            <section className="py-24 bg-[#FFFFFF] border-b border-[#EADCC9] overflow-hidden">
              <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex justify-between items-end mb-16 gap-6 reveal reveal-slide-up">
                  <div className="text-left max-w-2xl">
                    <span className="font-outfit text-xs tracking-[0.25em] text-[#D4AF37] uppercase font-bold block mb-2">Publications</span>
                    <h2 className="font-cormorant text-4xl sm:text-5xl font-medium text-[#1C1C21]">Latest Insights & Stone Bulletins</h2>
                    <p className="font-inter text-sm text-[#4E4E59] leading-relaxed font-light mt-4 hidden sm:block">
                      Read technical guides regarding calibrated wire saw tolerances, export fumigation guidelines, and design trends.
                    </p>
                  </div>
                  <button
                    onClick={() => navigateTo('blog')}
                    className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] hover:text-[#b59228] uppercase tracking-wider shrink-0 transition-colors pb-1 border-b border-[#D4AF37]/30 hover:border-[#D4AF37]"
                  >
                    Read All Articles
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      id: 'calibrated-marble-tolerance',
                      title: 'How We Process Calibrated White Marble down to ±1mm Tolerance',
                      category: 'Manufacturing',
                      date: 'July 10, 2026',
                      readTime: '5 min read',
                      image: '/calibrated_slicing.png',
                      desc: 'A deep-dive look into the Italian diamond wire sawing technologies and vacuum curing processes that calibrate luxury slabs.'
                    },
                    {
                      id: 'fcl-logistics-fumigation-crates',
                      title: 'FCL Logistics: Guidelines for Stone Export Shipping & ISPM-15 Crating',
                      category: 'Logistics',
                      date: 'June 28, 2026',
                      readTime: '6 min read',
                      image: '/secure_lashing.png',
                      desc: 'Learn the customs bonded protocols, direct shipping port selections, and wood fumigation standards necessary for transit security.'
                    },
                    {
                      id: 'statuario-vs-lilac-marble-design',
                      title: 'Statuario vs Lilac Marble: Aesthetic Decisions in Luxury Interiors',
                      category: 'Design Trends',
                      date: 'May 14, 2026',
                      readTime: '4 min read',
                      image: '/why_choose_us_slabs.png',
                      desc: 'Explore visual contrasts, vein profiles, and layout patterns for choosing marble panel walls in modern premium residences.'
                    }
                  ].map((post, idx) => (
                    <div
                      key={post.id}
                      onClick={() => navigateTo('blog')}
                      className={`group cursor-pointer flex flex-col bg-white border border-[#EADCC9] rounded-2xl overflow-hidden shadow-sm hover:border-[#D4AF37]/50 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 reveal reveal-slide-up delay-${(idx + 1) * 100}`}
                    >
                      <div className="aspect-[4/3] overflow-hidden relative border-b border-neutral-100">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => {
                            if (post.id === 'calibrated-marble-tolerance') e.target.src = '/about-us-factory.jpg';
                            else if (post.id === 'fcl-logistics-fumigation-crates') e.target.src = '/logo.jpeg';
                            else e.target.src = '/premium_photo-1661963559074-9655a9404f1a.avif';
                          }}
                        />
                        <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#D4AF37] border border-[#EADCC9] text-[9px] tracking-widest uppercase font-bold px-3 py-1 rounded z-20">
                          {post.category}
                        </span>
                      </div>
                      <div className="p-6 flex-grow flex flex-col justify-between space-y-4 text-left">
                        <div className="space-y-2">
                          <div className="flex items-center gap-4 text-[10px] text-neutral-400 font-light">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#D4AF37]" />
                              {post.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#D4AF37]" />
                              {post.readTime}
                            </span>
                          </div>
                          <h3 className="font-outfit text-sm font-bold text-[#1C1C21] leading-snug group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="font-inter text-xs text-neutral-500 leading-relaxed font-light line-clamp-2">
                            {post.desc}
                          </p>
                        </div>
                        <div className="pt-3 border-t border-neutral-100/60 flex items-center justify-between text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider">
                          <span>Read Article</span>
                          <div className="w-6 h-6 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors duration-300">
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* SECTION 5: Call to Action homepage block */}
            <CallToAction />
          </>
        )}

        {currentPage === 'about-us' && (
          <AboutUs />
        )}

        {currentPage === 'catalog' && (
          <Catalog
            initialCategory={catalogCategory}
            onCategoryChange={setCatalogCategory}
            onSelectForCalculator={handleSelectForCalculator}
          />
        )}

        {currentPage === 'contact' && (
          <Contact />
        )}

        {currentPage === 'blog' && (
          <Blog />
        )}

        {currentPage === 'product' && (
          <ProductDetails
            stoneId={selectedProductId}
            onBack={() => navigateTo('catalog')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1C1C21] text-neutral-400 border-t border-[#D4AF37]/20 py-20 text-xs leading-relaxed relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Col 1: Logo */}
          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded overflow-hidden border border-[#D4AF37]/30 shadow-md">
                <img src="/logo.jpeg" alt="Pyros Logo" className="w-full h-full object-cover scale-110" />
              </div>
              <span className="font-outfit text-base font-bold tracking-[0.2em] text-white uppercase">PYROS</span>
            </div>
            <p className="font-inter font-light text-neutral-100 text-[13px] leading-relaxed mt-2">
              Corporate exporter of premium natural stones, quartzites, and engineered quartz surfaces. Serving luxury residential and commercial structures worldwide.
            </p>
          </div>

          {/* Col 2: Our Collection */}
          <div className="flex flex-col gap-4 text-left">
            <h4 className="font-outfit text-xs tracking-widest uppercase text-white font-bold pb-2 border-b border-white/5">Our Collection</h4>
            <ul className="space-y-2.5 font-light text-neutral-200 text-[13px]">
              {['Quartz & Quartzite', 'Sandstone & Slate', 'Calibrated Quartzites', 'Engineered Quartz', 'Onyx & Custom Panels'].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => navigateTo('catalog')}
                    className="hover:text-[#D4AF37] hover:translate-x-1 transition-all duration-300 text-left block"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="flex flex-col gap-4 text-left">
            <h4 className="font-outfit text-xs tracking-widest uppercase text-white font-bold pb-2 border-b border-white/5">Quick Links</h4>
            <ul className="space-y-2.5 font-light text-neutral-200 text-[13px]">
              {[
                { name: 'Home Showcase', page: 'home' },
                { name: 'Company Biography', page: 'about-us' },
                { name: 'Products Range', page: 'catalog' },
                { name: 'Industry Insights (Blogs)', page: 'blog' },
                { name: 'Get Free Estimate', page: 'contact' }
              ].map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => navigateTo(link.page)}
                    className="hover:text-[#D4AF37] hover:translate-x-1 transition-all duration-300 text-left block"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Compliance, Contact & Colored Socials */}
          <div className="flex flex-col gap-5 text-left">
            <div>
              <h4 className="font-outfit text-[11px] tracking-widest uppercase text-white font-bold pb-2 border-b border-white/5 mb-3">Official Hotlines</h4>
              <ul className="space-y-2 font-light text-neutral-300">
                <li>Logistics Desk: <a href="tel:+919672111191" className="text-white hover:text-[#D4AF37] transition-colors font-semibold">+91 96721 11191</a></li>
                <li>Sales Desk: <a href="tel:+917891111557" className="text-white hover:text-[#D4AF37] transition-colors font-semibold">+91 78911 11557</a></li>
                <li>Email: <a href="mailto:info@pyrosstones.com" className="text-white hover:text-[#D4AF37] transition-colors font-semibold">info@pyrosstones.com</a></li>
              </ul>

              <div className="mt-4 pt-3 border-t border-white/5">
                <span className="font-outfit text-[9px] tracking-widest uppercase text-[#D4AF37] font-bold block mb-1">Corporate HQ</span>
                <p className="font-inter font-light text-neutral-300">
                  Udaipur, Rajasthan, India
                </p>
              </div>
            </div>

            {/* Colored Social Icons */}
            <div>
              <span className="font-outfit text-[9px] tracking-widest uppercase text-[#D4AF37] font-bold block mb-3">Connect With Us</span>
              <div className="flex items-center gap-3">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/917891111557"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-md"
                  title="WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.637-1.03-5.114-2.905-6.989-1.873-1.874-4.36-2.907-7.011-2.907-5.441 0-9.866 4.422-9.869 9.866-.001 1.848.49 3.655 1.425 5.247l-.93 3.398 3.484-.914z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 text-[#E4405F] hover:bg-[#E4405F] hover:text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-md"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 text-[#1877F2] hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-md"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 text-[#0077B5] hover:bg-[#0077B5] hover:text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-md"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Lower Row */}
        <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500">
          <span>&copy; {new Date().getFullYear()} Pyros Marble & Granite Surfaces. Powered by Rising Exports Group. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-light">Made with <Heart className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" /> for global luxury builders.</span>
            <button
              onClick={scrollToTop}
              className="p-2 bg-neutral-900 hover:bg-[#D4AF37] hover:text-black border border-neutral-800 rounded-md transition-all hover:scale-105 shadow-sm text-neutral-400"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        defaultProduct={enquiryProduct}
      />

    </div>
  );
}
