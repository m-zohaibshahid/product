'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

const publicRoutes = ['/login', '/register'];

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();
  const isPublicRoute = publicRoutes.includes(pathname || '');

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // For public routes (login/register), don't show sidebar/header
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // For protected routes, show sidebar/header only if authenticated
  if (isAuthenticated) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col ml-64">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    );
  }

  // If not authenticated and not on public route, show children (will redirect via ProtectedRoute)
  return <>{children}</>;
}


