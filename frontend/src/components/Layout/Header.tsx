'use client';

import { Bell, Search, User, LogOut } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Search */}
        <div className="flex flex-1 items-center max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, orders, suppliers..."
              className="input pl-10 w-full bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors group">
            <Bell className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
          </button>

          {/* User menu */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@clothshop.com</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <User className="h-4 w-4 text-white" />
            </div>
            <button className="rounded-lg p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
