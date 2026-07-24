import React, { useState } from 'react';
import { stones } from '../data/stoneData';
import { Ship, ArrowRight, MessageSquare, Anchor, CheckCircle2, Compass, Layers, Globe, ChevronLeft, ChevronRight } from 'lucide-react';

const portsList = [
  { 
    id: 'mundra',
    name: 'Mundra Port', 
    subtitle: 'North & West India Hub',
    state: 'Gujarat, West Coast', 
    type: 'FCL Container Terminal', 
    desc: 'Primary export clearing hub for Rajasthan white marble, sandstone, quartzite, and engineered quartz slabs with 24/7 container gate clearance.',
    badge: 'North & West India Hub',
    highlights: ['Marble & Quartz Slabs', '24/7 Gate Clearance', 'Direct USA & Europe Routes'],
    stoneIds: ['indian-carrara', 'indian-statuario', 'indian-lilac', 'indian-pistachio', 'teakwood-sandstone', 'kota-blue', 'taj-mahal', 'calacatta-quartz']
  },
  { 
    id: 'chennai',
    name: 'Chennai Port', 
    subtitle: 'South India Granite Hub',
    state: 'Tamil Nadu, East Coast', 
    type: 'Granite & Heavy Cargo Hub', 
    desc: 'Historic maritime gateway for South Indian absolute black granite blocks, black galaxy, and heavy slab cargo loads with dedicated rail sidings.',
    badge: 'South India Granite Hub',
    highlights: ['Absolute Black Granite', 'Rail Siding Facility', 'Direct APAC & Gulf Routes'],
    stoneIds: ['absolute-black', 'black-galaxy', 'steel-grey']
  }
];

export default function PortsShowcase() {
  const [activePortId, setActivePortId] = useState('mundra');

  const activePort = portsList.find(p => p.id === activePortId);
  
  // Filter active stones from the database
  const activeStones = stones.filter(stone => 
    activePort.stoneIds.includes(stone.id) || activePort.stoneIds.includes(stone.baseId)
  );

  const handleEnquiry = (stoneName) => {
    if (window.openEnquiryModal) {
      window.openEnquiryModal(stoneName);
    } else {
      window.location.hash = `#/contact?product=${encodeURIComponent(stoneName)}`;
    }
  };

  return (
    <div className="space-y-12">
      
      {/* 1. Dual Primary Gateways Feature Grid (Slideable on Mobile, Grid on Desktop) */}
      <div className="flex md:grid md:grid-cols-2 overflow-x-auto no-scrollbar gap-4 pb-4 md:pb-0 snap-x snap-mandatory scroll-smooth w-full text-left">
        {portsList.map((port) => {
          const isActive = port.id === activePortId;

          return (
            <div
              key={port.id}
              onClick={() => setActivePortId(port.id)}
              className={`shrink-0 snap-center w-[75vw] sm:w-[85vw] md:w-full relative cursor-pointer rounded-2xl p-4 sm:p-6 md:p-8 transition-all duration-500 overflow-hidden border ${
                isActive
                  ? 'bg-[#1C1C21] border-[#D4AF37] shadow-[0_10px_30px_rgba(212,175,55,0.15)] ring-1 ring-[#D4AF37]/50'
                  : 'bg-white border-[#EADCC9] hover:border-[#D4AF37]/60 hover:shadow-lg'
              }`}
            >
              {/* Active Ambient Glow Highlight */}
              {isActive && (
                <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#D4AF37]/10 filter blur-2xl pointer-events-none" />
              )}

              {/* Card Header & Port Name (Mobile shows Port Name only, Desktop shows Badge & Description) */}
              <div className="flex justify-between items-center md:items-start md:mb-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                    isActive 
                      ? 'bg-[#D4AF37] text-black shadow-md' 
                      : 'bg-[#FAF9F6] border border-[#EADCC9] text-[#D4AF37]'
                  }`}>
                    {port.id === 'mundra' ? <Ship className="w-5 h-5 md:w-6 md:h-6" /> : <Anchor className="w-5 h-5 md:w-6 md:h-6" />}
                  </div>
                  <div>
                    <span className={`hidden md:block text-[9px] font-mono uppercase tracking-widest font-bold ${
                      isActive ? 'text-[#D4AF37]' : 'text-neutral-500'
                    }`}>
                      {port.badge}
                    </span>
                    <h3 className={`font-outfit text-base sm:text-lg md:text-xl font-bold ${
                      isActive ? 'text-white' : 'text-[#1C1C21]'
                    }`}>
                      {port.name}
                    </h3>
                  </div>
                </div>

                <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 ${
                  isActive 
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]' 
                    : 'bg-neutral-100 border-neutral-200 text-neutral-600'
                }`}>
                  {isActive ? '● Selected' : 'Select'}
                </span>
              </div>

              {/* Description (Desktop Only for Clean Mobile View) */}
              <p className={`hidden md:block font-inter text-xs leading-relaxed font-light mb-6 ${
                isActive ? 'text-neutral-300' : 'text-[#4E4E59]'
              }`}>
                {port.desc}
              </p>

              {/* Highlights Pill List (Desktop Only for Clean Mobile View) */}
              <div className="hidden md:block space-y-2 border-t pt-4 border-dashed border-neutral-300/30">
                <div className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 font-mono">
                  {port.state} &bull; {port.type}
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {port.highlights.map((h, i) => (
                    <span 
                      key={i} 
                      className={`text-[10px] px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 ${
                        isActive 
                          ? 'bg-white/10 text-white border border-white/10' 
                          : 'bg-[#FAF9F6] text-[#1C1C21] border border-[#EADCC9]'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" />
                      {h}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* 2. Active Port Products Slider Section */}
      <div className="space-y-6 text-left">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-[#EADCC9] pb-4 gap-4">
          <div>
            <span className="font-outfit text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block">
              Active Cargo Dispatch List
            </span>
            <h3 className="font-cormorant text-2xl font-bold text-[#1C1C21] mt-0.5">
              Stones Exported Via {activePort.name}
            </h3>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/20">
              {activeStones.length} Product Slices Loaded
            </span>

            {/* Navigation Arrow Controls for Desktop & Mobile */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  document.getElementById(`ports-showcase-scroll-${activePortId}`)?.scrollBy({ left: -320, behavior: 'smooth' });
                }}
                className="w-8 h-8 rounded-full border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors shadow-sm cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  document.getElementById(`ports-showcase-scroll-${activePortId}`)?.scrollBy({ left: 320, behavior: 'smooth' });
                }}
                className="w-8 h-8 rounded-full border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors shadow-sm cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Horizontal Slider (desktop & mobile) */}
        <div 
          key={`grid-${activePortId}`} 
          id={`ports-showcase-scroll-${activePortId}`}
          className="flex overflow-x-auto no-scrollbar gap-6 md:gap-8 pb-6 snap-x snap-mandatory scroll-smooth w-full"
        >
          {activeStones.map((stone, idx) => (
            <div 
              key={stone.id}
              className="group shrink-0 snap-start w-[72vw] sm:w-[280px] md:w-[320px] lg:w-[340px] relative aspect-[3/4] overflow-hidden rounded-2xl border border-[#EADCC9]/60 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col animate-fadeIn"
              style={{ animationDelay: `${idx * 75}ms`, animationFillMode: 'both' }}
            >
              {/* Full-height backdrop image */}
              <img 
                src={stone.image} 
                alt={stone.name} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0" 
              />
              
              {/* Gradient Overlay for high-contrast legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C21]/95 via-[#1C1C21]/45 to-transparent z-10 transition-colors duration-300" />
              
              {/* Category tag */}
              <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[#D4AF37] border border-[#EADCC9] text-[9px] tracking-widest uppercase font-bold px-3 py-1 rounded z-20">
                {stone.category}
              </span>

              {/* Content overlay absolute at the bottom */}
              <div className="absolute inset-0 p-6 z-20 flex flex-col justify-end text-left select-none space-y-3">
                <div>
                  <div className="flex justify-between items-center gap-2">
                    <h4 className="font-outfit text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors duration-300">
                      {stone.name}
                    </h4>
                    <span className="text-[8px] bg-white/10 border border-white/10 px-2 py-0.5 rounded text-neutral-300 uppercase font-mono shrink-0">
                      {stone.density}
                    </span>
                  </div>
                  <p className="font-inter text-xs text-white/70 leading-relaxed font-light mt-1.5 line-clamp-2">
                    {stone.description}
                  </p>
                </div>

                {/* Inquiry Action */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-4">
                  <div className="text-[10px] text-neutral-300 font-light">
                    Origin: <strong className="text-white font-semibold">{stone.origin}</strong>
                  </div>
                  <button
                    onClick={() => handleEnquiry(stone.name)}
                    className="px-3.5 py-2 bg-[#D4AF37] hover:bg-[#b59228] text-black text-[9px] tracking-wider uppercase font-bold rounded shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3 h-3" />
                    Enquiry
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
