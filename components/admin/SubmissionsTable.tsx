'use client';

import { useState } from 'react';
import Link from 'next/link';

type Row = {
  id: string;
  name: string | null;
  city: string;
  country: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
};

const FILTERS = ['All', 'Pending', 'Approved', 'Rejected'] as const;

export default function SubmissionsTable({ submissions }: { submissions: Row[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const list = filter === 'All' ? submissions : submissions.filter((s) => s.status === filter.toUpperCase());

  return (
    <>
      <div className="filter-bar" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className="filter-label">Status</span>
          {FILTERS.map((f) => (
            <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        <a href="/api/admin/submissions/export" className="chip" download>
          Download CSV ↓
        </a>
      </div>

      {list.length === 0 ? (
        <p style={{ color: 'var(--ink-2)' }}>No submissions here yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Submitted</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.id}>
                  <td>{s.name || <em style={{ color: 'var(--ink-2)' }}>(no name)</em>}</td>
                  <td>{s.city}, {s.country}</td>
                  <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${s.status.toLowerCase()}`}>{s.status}</span>
                  </td>
                  <td>
                    <Link href={`/admin/submissions/${s.id}`}>Review →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
