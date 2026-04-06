'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// ─── tiny inline SVG icons ──────────────────────────────────
const IconBox = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconAlert = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login({ username: form.username.trim(), password: form.password });
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Invalid credentials. Please try again.';
      setError(typeof msg === 'string' ? msg : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: 28, height: 28 }} />
      </div>
    );
  }

  return (
    <div className="auth-page">
      {/* Decorative orbs */}
      <div aria-hidden="true" style={{
        position: 'fixed', top: '10%', left: '5%', width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', filter: 'blur(30px)',
      }} />
      <div aria-hidden="true" style={{
        position: 'fixed', bottom: '10%', right: '5%', width: 350, height: 350,
        background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', filter: 'blur(30px)',
      }} />

      <div className="auth-card glass animate-fadeUp">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <IconBox />
          </div>
          <div className="auth-logo-text">
            <span className="name">InvenX</span>
            <span className="tagline">Inventory Management System</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-subheading">Sign in to your account to continue managing your inventory.</p>

        {/* Error */}
        {error && (
          <div className="alert alert-error animate-fadeIn" style={{ marginBottom: 20 }}>
            <IconAlert />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <div className="input-wrapper">
              <span className="input-icon" style={{ color: focusedField === 'username' ? 'var(--brand-1)' : undefined }}>
                <IconUser />
              </span>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                autoFocus
                className="form-input"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="password">Password</label>
            </div>
            <div className="input-wrapper has-right">
              <span className="input-icon" style={{ color: focusedField === 'password' ? 'var(--brand-1)' : undefined }}>
                <IconLock />
              </span>
              <input
                id="password"
                name="password"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                className="form-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                disabled={loading}
              />
              <button
                type="button"
                className="input-icon-right"
                onClick={() => setShowPw(v => !v)}
                tabIndex={-1}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={loading}
            style={{ marginTop: 6 }}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Signing in…
              </>
            ) : (
              <>
                Sign In
                <IconArrow />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="auth-footer-link" style={{ marginTop: 32 }}>
          Don&apos;t have an account?{' '}
          <Link href="/register">Create one free</Link>
        </p>
      </div>
    </div>
  );
}
