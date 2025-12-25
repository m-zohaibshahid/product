'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Warehouse,
  FileText,
  Users,
  BarChart3,
  Settings,
  Boxes,
  ShoppingBag,
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/stock', label: 'Stock', icon: Warehouse },
  { href: '/purchase-orders', label: 'Purchase Orders', icon: ShoppingBag },
  { href: '/sales', label: 'Sales', icon: ShoppingCart },
  { href: '/suppliers', label: 'Suppliers', icon: Users },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-transform shadow-xl border-r border-slate-700/50">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-slate-700/50 px-6 bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-2">
              <Boxes className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Cloth Inventory
              </span>
              <p className="text-xs text-gray-400 mt-0.5">Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-white/80 animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-700/50 p-4 bg-slate-900/50 backdrop-blur-sm">
          <p className="text-xs text-slate-400">© 2024 Cloth Inventory</p>
          <p className="mt-1 text-xs text-slate-500">Version 1.0.0</p>
        </div>
      </div>
    </aside>
  );
}
