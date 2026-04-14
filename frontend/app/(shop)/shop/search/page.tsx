"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Filter, Star, ChevronDown, LayoutGrid, List, SlidersHorizontal, Search as SearchIcon, ChevronLeft, ChevronRight, Settings } from 'lucide-react';

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Settings className="w-8 h-8 text-primary animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Loading Atelier Search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('cat');

  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCat ? [initialCat] : ["Bespoke Suits"]);
  const [priceRange, setPriceRange] = useState({ min: "0", max: "3000" });
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [constructionFilter, setConstructionFilter] = useState('all');

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) {
      setSelectedCategories([cat]);
    }
  }, [searchParams]);

  const ALL_PRODUCTS = [
    { id: 1, name: "Luxury Silk Drape", price: 280.00, oldPrice: 350.00, category: "Luxury Fabrics", construction: "unstitched", img: "https://images.unsplash.com/photo-1598033129183-c4f50c717658?q=80&w=600&auto=format&fit=crop", rating: 4.5, reviews: 42 },
    { id: 2, name: "Wool Tailored Suit", price: 1250.00, oldPrice: 1400.00, category: "Bespoke Suits", construction: "stitched", img: "https://images.unsplash.com/photo-1594932224010-75f4383a54fd?q=80&w=600&auto=format&fit=crop", rating: 4.8, reviews: 89 },
    { id: 3, name: "Premium Cotton Shirt", price: 160.00, oldPrice: 200.00, category: "Tailored Shirts", construction: "stitched", img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop", rating: 4.2, reviews: 156 },
    { id: 4, name: "Classic Trench Coat", price: 850.00, oldPrice: 950.00, category: "Heritage Outerwear", construction: "stitched", img: "https://images.unsplash.com/photo-1539533377285-300fe7afba4e?q=80&w=600&auto=format&fit=crop", rating: 4.9, reviews: 24 },
    { id: 5, name: "Evening Silk Blazer", price: 580.00, oldPrice: 700.00, category: "Bespoke Suits", construction: "stitched", img: "https://images.unsplash.com/photo-1592873523706-e74c86bf410e?q=80&w=600&auto=format&fit=crop", rating: 4.7, reviews: 67 },
    { id: 7, name: "Raw British Wool", price: 450.00, oldPrice: 500.00, category: "Luxury Fabrics", construction: "unstitched", img: "https://images.unsplash.com/photo-1539533377285-300fe7afba4e?q=80&w=600&auto=format&fit=crop", rating: 4.8, reviews: 31 },
  ];

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
    setPriceRange({ min: "0", max: "3000" });
    setConstructionFilter('all');
    setSelectedRating(null);
  };

  const handleBookConsult = () => {
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      setShowConsultModal(false);
      alert("Atelier Concierge Session Initialized. Expect a call within 2 hours.");
    }, 2000);
  };

  const filteredProducts = ALL_PRODUCTS.filter(p => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(p.category);
    const priceMatch = p.price >= (Number(priceRange.min) || 0) && p.price <= (Number(priceRange.max) || 3000);
    const ratingMatch = selectedRating === null || p.rating >= selectedRating;
    const constructionMatch = constructionFilter === 'all' || p.construction === constructionFilter;
    return categoryMatch && priceMatch && ratingMatch && constructionMatch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // relevance
  });

  return (
    <div className="bg-zinc-50 dark:bg-black/20 min-h-screen py-10 px-6 font-['Inter']">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Results Header (Stats & Sort) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-white/5 p-6 rounded-3xl shadow-xl border border-zinc-100 dark:border-white/10 transition-all">
           <div className="space-y-1">
              <h1 className="text-2xl font-black text-zinc-800 dark:text-white tracking-tighter uppercase">Search Results</h1>
              <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Showing 1-{filteredProducts.length} of {ALL_PRODUCTS.length} bespoke matches</p>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="flex bg-zinc-100 dark:bg-white/5 p-1 rounded-2xl shadow-inner">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-primary shadow-md text-primary dark:text-white' : 'text-zinc-400 hover:text-primary'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-primary shadow-md text-primary dark:text-white' : 'text-zinc-400 hover:text-primary'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <div className="h-10 w-px bg-zinc-200 dark:bg-white/10 hidden md:block" />
              <div className="flex items-center gap-4">
                 <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest hidden lg:block">Order By:</span>
                 <select 
                   value={sortBy}
                   onChange={(e) => setSortBy(e.target.value)}
                   className="appearance-none p-3 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest cursor-pointer hover:border-primary transition-all outline-none"
                 >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                 </select>
              </div>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Filters Sidebar */}
          <aside className="hidden lg:block w-72 space-y-8 sticky top-32 h-fit">
            <Link 
              href="/shop/profile" 
              className="flex items-center gap-2 group mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-primary transition-all"
            >
               <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
               Back to Client Portal
            </Link>

            <div className="bg-white dark:bg-white/5 rounded-3xl p-8 shadow-xl border border-zinc-100 dark:border-white/10 space-y-10">
               <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-white/10">
                 <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary">Filters</h3>
                 <span 
                   onClick={handleClearAll}
                   className="text-[9px] font-black text-zinc-400 hover:text-red-500 cursor-pointer uppercase transition-colors"
                 >
                   Clear All
                 </span>
               </div>

               {/* Category Filter */}
               <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Category Selection</h4>
                 <div className="space-y-3">
                   {["Bespoke Suits", "Luxury Fabrics", "Tailored Shirts", "Heritage Outerwear", "Artisan Shoes"].map((cat, i) => (
                     <label key={i} className="flex items-center gap-3 cursor-pointer group">
                       <input 
                         type="checkbox" 
                         checked={selectedCategories.includes(cat)}
                         onChange={() => handleCategoryToggle(cat)}
                         className="w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary dark:bg-white/10 transition-all cursor-pointer" 
                       />
                       <span className={`text-[11px] font-bold transition-colors ${selectedCategories.includes(cat) ? 'text-primary' : 'text-zinc-500 group-hover:text-primary'}`}>{cat}</span>
                     </label>
                   ))}
                 </div>
               </div>

               {/* Price Range Filter */}
               <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-white/10">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Investment Range</h4>
                 <div className="space-y-6">
                   <div className="flex gap-3">
                     <div className="flex items-center bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 rounded-xl px-3 py-1.5 flex-1">
                       <span className="text-[10px] font-black text-zinc-400 mr-1">$</span>
                       <input 
                         type="number" 
                         placeholder="Min" 
                         value={priceRange.min}
                         onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                         className="w-full bg-transparent text-[11px] font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                       />
                     </div>
                     <div className="flex items-center bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 rounded-xl px-3 py-1.5 flex-1">
                       <span className="text-[10px] font-black text-zinc-400 mr-1">$</span>
                       <input 
                         type="number" 
                         placeholder="Max" 
                         value={priceRange.max}
                         onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                         className="w-full bg-transparent text-[11px] font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                       />
                     </div>
                   </div>
                   
                   {/* Functional Premium Slider */}
                   <div className="relative h-6 flex items-center group">
                     {/* Track Background */}
                     <div className="absolute w-full h-1.5 bg-zinc-100 dark:bg-white/5 rounded-full" />
                     
                     {/* Active Progress Bar */}
                     <div 
                        className="absolute h-1.5 bg-primary rounded-full transition-all duration-300" 
                        style={{ 
                          left: `${(Number(priceRange.min) / 3000) * 100}%`, 
                          right: `${100 - (Number(priceRange.max) / 3000) * 100}%` 
                        }} 
                     />
                     
                     {/* Hidden Dual Range Inputs */}
                     <input 
                        type="range" 
                        min="0" 
                        max="3000" 
                        value={priceRange.min} 
                        onChange={(e) => {
                          const val = Math.min(Number(e.target.value), Number(priceRange.max) - 100);
                          setPriceRange({...priceRange, min: val.toString()});
                        }}
                        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:appearance-none cursor-pointer"
                     />
                     <input 
                        type="range" 
                        min="0" 
                        max="3000" 
                        value={priceRange.max} 
                        onChange={(e) => {
                          const val = Math.max(Number(e.target.value), Number(priceRange.min) + 100);
                          setPriceRange({...priceRange, max: e.target.value});
                        }}
                        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-30 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:appearance-none cursor-pointer"
                     />
                   </div>
                   <div className="flex justify-between px-1">
                      <span className="text-[9px] font-black text-zinc-300 uppercase tracking-tighter">$0</span>
                      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">$3,000+</span>
                   </div>
                 </div>
               </div>

               {/* Cloth Architecture Filter */}
               <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-white/10">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Cloth Architecture</h4>
                 <div className="space-y-3">
                   {[
                     { id: 'all', label: "All Masterpieces" },
                     { id: 'stitched', label: "Bespoke Stitched" },
                     { id: 'unstitched', label: "Elite Unstitched" }
                   ].map((type) => (
                     <label key={type.id} className="flex items-center gap-3 cursor-pointer group">
                       <input 
                         type="radio" 
                         name="construction" 
                         checked={constructionFilter === type.id}
                         onChange={() => setConstructionFilter(type.id)}
                         className="w-4 h-4 rounded-full border-zinc-300 text-primary focus:ring-primary dark:bg-white/10 transition-all cursor-pointer" 
                       />
                       <span className={`text-[11px] font-bold transition-colors ${constructionFilter === type.id ? 'text-primary' : 'text-zinc-500 group-hover:text-primary'}`}>{type.label}</span>
                     </label>
                   ))}
                 </div>
               </div>

               {/* Rating Filter */}
               <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-white/10">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Client Ratings</h4>
                 <div className="space-y-3">
                    {[5, 4, 3].map((star) => (
                      <label key={star} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="rating" 
                          checked={selectedRating === star}
                          onChange={() => setSelectedRating(star)}
                          className="w-4 h-4 border-zinc-300 text-primary focus:ring-primary cursor-pointer" 
                        />
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 fill-current ${i >= star ? 'text-zinc-100 dark:text-zinc-800' : ''}`} />
                          ))}
                        </div>
                        <span className={`text-[10px] font-bold uppercase transition-colors ${selectedRating === star ? 'text-primary' : 'text-zinc-500 group-hover:text-primary'}`}>& Up</span>
                      </label>
                    ))}
                 </div>
               </div>
            </div>
            
            <div className="bg-primary p-8 rounded-3xl text-white shadow-2xl space-y-4">
               <h4 className="text-lg font-black leading-tight uppercase tracking-tighter">Bespoke Fitting</h4>
               <p className="text-[10px] text-white/70 leading-relaxed font-light uppercase tracking-widest font-bold">Can't find your fit? Book a virtual consultation with our lead tailor.</p>
               <button 
                 onClick={() => setShowConsultModal(true)}
                 className="w-full bg-white text-primary text-[10px] font-black py-4 rounded-xl shadow-lg hover:scale-105 transition-all uppercase tracking-widest"
               >
                 START CONSULTATION
               </button>
            </div>
          </aside>

          {/* Results Product Grid / List */}
          <main className="flex-grow">
            {filteredProducts.length > 0 ? (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-6"}>
                {filteredProducts.map((p) => (
                  viewMode === 'grid' ? (
                    <div key={p.id} className="group relative bg-white dark:bg-white/5 rounded-[2rem] border border-zinc-100 dark:border-white/10 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-in fade-in zoom-in-95 duration-500">
                      <div className="relative aspect-[4/5] overflow-hidden m-4 rounded-[1.5rem] shadow-lg">
                          <Image src={p.img} alt={p.name} fill className="object-cover scale-100 group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute top-4 left-4 bg-primary text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter">-{Math.round((1 - p.price/p.oldPrice)*100)}%</div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                      </div>

                      <div className="p-8 pt-2 space-y-4">
                          <div className="space-y-1">
                          <div className="flex items-center justify-between">
                             <span className="text-[9px] font-black uppercase text-primary tracking-[0.2em]">{p.category}</span>
                             <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${p.construction === 'unstitched' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                                {p.construction === 'unstitched' ? 'Unstitched' : 'Stitched'}
                             </span>
                          </div>
                          <h3 className="text-lg font-black text-zinc-800 dark:text-zinc-100 tracking-tight transition-colors group-hover:text-primary leading-tight">{p.name}</h3>
                          </div>
                          
                          <div className="flex items-center justify-between gap-4">
                            <div className="space-y-1">
                                <p className="text-2xl font-black text-primary dark:text-white tracking-tighter">
                                   {p.construction === 'unstitched' ? `From $${p.price}` : `$${p.price}`}
                                </p>
                                <p className="text-xs text-zinc-400 line-through font-bold">${p.oldPrice}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-2.5 h-2.5 fill-current ${i >= Math.floor(p.rating) ? 'text-zinc-100 dark:text-zinc-800' : ''}`} />
                                ))}
                              </div>
                              <span className="text-[8px] font-black text-zinc-400 uppercase">({p.reviews} REVIEWS)</span>
                            </div>
                          </div>

                          <Link 
                            href={`/shop/product/${p.id}`}
                            className="block w-full text-center bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 text-zinc-500 dark:text-zinc-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500 py-4 font-black text-[10px] tracking-[0.2em] uppercase rounded-2xl"
                          >
                            View Details
                          </Link>
                      </div>
                    </div>
                  ) : (
                    <div key={p.id} className="group flex flex-col md:flex-row bg-white dark:bg-white/5 rounded-3xl border border-zinc-100 dark:border-white/10 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 animate-in slide-in-from-left-4 duration-500">
                       <div className="relative w-full md:w-64 h-64 md:h-auto overflow-hidden">
                          <Image src={p.img} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute top-4 left-4 bg-primary text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter">-{Math.round((1 - p.price/p.oldPrice)*100)}%</div>
                       </div>
                       <div className="flex-grow p-8 flex flex-col justify-between gap-6">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                             <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                   <span className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">{p.category}</span>
                                   <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${p.construction === 'unstitched' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                                      {p.construction === 'unstitched' ? 'Elite Unstitched' : 'Bespoke Stitched'}
                                   </span>
                                </div>
                                <h3 className="text-4xl font-black text-zinc-800 dark:text-zinc-100 tracking-tight leading-tight">{p.name}</h3>
                                <div className="flex items-center gap-2 pt-2">
                                   <div className="flex text-amber-500">
                                      {[...Array(5)].map((_, i) => (
                                         <Star key={i} className={`w-3 h-3 fill-current ${i >= Math.floor(p.rating) ? 'text-zinc-100 dark:text-zinc-800' : ''}`} />
                                      ))}
                                   </div>
                                   <span className="text-[9px] font-black text-zinc-400 uppercase">({p.reviews} Verified Appraisals)</span>
                                </div>
                             </div>
                             <div className="text-left md:text-right">
                                <p className="text-4xl font-black text-primary dark:text-white tracking-tighter">
                                   {p.construction === 'unstitched' ? `From $${p.price}` : `$${p.price}`}
                                </p>
                                <p className="text-sm text-zinc-400 line-through font-bold">${p.oldPrice}</p>
                             </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row items-center gap-4">
                             <Link 
                                href={`/shop/product/${p.id}`}
                                className="w-full sm:w-auto px-12 bg-primary text-white py-4 font-black text-[10px] tracking-[0.2em] uppercase rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all text-center"
                             >
                                 Precision fitting
                             </Link>
                             <button className="w-full sm:w-auto px-8 py-4 text-zinc-400 hover:text-primary font-black text-[10px] tracking-[0.2em] uppercase transition-colors">
                                 Add to wishlist
                             </button>
                          </div>
                       </div>
                    </div>
                  )
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-32 bg-white dark:bg-white/5 rounded-[3rem] border border-dashed border-zinc-200 dark:border-white/10 text-center animate-in zoom-in-95 duration-500">
                <SearchIcon className="w-16 h-16 text-zinc-300 mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-800 dark:text-zinc-100 mb-2">No Matching Patterns Found</h3>
                <p className="text-sm text-zinc-400 max-w-sm mb-8 font-bold italic-elegant italic">"The cut you're looking for isn't in our current search results. Try clearing your filters or exploring a broader range."</p>
                <button onClick={handleClearAll} className="bg-primary text-white font-black px-12 py-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs">Clear All Filters</button>
              </div>
            )}

            {/* Pagination Mockup */}
            {filteredProducts.length > 0 && (
              <div className="mt-20 flex justify-center items-center gap-4">
                <button className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/10 text-zinc-400 hover:text-primary transition-all disabled:opacity-30 shadow-md" disabled>
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-3">
                   {[1, 2, 3].map((n, i) => (
                     <button key={i} className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-xs transition-all shadow-md ${n === 1 ? 'bg-primary text-white scale-110' : 'bg-white dark:bg-white/5 border border-zinc-100 dark:border-white/10 text-zinc-400 hover:border-primary hover:text-primary'}`}>
                        {n}
                     </button>
                   ))}
                </div>
                <button className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/10 text-zinc-400 hover:text-primary transition-all shadow-md">
                   <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Artisan Consultation Modal */}
      {showConsultModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[100] animate-in fade-in duration-300 px-6">
           <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-[3rem] shadow-2xl border border-zinc-100 dark:border-white/10 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-12 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2">
                 <div className="relative h-64 md:h-auto bg-primary overflow-hidden order-last md:order-first">
                    <Image 
                      src="https://images.unsplash.com/photo-1559415115-4876d78707ef?q=80&w=1000&auto=format&fit=crop" 
                      alt="Consultation" 
                      fill 
                      className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-10">
                       <h5 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight">Virtual <br />Fitting Studio</h5>
                       <p className="text-[10px] text-white/70 font-black uppercase tracking-widest mt-2 underline decoration-white/20 underline-offset-4">Milan • London • New York</p>
                    </div>
                 </div>
                 <div className="p-10 space-y-8">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-3 py-1 rounded-full">Concierge Request</span>
                       <button onClick={() => setShowConsultModal(false)} className="text-zinc-300 hover:text-primary transition-colors">
                          <SlidersHorizontal className="w-6 h-6 rotate-45" />
                       </button>
                    </div>
                    
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Select Date</label>
                          <div className="grid grid-cols-4 gap-2">
                             {['14 Oct', '15 Oct', '16 Oct', '17 Oct'].map((date, i) => (
                               <button key={i} className={`py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${i === 0 ? 'bg-primary text-white border-primary shadow-lg' : 'bg-zinc-50 dark:bg-white/5 border-zinc-100 dark:border-white/10 text-zinc-500'}`}>{date}</button>
                             ))}
                          </div>
                       </div>
                       
                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Preferred Slot</label>
                          <div className="space-y-2">
                             {[
                                { time: "10:00 AM - 11:00 AM", label: "Morning Fitting" },
                                { time: "02:00 PM - 03:00 PM", label: "Afternoon Aesthetic" },
                                { time: "05:00 PM - 06:00 PM", label: "Evening Consultation" }
                             ].map((slot, i) => (
                               <button key={i} className={`w-full flex justify-between items-center p-4 rounded-2xl border border-zinc-50 dark:border-white/5 hover:border-primary/30 transition-all group ${i === 1 ? 'bg-primary/5 border-primary/30' : 'bg-zinc-50/50 dark:bg-white/5'}`}>
                                  <div className="text-left">
                                     <p className="text-[11px] font-black uppercase text-zinc-800 dark:text-zinc-100">{slot.label}</p>
                                     <p className="text-[9px] font-bold text-zinc-400">{slot.time}</p>
                                  </div>
                                  <ChevronRight className={`w-4 h-4 transition-transform ${i === 1 ? 'text-primary translate-x-1' : 'text-zinc-300 group-hover:translate-x-1'}`} />
                               </button>
                             ))}
                          </div>
                       </div>

                       <button 
                         onClick={handleBookConsult}
                         disabled={isBooking}
                         className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-xl hover:bg-primary/95 transition-all active:scale-95 uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 disabled:opacity-50"
                       >
                          {isBooking ? (
                            <>
                              <Settings className="w-5 h-5 animate-spin" /> SYNCHRONIZING...
                            </>
                          ) : (
                            "Initialize Concierge Session"
                          )}
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
