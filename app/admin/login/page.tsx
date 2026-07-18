'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setSubmitting(false);
    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? 'Login failed');
    }
  }

  return (
    <section className="section" style={{ padding: '80px 0', minHeight: '60vh' }}>
      <div className="container" style={{ maxWidth: 420 }}>
        <div className="label">Admin</div>
        <h1 style={{ fontSize: '2rem', marginBottom: 32 }}>Sign in to review submissions</h1>
        <form onSubmit={handleSubmit}>
          <div className="field" style={{ marginBottom: 20 }}>
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              autoFocus
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
          {error && <div className="form-status err" role="alert">{error}</div>}
        </form>
      </div>
    </section>
  );
}
