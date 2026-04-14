'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package2, 
  Store, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  HelpCircle,
  ChevronUp,
  User,
  ArrowLeft,
  BookOpen,
  RotateCcw
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Package2, label: 'Inventory', href: '/inventory' },
  { icon: Store, label: 'POS', href: '/pos' },
  { icon: ShoppingBag, label: 'Purchase Orders', href: '/purchase-orders' },
  { icon: BookOpen, label: 'Khata', href: '/khata' },
  { icon: RotateCcw, label: 'Returns', href: '/returns' },
  { icon: BarChart3, label: 'Reports', href: '/reports' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-[280px] h-screen bg-white dark:bg-gray-500 border-r border-zinc-100 dark:border-gray-500 flex flex-col p-8 fixed left-0 top-0 z-50 transition-colors duration-500">
      <div className="mb-12">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-zinc-900/60 dark:text-zinc-50/60 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors mb-6 text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Portal
        </Link>
        <h1 className="text-zinc-900 dark:text-white text-2xl font-black italic-elegant tracking-tighter leading-tight">Atelier Inventory</h1>
        <p className="text-zinc-400 dark:text-zinc-100/60 font-bold uppercase tracking-widest text-[10px] mt-1">Premium Clothier</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300
                ${isActive 
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-gray-900 shadow-lg shadow-zinc-200 dark:shadow-black/20' 
                  : 'text-zinc-400 dark:text-zinc-50/60 hover:bg-zinc-50 dark:hover:bg-gray-500/20 hover:text-zinc-900 dark:hover:text-zinc-50'}`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white dark:text-gray-900' : 'text-zinc-400 dark:text-zinc-50/60'}`} strokeWidth={1.5} />
              <span className={`text-[11px] uppercase tracking-widest ${isActive ? 'font-black' : 'font-bold'}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-6 pt-8 border-t border-zinc-50 dark:border-gray-500/30">
        <Link href="/help" className="flex items-center gap-4 px-4 py-3 text-zinc-400 dark:text-zinc-50/60 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <HelpCircle className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-xs font-bold uppercase tracking-widest">Help</span>
        </Link>
        
        <div className="flex items-center gap-4 px-2 py-1 group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-gray-500/30 flex items-center justify-center text-zinc-400 dark:text-zinc-50/60 group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-gray-900 transition-all">
            <User className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-zinc-900 dark:text-white truncate uppercase tracking-tight">Julian Reed</p>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-200/60 truncate uppercase tracking-widest font-bold">Master Tailor</p>
          </div>
          <ChevronUp className="w-4 h-4 text-zinc-300 dark:text-zinc-100/30 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  );
}
