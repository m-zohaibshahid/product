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
  User
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Package2, label: 'Inventory', href: '/inventory' },
  { icon: Store, label: 'POS', href: '/pos' },
  { icon: ShoppingBag, label: 'Purchase Orders', href: '/purchase-orders' },
  { icon: BarChart3, label: 'Reports', href: '/reports' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-[280px] h-screen bg-surface-container-low flex flex-col p-8 fixed left-0 top-0 z-50">
      <div className="mb-12">
        <h1 className="text-primary title-lg mb-1 leading-tight">Atelier Inventory</h1>
        <p className="text-secondary label-md text-xs">Premium Clothier</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-md transition-all duration-300
                ${isActive 
                  ? 'bg-surface-container-lowest text-primary ambient-shadow' 
                  : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-on-surface-variant/70'}`} strokeWidth={1.5} />
              <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 pt-8">
        <Link href="/help" className="flex items-center gap-4 px-4 py-3 text-on-surface-variant hover:text-primary transition-colors">
          <HelpCircle className="w-5 h-5 opacity-70" strokeWidth={1.5} />
          <span className="text-sm font-medium">Help</span>
        </Link>
        
        <div className="separator-minimal h-[1px] bg-outline-variant/15 my-6" />
        
        <div className="flex items-center gap-4 px-2 py-1 group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
            <User className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-primary truncate">Julian Reed</p>
            <p className="text-xs text-on-surface-variant/70 truncate uppercase tracking-widest font-medium">Master Tailor</p>
          </div>
          <ChevronUp className="w-4 h-4 text-on-surface-variant/50 group-hover:text-primary transition-colors" />
        </div>
      </div>
    </div>
  );
}
