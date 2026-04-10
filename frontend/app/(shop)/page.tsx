import Image from 'next/image';

const PRODUCTS = [
  { id: 1, name: "Luxury Silk Drape", price: "$280", category: "Fabric / New", img: "https://images.unsplash.com/photo-1598033129183-c4f50c717658?q=80&w=1000&auto=format&fit=crop" },
  { id: 2, name: "Wool Tailored Suit", price: "$1,250", category: "Bespoke / Custom", img: "https://images.unsplash.com/photo-1594932224010-75f4383a54fd?q=80&w=1000&auto=format&fit=crop" },
  { id: 3, name: "Premium Cotton Shirt", price: "$160", category: "Essentials", img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop" },
  { id: 4, name: "Classic Trench Coat", price: "$850", category: "Outerwear", img: "https://images.unsplash.com/photo-1539533377285-300fe7afba4e?q=80&w=1000&auto=format&fit=crop" },
];

export default function ShopMainPage() {
  return (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="mb-20">
        <h1 className="text-6xl font-bold font-['Playfair_Display'] italic mb-4">Curated Collection</h1>
        <p className="text-zinc-500 text-lg">Handpicked excellence for the modern minimalist.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {PRODUCTS.map((p) => (
          <div key={p.id} className="group cursor-pointer">
            <div className="relative aspect-3/4 mb-6 overflow-hidden bg-zinc-100 scale-[0.98] group-hover:scale-100 transition-transform duration-700">
              <Image 
                src={p.img}
                alt={p.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{p.category}</span>
              <h3 className="text-lg font-medium">{p.name}</h3>
              <p className="text-zinc-500 font-semibold">{p.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
