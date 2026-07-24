import React, { useState, useEffect } from 'react';
import { stones, stoneCategories } from '../data/stoneData';
import { Search, Eye } from 'lucide-react';

export default function Catalog({ initialCategory = 'all', onCategoryChange, onSelectForCalculator }) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (onCategoryChange) {
      onCategoryChange(catId);
    }
    if (catId === 'all') {
      window.location.hash = '#/catalog';
    } else {
      window.location.hash = `#/catalog/${catId}`;
    }
  };

  // Filter stone list
  const filteredStones = stones.filter(stone => {
    const matchesCategory = selectedCategory === 'all' || stone.category === selectedCategory;
    const matchesSearch = stone.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          stone.origin.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="catalog" className="py-24 bg-[#FAF9F6] text-[#1C1C21]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-[#E5E7EB] pb-8">
          <div>
            <span className="font-outfit text-xs tracking-[0.25em] text-[#D4AF37] uppercase font-semibold mb-2 block">Premium Collections</span>
            <h2 className="font-cormorant text-4xl sm:text-5xl font-medium tracking-wide text-[#1C1C21]">
              Exquisite Stone Gallery
            </h2>
          </div>
          <p className="font-inter text-xs sm:text-sm text-[#4E4E59] max-w-md mt-4 md:mt-0 font-light leading-relaxed">
            Strict slab-level quality assessment ensures that all materials shipped comply with standard dimensions, uniform coloration, and exact thickness calibrations.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12 w-full">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-none">
            {stoneCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs tracking-wider uppercase font-medium whitespace-nowrap transition-all duration-300 border ${
                  selectedCategory === cat.id
                    ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-sm font-bold'
                    : 'bg-white border-[#E2E8F0] text-[#4E4E59] hover:text-[#1C1C21]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-96 md:ml-auto">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#8E8E93]" />
            </span>
            <input
              type="text"
              placeholder="Search by stone name, origin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#E2E8F0] rounded-md text-sm text-[#1C1C21] placeholder-[#8E8E93]/50 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all font-inter"
            />
          </div>
        </div>

        {/* Grid display */}
        {filteredStones.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStones.map((stone) => (
              <div 
                key={stone.id} 
                className="group relative bg-white rounded-lg overflow-hidden border border-[#E5E7EB] hover:border-[#D4AF37]/50 transition-all duration-500 hover:-translate-y-1 shadow-sm hover:shadow-md gloss-shine-card"
              >
                {/* Stone Image */}
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <img 
                    src={stone.image} 
                    alt={stone.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 brightness-[0.95] group-hover:brightness-100" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent opacity-80" />
                  
                  {/* Category overlay */}
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded text-[9px] tracking-[0.2em] uppercase font-bold text-[#D4AF37] border border-[#E2E8F0]">
                    {stone.category}
                  </span>

                  {/* Eye hover trigger */}
                  <div 
                    onClick={() => window.location.hash = `#/product/${stone.id}`}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-white/80 backdrop-blur-xs transition-opacity duration-300 cursor-pointer"
                  >
                    <div className="px-5 py-2.5 bg-[#D4AF37] text-black font-semibold text-xs tracking-wider uppercase rounded flex items-center gap-2 shadow-lg">
                      <Eye className="w-3.5 h-3.5" />
                      View Slab Specs
                    </div>
                  </div>
                </div>

                {/* Details info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 
                      onClick={() => window.location.hash = `#/product/${stone.id}`}
                      className="font-outfit text-xl font-bold tracking-wide group-hover:text-[#D4AF37] transition-colors cursor-pointer text-[#1C1C21]"
                    >
                      {stone.name}
                    </h3>
                    <span className="text-[10px] text-[#4E4E59] bg-black/5 border border-black/5 px-2 py-0.5 rounded uppercase font-medium">{stone.origin.split(',')[0]}</span>
                  </div>
                  <p className="font-inter text-xs text-[#4E4E59] line-clamp-2 mb-6 font-light leading-relaxed">
                    {stone.description}
                  </p>

                  <div className="h-px bg-black/5 mb-4" />

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-wider text-[#8E8E93]">Standard Thickness</span>
                      <span className="text-xs text-[#1C1C21] mt-0.5 font-medium">20mm / 30mm</span>
                    </div>
                    <button 
                      onClick={() => window.location.hash = `#/product/${stone.id}`}
                      className="px-4 py-2 bg-transparent hover:bg-[#D4AF37] border border-[#D4AF37]/50 text-[#D4AF37] hover:text-black text-[10px] tracking-widest uppercase font-semibold rounded transition-all duration-300"
                    >
                      Configure Load
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-[#E5E7EB] rounded-lg bg-white">
            <p className="font-inter text-[#4E4E59] mb-2 font-light">No stone variants found matching your parameters.</p>
            <button 
              onClick={() => { handleCategorySelect('all'); setSearchQuery(''); }}
              className="text-xs text-[#D4AF37] font-semibold tracking-wider uppercase underline hover:text-[#1C1C21] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
