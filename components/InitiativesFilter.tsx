'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { PublicInitiative } from '@/lib/serialize';
import InitiativeCard from '@/components/InitiativeCard';

const SECTORS = [
  { value: 'all', label: 'All' },
  { value: 'textile', label: 'Textile' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'other', label: 'Other' },
];

export default function InitiativesFilter({ initiatives }: { initiatives: PublicInitiative[] }) {
  const [sector, setSector] = useState('all');
  const list = sector === 'all' ? initiatives : initiatives.filter((i) => i.repair_sector === sector);

  return (
    <>
      <div className="filter-bar">
        <span className="filter-label">Sector</span>
        {SECTORS.map((s) => (
          <button
            key={s.value}
            className={`chip ${sector === s.value ? 'active' : ''}`}
            onClick={() => setSector(s.value)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="card-grid">
        {list.length ? (
          list.map((i) => <InitiativeCard key={i.id} initiative={i} tagBy="sector" />)
        ) : (
          <p style={{ color: 'var(--ink-2)', padding: '24px 0' }}>
            No initiatives in this sector yet. <Link href="/submit">Recommend one →</Link>
          </p>
        )}
      </div>
    </>
  );
}
