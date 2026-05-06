"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Truck, ShieldCheck, Heart, ShoppingBag, Facebook, Twitter, MessageCircle, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState("52R");
  const [construction, setConstruction] = useState("stitched");
  const [fabricType, setFabricType] = useState("suit"); // 'suit' or 'cut'
  const [meters, setMeters] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#1F2E4D");

  // Mock product for UI/UX
  const product = {
    id: params.id,
    name: "Midnight Silk Bespoke Tuxedo",
    price: 1280.00,
    oldPrice: 1500.00,
    perMeterRate: 350.00,
    rating: 4.8,
    reviews: 124,
    description: "Experience unparalleled elegance with our signature Midnight Silk Tuxedo. Hand-tailored from the finest Italian silk, this tuxedo offers a silhouette that perfectly balances modern sharpness with classic sophistication.",
    images: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c717658?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594932224010-75f4383a54fd?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539533377285-300fe7afba4e?q=80&w=1000&auto=format&fit=crop"
    ],
    sizes: ["48R", "50R", "52R", "54R", "56R"],
    colors: [
      { name: "Midnight Navy", val: "#1F2E4D" },
      { name: "Classic Onyx", val: "#000000" },
      { name: "Estate Charcoal", val: "#1a1a1a" }
    ],
    specs: [
      { label: "Material", value: "100% Italian Silk / Wool Blend" },
      { label: "Fit", value: "Slim Contemporary Fit" },
      { label: "Lapel", value: "Peak Satin Lapel" },
      { label: "Lining", value: "Custom Bemberg Signature" }
    ]
  };

  // Dynamic Price Calculation
  const calculatePrice = () => {
    if (construction === 'stitched') return product.price;
    if (fabricType === 'suit') return product.price - 100;
    return product.perMeterRate * meters;
  };

  const finalPrice = calculatePrice();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: finalPrice,
      qty: quantity,
      size: construction === 'stitched' ? selectedSize : "Fabric Only",
      color: product.colors.find(c => c.val === selectedColor)?.name,
      construction: construction,
      fabricType: construction === 'unstitched' ? fabricType : null,
      meters: fabricType === 'cut' ? meters : (fabricType === 'suit' ? 4 : 0),
      img: product.images[0]
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/shop/cart');
  };

  const handleBookAppt = () => {
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      alert("Atelier Appointment Dispatch Initialized. Check your portal for status.");
    }, 2000);
  };

  return (
    <div className="bg-zinc-50 dark:bg-black/20 min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white dark:bg-white/5 rounded-3xl overflow-hidden shadow-2xl border border-zinc-100 dark:border-white/10 p-8">
          
          {/* Image Gallery */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg group">
              <Image 
                src={activeImg || product.images[0]} 
                alt={product.name} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveImg(img)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all shadow-md ${activeImg === img ? 'border-primary ring-2 ring-primary/20' : 'border-zinc-100 dark:border-white/10 hover:border-primary'}`}
                >
                  <Image src={img} alt={`${product.name} shadow-${i}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-6 space-y-8 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full">New Arrival</span>
                <div className="flex gap-4">
                  <Heart className="w-5 h-5 text-zinc-300 hover:text-secondary cursor-pointer transition-colors" />
                </div>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-zinc-800 dark:text-zinc-100">{product.name}</h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 fill-current ${i >= Math.floor(product.rating) ? 'text-zinc-200 dark:text-zinc-800' : ''}`} />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-zinc-500">{product.rating} / 5.0</span>
                </div>
                <span className="h-4 w-px bg-zinc-200 dark:bg-white/10" />
                <span className="text-sm text-zinc-400 font-medium">{product.reviews} High-fidelity ratings</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-black text-primary dark:text-white">${finalPrice.toFixed(2)}</span>
                {fabricType === 'cut' && construction === 'unstitched' && (
                  <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">/ {meters} Meters</span>
                )}
                <span className="text-xl text-zinc-400 line-through">${product.oldPrice}</span>
              </div>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                {construction === 'stitched' ? 'Pricing inclusive of Bespoke Tailoring' : (fabricType === 'suit' ? 'Full Suit Length (Standard 4.5m)' : `Cut Piece Selection ($${product.perMeterRate}/meter)`)}
              </p>
            </div>

            <p className="text-zinc-500 leading-relaxed text-sm">{product.description}</p>

            <div className="space-y-8">
              {/* Construction Selection */}
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Service Architecture</span>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setConstruction('stitched')}
                    className={`p-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all cursor-pointer ${construction === 'stitched' ? 'border-primary bg-primary/5 shadow-inner' : 'border-zinc-100 dark:border-white/10 hover:border-primary/50'}`}
                  >
                     <Star className={`w-5 h-5 ${construction === 'stitched' ? 'text-primary' : 'text-zinc-300'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${construction === 'stitched' ? 'text-primary' : 'text-zinc-500'}`}>Bespoke Stitched</span>
                  </button>
                  <button 
                    onClick={() => setConstruction('unstitched')}
                    className={`p-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all cursor-pointer ${construction === 'unstitched' ? 'border-primary bg-primary/5 shadow-inner' : 'border-zinc-100 dark:border-white/10 hover:border-primary/50'}`}
                  >
                     <Package className={`w-5 h-5 ${construction === 'unstitched' ? 'text-primary' : 'text-zinc-300'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${construction === 'unstitched' ? 'text-primary' : 'text-zinc-500'}`}>Unstitched Fabric</span>
                  </button>
                </div>
              </div>

              {/* Unstitched Fabric Type (Only if unstitched) */}
              {construction === 'unstitched' && (
                <div className="space-y-5 animate-in fade-in slide-in-from-top-4">
                   <div className="p-6 bg-zinc-50 dark:bg-white/5 rounded-3xl border border-zinc-100 dark:border-white/10 space-y-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Fabric Allocation Type</span>
                      <div className="flex gap-4">
                         <button 
                            onClick={() => setFabricType('suit')}
                            className={`flex-1 py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${fabricType === 'suit' ? 'border-primary bg-primary text-white' : 'border-zinc-200 text-zinc-500 hover:border-primary/50'}`}
                         >
                            Full Suit Length
                         </button>
                         <button 
                            onClick={() => setFabricType('cut')}
                            className={`flex-1 py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${fabricType === 'cut' ? 'border-primary bg-primary text-white' : 'border-zinc-200 text-zinc-500 hover:border-primary/50'}`}
                         >
                            Custom Cut Piece
                         </button>
                      </div>

                      {fabricType === 'cut' && (
                        <div className="pt-4 border-t border-zinc-200 dark:border-white/10 space-y-3">
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Specify Meterage</span>
                              <span className="text-[10px] font-bold text-primary">$350.00 / Meter</span>
                           </div>
                           <div className="flex items-center bg-white dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/10 p-2 shadow-sm">
                              <button onClick={() => setMeters(Math.max(1, meters - 1))} className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-primary transition-colors text-xl font-bold cursor-pointer">−</button>
                              <div className="flex-grow text-center flex flex-col">
                                <span className="text-lg font-black text-primary leading-none">{meters}</span>
                                <span className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Meters</span>
                              </div>
                              <button onClick={() => setMeters(meters + 1)} className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-primary transition-colors text-xl font-bold cursor-pointer">+</button>
                           </div>
                           <p className="text-[9px] text-zinc-400 italic">Recommended for blazers: 2m, Full suits: 4.5m, Trousers: 1.5m.</p>
                        </div>
                      )}
                   </div>
                </div>
              )}

              {/* Size Selection (Only if stitched) */}
              {construction === 'stitched' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                    <span className="text-zinc-500">Size (Standard EU)</span>
                    <span className="text-primary hover:underline cursor-pointer">Size Guide</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button 
                        key={size} 
                        onClick={() => setSelectedSize(size)}
                        className={`w-14 h-12 flex items-center justify-center border-2 rounded-xl text-xs font-black transition-all active:scale-95 shadow-sm cursor-pointer ${selectedSize === size ? 'border-primary text-primary bg-primary/5' : 'border-zinc-100 dark:border-white/10 hover:border-primary hover:text-primary'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection & Quantity */}
              <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-end">
                <div className="space-y-3">
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Select Finish</span>
                  <div className="flex gap-4">
                    {product.colors.map((c) => (
                      <button 
                        key={c.val} 
                        onClick={() => setSelectedColor(c.val)}
                        className={`w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 ring-2 transition-all shadow-md cursor-pointer ${selectedColor === c.val ? 'ring-primary' : 'ring-transparent hover:ring-zinc-300'}`} 
                        style={{ backgroundColor: c.val }} 
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Quantity</span>
                  <div className="flex items-center bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-100 dark:border-white/10 px-4 py-2 gap-6 shadow-sm">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-zinc-400 hover:text-primary transition-colors cursor-pointer text-lg font-bold">−</button>
                    <span className="text-sm font-black text-zinc-700 dark:text-zinc-200 w-4 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="text-zinc-400 hover:text-primary transition-colors cursor-pointer text-lg font-bold">+</button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handleBuyNow}
                  className="flex-1 bg-primary text-white font-black py-5 rounded-2xl hover:bg-primary-container shadow-xl active:scale-95 transition-all text-sm tracking-widest flex items-center justify-center gap-3 cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" /> BUY NOW
                </button>
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 border-2 border-primary text-primary font-black py-5 rounded-2xl hover:bg-primary/5 active:scale-95 transition-all text-sm tracking-widest cursor-pointer"
                >
                  ADD TO CART
                </button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-2 gap-4 p-5 bg-zinc-50 dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/10">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-primary" />
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase tracking-tight">Express Delivery</p>
                  <p className="text-[9px] text-zinc-500">Delivered within 3-5 days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase tracking-tight">Official Warranty</p>
                  <p className="text-[9px] text-zinc-500">100% Fit Guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications & Details (Daraz Review/Detail Style) */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <div className="bg-white dark:bg-white/5 rounded-3xl p-10 shadow-xl border border-zinc-100 dark:border-white/10">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 pb-4 border-b border-zinc-100 dark:border-white/10 text-primary">Technical Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {product.specs.map((spec, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-zinc-50 dark:border-white/5">
                    <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">{spec.label}</span>
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-white/5 rounded-3xl p-10 shadow-xl border border-zinc-100 dark:border-white/10">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 pb-4 border-b border-zinc-100 dark:border-white/10 text-primary">Heritage Tailoring</h2>
              <div className="prose dark:prose-invert max-w-none text-zinc-500 text-sm leading-loose">
                <p>Every piece at Atelier is a result of over 200 hours of meticulous handcrafting. Our master tailors use centuries-old techniques blended with modern digital precision to ensure a fit that is not just a garment, but a second skin.</p>
                <p>Designed for the digital-first professional, our Concierge collection brings high-fidelity luxury straight to your door, backed by our legendary 100% Fit Satisfaction Guarantee.</p>
              </div>
            </div>
          </div>

          {/* Social Proof & Trust */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-white dark:bg-white/5 rounded-3xl p-8 shadow-xl border border-zinc-100 dark:border-white/10">
                <h4 className="text-xs font-black uppercase tracking-widest mb-6 text-zinc-400">Share with Circle</h4>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white cursor-pointer transition-all"><Facebook className="w-4 h-4" /></div>
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white cursor-pointer transition-all"><Twitter className="w-4 h-4" /></div>
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white cursor-pointer transition-all"><MessageCircle className="w-4 h-4" /></div>
                </div>
             </div>
             
             <div className="bg-gradient-to-br from-primary to-primary-container rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 space-y-4">
                  <h4 className="text-xl font-black leading-tight">Need a Bespoke Consultation?</h4>
                  <p className="text-xs text-white/70 leading-relaxed font-light">Book a virtual session with our master tailor for precise measurements.</p>
                  <button 
                    onClick={handleBookAppt}
                    disabled={isBooking}
                    className="bg-white text-primary text-[10px] font-black px-6 py-3 rounded-xl hover:scale-105 transition-all shadow-lg active:scale-95 disabled:opacity-70 flex items-center gap-2"
                  >
                    {isBooking ? (
                      <>
                        <div className="w-3 h-3 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                        DISPATCHING...
                      </>
                    ) : (
                      "BOOK APPOINTMENT"
                    )}
                  </button>
                </div>
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
