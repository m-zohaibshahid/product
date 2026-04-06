'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { rolesApi } from '@/lib/api';

// ─── Icons ──────────────────────────────────────────────────
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
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
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
const IconCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

interface Role { id: number; name: string; }

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: '', roleId: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    rolesApi.getAll()
      .then(data => setRoles(data))
      .catch(() => setRoles([]))
      .finally(() => setRolesLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  // Password strength
  const pwStrength = (() => {
    const p = form.password;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { label: 'Weak', color: 'var(--danger)', width: '25%' };
    if (score === 2) return { label: 'Fair', color: 'var(--warning)', width: '50%' };
    if (score === 3) return { label: 'Good', color: 'var(--brand-3)', width: '75%' };
    return { label: 'Strong', color: 'var(--success)', width: '100%' };
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim() || !form.email.trim() || !form.password || !form.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload: any = {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      };
      if (form.roleId) payload.roleId = Number(form.roleId);
      await register(payload);
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Registration failed. Please try again.';
      setError(typeof msg === 'string' ? msg : 'Registration failed.');
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

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card glass animate-scaleIn" style={{ textAlign: 'center', padding: '60px 44px' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.1))',
            border: '2px solid rgba(16,185,129,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', color: 'var(--success)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Account Created!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Redirecting you to the login page…</p>
          <div style={{ marginTop: 24 }}>
            <div className="spinner" style={{ margin: '0 auto' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      {/* Decorative orbs */}
      <div aria-hidden="true" style={{
        position: 'fixed', top: '-5%', right: '10%', width: 450, height: 450,
        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', filter: 'blur(40px)',
      }} />
      <div aria-hidden="true" style={{
        position: 'fixed', bottom: '0%', left: '5%', width: 380, height: 380,
        background: 'radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', filter: 'blur(35px)',
      }} />

      <div className="auth-card glass animate-fadeUp" style={{ maxWidth: 500 }}>
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

        <h1 className="auth-heading">Create your account</h1>
        <p className="auth-subheading">Join InvenX and start managing your inventory efficiently.</p>

        {/* Error */}
        {error && (
          <div className="alert alert-error animate-fadeIn" style={{ marginBottom: 20 }}>
            <IconAlert />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-username">Username <span style={{ color: 'var(--danger)' }}>*</span></label>
            <div className="input-wrapper">
              <span className="input-icon" style={{ color: focusedField === 'username' ? 'var(--brand-1)' : undefined }}>
                <IconUser />
              </span>
              <input
                id="reg-username"
                name="username"
                type="text"
                autoComplete="username"
                autoFocus
                className="form-input"
                placeholder="Pick a username"
                value={form.username}
                onChange={handleChange}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address <span style={{ color: 'var(--danger)' }}>*</span></label>
            <div className="input-wrapper">
              <span className="input-icon" style={{ color: focusedField === 'email' ? 'var(--brand-1)' : undefined }}>
                <IconMail />
              </span>
              <input
                id="reg-email"
                name="email"
                type="email"
                autoComplete="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Role */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-role">Role</label>
            <div className="input-wrapper has-right" style={{ position: 'relative' }}>
              <span className="input-icon" style={{ color: focusedField === 'role' ? 'var(--brand-1)' : undefined }}>
                <IconShield />
              </span>
              <select
                id="reg-role"
                name="roleId"
                className="form-input"
                style={{ appearance: 'none', paddingRight: 40, cursor: 'pointer' }}
                value={form.roleId}
                onChange={handleChange}
                onFocus={() => setFocusedField('role')}
                onBlur={() => setFocusedField(null)}
                disabled={loading || rolesLoading}
              >
                <option value="">{rolesLoading ? 'Loading roles…' : 'Select a role (optional)'}</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              <span className="input-icon-right" style={{ pointerEvents: 'none' }}>
                <IconChevron />
              </span>
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password <span style={{ color: 'var(--danger)' }}>*</span></label>
            <div className="input-wrapper has-right">
              <span className="input-icon" style={{ color: focusedField === 'password' ? 'var(--brand-1)' : undefined }}>
                <IconLock />
              </span>
              <input
                id="reg-password"
                name="password"
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                className="form-input"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                disabled={loading}
              />
              <button type="button" className="input-icon-right" onClick={() => setShowPw(v => !v)} tabIndex={-1}>
                {showPw ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            {/* Strength bar */}
            {pwStrength && (
              <div style={{ marginTop: 6 }}>
                <div style={{ height: 3, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: pwStrength.width,
                    background: pwStrength.color,
                    borderRadius: 99, transition: 'width 0.3s ease, background 0.3s ease',
                  }} />
                </div>
                <span style={{ fontSize: 11, color: pwStrength.color, marginTop: 3, display: 'inline-block' }}>
                  {pwStrength.label} password
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm">Confirm Password <span style={{ color: 'var(--danger)' }}>*</span></label>
            <div className="input-wrapper has-right">
              <span className="input-icon" style={{ color: focusedField === 'confirm' ? 'var(--brand-1)' : undefined }}>
                <IconLock />
              </span>
              <input
                id="reg-confirm"
                name="confirmPassword"
                type={showCPw ? 'text' : 'password'}
                autoComplete="new-password"
                className={`form-input ${form.confirmPassword && form.confirmPassword !== form.password ? 'error' : ''}`}
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange}
                onFocus={() => setFocusedField('confirm')}
                onBlur={() => setFocusedField(null)}
                disabled={loading}
              />
              <button type="button" className="input-icon-right" onClick={() => setShowCPw(v => !v)} tabIndex={-1}>
                {showCPw ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            {form.confirmPassword && form.password === form.confirmPassword && (
              <span style={{ fontSize: 12, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <IconCheck /> Passwords match
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            id="register-submit-btn"
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={loading}
            style={{ marginTop: 6 }}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Creating account…
              </>
            ) : (
              <>
                Create Account
                <IconArrow />
              </>
            )}
          </button>
        </form>

        <p className="auth-footer-link" style={{ marginTop: 28 }}>
          Already have an account?{' '}
          <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
