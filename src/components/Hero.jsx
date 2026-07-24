import React from 'react';
import { ArrowDown, Container, Play, Star } from 'lucide-react';

export default function Hero({ onExploreClick }) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center text-white pt-28 pb-20 overflow-hidden bg-neutral-950"
    >

      {/* Cinematic Looping Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60 scale-102"
          src="https://demo.awaikenthemes.com/assets/videos/tilux-hero-video.mp4"
        />
      </div>

      {/* Rich dark overlay to ensure maximum text readability and visual depth */}
      <div className="absolute inset-0 z-1" style={{ backgroundColor: 'rgba(10, 10, 12, 0.68)' }} />

      {/* Grid Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* LEFT PANEL: Headline & CTA (7 Columns) */}
        <div className="lg:col-span-7 space-y-8 text-left reveal reveal-slide-left">

          {/* Export Tagline Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/10 text-[#D4AF37] font-inter text-xs tracking-[0.25em] uppercase font-bold shadow-lg shadow-black/30">
            <Container className="w-3.5 h-3.5" />
            Global Export Partner: India &rarr; USA, UK, GCC
          </div>

          {/* Luxury Split Headline */}
          <h1 className="font-cormorant text-5xl sm:text-7xl lg:text-8xl font-medium tracking-wide leading-[1.08] text-white">
            Crafting the World's <br />
            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F3F4F6] to-[#D4AF37]">
              Finest Stone Surfaces
            </span>
          </h1>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto items-stretch sm:items-center">
            <button
              onClick={() => onExploreClick('catalog')}
              className="px-8 py-4 bg-[#D4AF37] hover:bg-[#b59228] text-black font-bold text-xs tracking-[0.2em] uppercase rounded-md shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-102 hover:shadow-[#D4AF37]/20"
            >
              Browse Slabs Catalog
            </button>
            <button
              onClick={() => onExploreClick('contact')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs tracking-[0.2em] uppercase rounded-md transition-all duration-300 hover:-translate-y-1 hover:scale-102"
            >
              Contact Export Desk
            </button>
          </div>

        </div>

        {/* RIGHT PANEL: Paragraph, Clients Badge & Marble Block Image Card (5 Columns) */}
        <div className="lg:col-span-5 space-y-6 text-left lg:pl-6 reveal reveal-slide-right delay-200">

          {/* Sub-paragraph details */}
          <p className="font-inter text-sm sm:text-base text-white/80 leading-relaxed font-light tracking-wide max-w-xl">
            Pyros is India's leading exporter of premium, hand-picked <strong className="text-white font-semibold">Marble, Granite, Quartzite, and Quartz slabs</strong>. Engineered to pass stringent US/UK quality benchmarks and tailored for luxury projects across Arab nations.
          </p>

          <hr className="border-white/10 w-full" />

          {/* Luxury Client Review Widget */}
          <div className="flex flex-wrap items-center gap-6">

            {/* Overlay Avatars */}
            <div className="flex -space-x-3">
              {[
                { name: 'US', bg: 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/45' },
                { name: 'UK', bg: 'bg-neutral-800 text-white border-white/20' },
                { name: 'AE', bg: 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/45' },
                { name: 'SA', bg: 'bg-neutral-800 text-white border-white/20' }
              ].map((av, idx) => (
                <div
                  key={idx}
                  className={`w-10 h-10 rounded-full border-2 ${av.bg} flex items-center justify-center text-[10px] font-bold tracking-widest font-mono shadow-md shrink-0`}
                >
                  {av.name}
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37] bg-[#D4AF37] text-black flex items-center justify-center text-[11px] font-bold shrink-0 shadow-md">
                5★
              </div>
            </div>

            {/* Review text */}
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-[#D4AF37]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs font-semibold text-white/90">Trusted by Global Stone Buyers</p>
              <p className="text-[10px] text-white/60 font-mono">100+ Commercial Projects Shipped</p>
            </div>

          </div>

          {/* Marble Block Image Card right under review text */}
          <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-white/20 shadow-2xl relative group bg-neutral-900 mt-4">
            <img 
              src="/marbal image.webp" 
              alt="Marble Block Slab Specimen" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
                Premium Calibrated Marble Block
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Scroll Cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer opacity-75 hover:opacity-100 transition-opacity" onClick={() => onExploreClick('catalog')}>
        <span className="text-[9px] uppercase font-mono tracking-widest text-[#D4AF37]">Explore Collections</span>
        <ArrowDown className="w-3.5 h-3.5 text-[#D4AF37] animate-bounce" />
      </div>

    </section>
  );
}
