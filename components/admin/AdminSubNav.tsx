'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminSubNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  const isSubmissions = pathname === '/admin' || pathname.startsWith('/admin/submissions');
  const isInitiatives = pathname.startsWith('/admin/initiatives');

  return (
    <div className="filter-bar" style={{ justifyContent: 'space-between', marginBottom: 32 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Link href="/admin" className={`chip ${isSubmissions ? 'active' : ''}`}>Submissions</Link>
        <Link href="/admin/initiatives" className={`chip ${isInitiatives ? 'active' : ''}`}>Initiatives</Link>
      </div>
      <button className="chip" onClick={logout}>Sign out</button>
    </div>
  );
}
