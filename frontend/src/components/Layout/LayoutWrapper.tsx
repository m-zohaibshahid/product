'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

const publicRoutes = ['/login', '/register'];

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();
  const isPublic = publicRoutes.includes(pathname || '');

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 16,
      }}>
        <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading…</p>
      </div>
    );
  }

  if (isPublic) return <>{children}</>;

  if (isAuthenticated) {
    return (
      <div className="app-shell">
        <Sidebar />
        <div className="main-content">
          <Header />
          <main className="page-body">{children}</main>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
