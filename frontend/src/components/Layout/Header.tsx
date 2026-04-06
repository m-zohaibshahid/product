'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const IconBell = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IconLogOut = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const pageTitles: Record<string, string> = {
  '/dashboard':      'Dashboard',
  '/products':       'Products',
  '/stock':          'Stock',
  '/brands':         'Brands',
  '/categories':     'Categories',
  '/purchase-orders':'Purchase Orders',
  '/sales':          'Sales',
  '/suppliers':      'Suppliers',
  '/reports':        'Reports',
  '/settings':       'Settings',
};

function getTitle(pathname: string | null): string {
  if (!pathname) return 'Dashboard';
  for (const [path, title] of Object.entries(pageTitles)) {
    if (pathname === path || pathname.startsWith(path + '/')) return title;
  }
  return 'InvenX';
}

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const title = getTitle(pathname);
  const initials = user?.username?.slice(0, 2).toUpperCase() ?? 'U';

  return (
    <header className="topbar">
      <span className="topbar-title">{title}</span>
      <div className="topbar-spacer" />

      {/* Notification */}
      <button
        className="btn btn-ghost btn-sm"
        style={{ position: 'relative', padding: '7px 10px', borderRadius: 'var(--r-md)' }}
        aria-label="Notifications"
      >
        <IconBell />
        <span style={{
          position: 'absolute', top: 6, right: 6,
          width: 7, height: 7, borderRadius: '50%',
          background: 'var(--brand-1)',
          border: '1.5px solid var(--bg-base)',
        }} />
      </button>

      {/* User chip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '5px 10px', borderRadius: 'var(--r-md)',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border)',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--brand-1), var(--brand-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {user?.username ?? 'User'}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.2 }}>
              {(user as any)?.role?.name ?? 'Staff'}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="btn btn-ghost btn-sm"
          style={{ padding: '7px 10px', borderRadius: 'var(--r-md)', color: 'var(--text-muted)' }}
          title="Sign out"
        >
          <IconLogOut />
        </button>
      </div>
    </header>
  );
}
