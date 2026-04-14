"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Zap, Star, ShieldCheck, Truck, RefreshCcw, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const CATEGORIES = [
  "Bespoke Suits", "Luxury Fabrics", "Wedding Collection", "Formal Shirts", 
  "Trousers & Chinos", "Traditional Wear", "Leather Shoes", "Accessories",
  "Winter Collection", "Heritage Series", "Gift Cards", "Limited Edition"
];

const PRODUCTS = [
  { id: 1, name: "Midnight Silk Tuxedo", price: 1280.00, oldPrice: 1500.00, category: "Bespoke / New", img: "https://images.unsplash.com/photo-1598033129183-c4f50c717658?q=80&w=1000&auto=format&fit=crop", rating: 4.9, reviews: 124 },
  { id: 2, name: "Italian Wool Charcoal Suit", price: 850.00, oldPrice: 950.00, category: "Premium / Custom", img: "https://images.unsplash.com/photo-1594932224010-75f4383a54fd?q=80&w=1000&auto=format&fit=crop", rating: 4.8, reviews: 89 },
  { id: 3, name: "Egyptian Cotton Dress Shirt", price: 160.00, oldPrice: 200.00, category: "Essentials", img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop", rating: 4.7, reviews: 342 },
  { id: 4, name: "Imperial Cashmere Overcoat", price: 2450.00, oldPrice: 2800.00, category: "Outerwear", img: "https://images.unsplash.com/photo-1539533377285-300fe7afba4e?q=80&w=1000&auto=format&fit=crop", rating: 5.0, reviews: 56 },
  { id: 5, name: "Velvet Evening Blazer", price: 580.00, oldPrice: 700.00, category: "Evening Wear", img: "https://images.unsplash.com/photo-1592873523706-e74c86bf410e?q=80&w=1000&auto=format&fit=crop", rating: 4.9, reviews: 45 },
  { id: 6, name: "Bespoke Leather Loafers", price: 320.00, oldPrice: 400.00, category: "Footwear", img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop", rating: 4.6, reviews: 210 },
];

export default function ShopMainPage() {
  const { addToCart } = useCart();

  const handleQuickAdd = (p: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: p.id,
      name: p.name,
      price: p.price,
      qty: 1,
      img: p.img
    });
  };

  return (
    <div className="bg-zinc-50 dark:bg-[#1F2E4D] min-h-screen pb-20">
      {/* Hero & Category Section (Daraz Style) */}
      <section className="max-w-7xl mx-auto pt-6 px-4 md:px-6">
        <div className="flex gap-4 h-[440px]">
          {/* Vertical Categories Menu */}
          <div className="hidden lg:flex w-64 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm flex-col">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-white/10">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Categories</h2>
            </div>
            <div className="flex-1 overflow-y-auto py-2 no-scrollbar">
              {CATEGORIES.map((cat, i) => (
                <Link href={`/shop/search?cat=${cat}`} key={i} className="flex items-center justify-between px-5 py-2.5 hover:bg-primary/5 dark:hover:bg-white/5 cursor-pointer group transition-colors">
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300 group-hover:text-primary dark:group-hover:text-white">{cat}</span>
                  <ChevronRight className="w-3 h-3 text-zinc-300 group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>

            {/* Back to Portal Gateway */}
            <Link 
              href="/shop/profile" 
              className="p-5 bg-zinc-50 dark:bg-white/5 border-t border-zinc-200 dark:border-white/10 flex items-center gap-3 group hover:bg-primary transition-all"
            >
               <div className="bg-primary group-hover:bg-white p-2 rounded-lg transition-colors">
                  <User className="w-4 h-4 text-white group-hover:text-primary" />
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white">Client Hub</span>
                  <span className="text-[11px] font-bold text-zinc-800 dark:text-white group-hover:text-white">Go to Portal</span>
               </div>
               <ChevronRight className="w-4 h-4 ml-auto text-zinc-300 group-hover:text-white transition-all group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Main Hero Slider */}
          <div className="flex-1 rounded-xl overflow-hidden relative group shadow-lg">
            <Image 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
              alt="Hero Banner"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-12 text-white">
              <span className="bg-secondary text-[10px] font-black px-3 py-1 rounded-full w-fit mb-4">NEW COLLECTION 2024</span>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight mb-6 max-w-lg">
                The Art of <br />
                <span className="text-primary-container italic-elegant text-6xl md:text-7xl">Bespoke Excellence</span>
              </h1>
              <p className="text-zinc-200 text-lg mb-8 max-w-md font-light leading-relaxed">
                Elevate your presence with suits crafted to perfection by our master tailors.
              </p>
              <Link 
                href="/shop/search"
                className="bg-white text-primary text-xs font-black py-4 px-10 rounded-full w-fit hover:bg-primary-container hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl inline-block"
              >
                SHOP THE COLLECTION
              </Link>
            </div>
          </div>

          {/* Side Banner Cards */}
          <div className="hidden xl:flex w-64 flex-col gap-4">
            <Link href="/shop/search?cat=Wedding Collection" className="flex-1 rounded-xl overflow-hidden relative group cursor-pointer shadow-md">
              <Image 
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop"
                alt="Suit Banner"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-5">
                <span className="text-white text-[10px] font-black tracking-widest uppercase">Wedding Series</span>
                <p className="text-white text-sm font-bold">Timeless Portraits</p>
              </div>
            </Link>
            <Link href="/shop/search?cat=Luxury Fabrics" className="flex-1 rounded-xl overflow-hidden relative group cursor-pointer shadow-md">
              <Image 
                src="https://images.unsplash.com/photo-1479064560453-33924fd33c46?q=80&w=1000&auto=format&fit=crop"
                alt="Fabric Banner"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-5">
                <span className="text-white text-[10px] font-black tracking-widest uppercase">Luxury Fabrics</span>
                <p className="text-white text-sm font-bold">Imported Selection</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid (Circular) */}
      <section className="max-w-7xl mx-auto mt-10 px-6">
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 md:gap-8">
          {[ 
            { name: "Suits", cat: "Bespoke Suits", img: "https://images.unsplash.com/photo-1594932224010-75f4383a54fd?q=80&w=200&auto=format&fit=crop" },
            { name: "Fabrics", cat: "Luxury Fabrics", img: "https://images.unsplash.com/photo-1598033129183-c4f50c717658?q=80&w=200&auto=format&fit=crop" },
            { name: "Shirts", cat: "Tailored Shirts", img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=200&auto=format&fit=crop" },
            { name: "Wedding", cat: "Wedding Collection", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=200&auto=format&fit=crop" },
            { name: "Shoes", cat: "Artisan Shoes", img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=200&auto=format&fit=crop" },
            { name: "Accessories", cat: "Accessories", img: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=200&auto=format&fit=crop" },
            { name: "Winter", cat: "Winter Collection", img: "https://images.unsplash.com/photo-1539533377285-300fe7afba4e?q=80&w=200&auto=format&fit=crop" },
            { name: "Bespoke", cat: "Heritage Series", img: "https://images.unsplash.com/photo-1559415115-4876d78707ef?q=80&w=200&auto=format&fit=crop" }
          ].map((cat, i) => (
            <Link href={`/shop/search?cat=${cat.cat}`} key={i} className="flex flex-col items-center gap-3 group cursor-pointer">
              <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all duration-300 shadow-md transform group-hover:scale-110">
                <Image src={cat.img} alt={cat.name} fill className="object-cover" />
              </div>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-500 group-hover:text-primary transition-colors text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Artisan Path Selection (Stitched vs Unstitched) */}
      <section className="max-w-7xl mx-auto mt-16 px-6">
        <div className="flex flex-col md:flex-row gap-8">
          <Link 
            href="/shop/search?cat=Bespoke Suits" 
            className="flex-1 group relative h-[320px] rounded-3xl overflow-hidden shadow-2xl border border-zinc-100 dark:border-white/10"
          >
            <Image 
              src="https://images.unsplash.com/photo-1594932224010-75f4383a54fd?q=80&w=1200&auto=format&fit=crop" 
              alt="Stitched Collection" 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-10">
               <span className="text-primary text-[10px] font-black tracking-[0.4em] uppercase mb-3">Tailoring Vault</span>
               <h3 className="text-4xl font-black text-white tracking-tighter">SIGNATURE STITCHED</h3>
               <p className="text-white/70 text-sm font-medium mt-3 max-w-xs leading-relaxed">Masterfully finished commissions crafted to your precise anatomical profile.</p>
               <div className="mt-8 flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.2em] group-hover:gap-5 transition-all">
                  EXPLORE COLLECTIONS <ChevronRight className="w-5 h-5 text-primary" />
               </div>
            </div>
          </Link>

          <Link 
            href="/shop/search?cat=Luxury Fabrics" 
            className="flex-1 group relative h-[320px] rounded-3xl overflow-hidden shadow-2xl border border-zinc-100 dark:border-white/10"
          >
            <Image 
              src="https://images.unsplash.com/photo-1598033129183-c4f50c717658?q=80&w=1200&auto=format&fit=crop" 
              alt="Unstitched Collection" 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-10">
               <span className="text-secondary text-[10px] font-black tracking-[0.4em] uppercase mb-3">Elite Material</span>
               <h3 className="text-4xl font-black text-white tracking-tighter">ELITE UNSTITCHED</h3>
               <p className="text-white/70 text-sm font-medium mt-3 max-w-xs leading-relaxed">The finest raw textiles. Direct from the world&apos;s most prestigious heritage mills.</p>
               <div className="mt-8 flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.2em] group-hover:gap-5 transition-all">
                  ENTER FABRIC VAULT <ChevronRight className="w-5 h-5 text-secondary" />
               </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto py-8 grid grid-cols-2 md:grid-cols-4 gap-4 px-6 mt-4">
        <div className="flex items-center gap-3 bg-white dark:bg-white/5 p-4 rounded-xl border border-zinc-100 dark:border-white/10 shadow-sm">
          <Truck className="w-6 h-6 text-primary" />
          <div>
            <p className="text-[11px] font-black uppercase text-zinc-800 dark:text-zinc-200">Express Delivery</p>
            <p className="text-[10px] text-zinc-500">Ships within 24 hours</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-white/5 p-4 rounded-xl border border-zinc-100 dark:border-white/10 shadow-sm">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <div>
            <p className="text-[11px] font-black uppercase text-zinc-800 dark:text-zinc-200">Authentic Cloth</p>
            <p className="text-[10px] text-zinc-500">100% Genuine Fabrics</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-white/5 p-4 rounded-xl border border-zinc-100 dark:border-white/10 shadow-sm">
          <RefreshCcw className="w-6 h-6 text-primary" />
          <div>
            <p className="text-[11px] font-black uppercase text-zinc-800 dark:text-zinc-200">Bespoke Fit</p>
            <p className="text-[10px] text-zinc-500">Guaranteed Fit Satisfaction</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-white/5 p-4 rounded-xl border border-zinc-100 dark:border-white/10 shadow-sm">
          <Zap className="w-6 h-6 text-primary" />
          <div>
            <p className="text-[11px] font-black uppercase text-zinc-800 dark:text-zinc-200">Secure Payments</p>
            <p className="text-[10px] text-zinc-500">End-to-end Encrypted</p>
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="max-w-7xl mx-auto mt-12 px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black tracking-tight text-primary dark:text-white uppercase">Flash Collective</h2>
            <div className="flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Ending In:</span>
              <div className="flex gap-1">
                <span className="bg-secondary text-white text-[11px] font-black w-6 h-6 rounded flex items-center justify-center shadow-sm">08</span>
                <span className="text-secondary">:</span>
                <span className="bg-secondary text-white text-[11px] font-black w-6 h-6 rounded flex items-center justify-center shadow-sm">24</span>
                <span className="text-secondary">:</span>
                <span className="bg-secondary text-white text-[11px] font-black w-6 h-6 rounded flex items-center justify-center shadow-sm">56</span>
              </div>
            </div>
          </div>
          <Link 
            href="/shop/search?cat=Sale"
            className="text-[11px] font-black text-primary hover:underline underline-offset-4 tracking-[0.2em] uppercase"
          >
             VIEW ALL
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {PRODUCTS.map((p) => (
            <Link href={`/shop/product/${p.id}`} key={p.id} className="group cursor-pointer bg-white dark:bg-white/5 rounded-xl border border-zinc-100 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image 
                  src={p.img}
                  alt={p.name}
                  fill
                  className="object-cover scale-100 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-primary text-white text-[9px] font-black px-2 py-1 rounded">
                  -{Math.round((1 - p.price/p.oldPrice)*100)}%
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex flex-col justify-end p-4 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                  <button 
                    onClick={(e) => handleQuickAdd(p, e)}
                    className="bg-white text-primary text-[10px] font-black py-2.5 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-primary hover:text-white text-center cursor-pointer"
                  >
                    QUICK ADD
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-1">
                <h3 className="text-[13px] font-bold text-zinc-800 dark:text-zinc-100 truncate">{p.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-black text-primary dark:text-white">${p.price}</span>
                  <span className="text-[10px] text-zinc-400 line-through font-medium">${p.oldPrice}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-2.5 h-2.5 fill-current ${i >= Math.floor(p.rating) ? 'text-zinc-200 dark:text-zinc-700' : ''}`} />
                    ))}
                  </div>
                  <span className="text-[9px] text-zinc-400 font-bold">({p.reviews})</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Curated Recommendations */}
      <section className="max-w-7xl mx-auto mt-20 px-6">
        <h2 className="text-xl font-bold tracking-tight text-zinc-400 dark:text-zinc-500 uppercase mb-8 text-center italic-elegant tracking-[0.3em]">Just For You</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {/* Reusing product card style from flash sale but larger for this section */}
          {PRODUCTS.slice(0, 4).map((p) => (
            <Link href={`/shop/product/${p.id}`} key={p.id} className="group cursor-pointer">
              <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-zinc-100 dark:bg-white/5 shadow-2xl scale-[0.98] group-hover:scale-100 transition-transform duration-700 rounded-2xl">
                <Image 
                  src={p.img}
                  alt={p.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
              <div className="space-y-2 text-center">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 dark:bg-white/5 px-3 py-1 rounded-full">{p.category}</span>
                <h3 className="text-lg font-bold tracking-tight">{p.name}</h3>
                <p className="text-zinc-500 font-black text-xl">${p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
