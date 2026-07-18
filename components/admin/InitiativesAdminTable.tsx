'use client';

import Link from 'next/link';

type Row = {
  id: string;
  name: string;
  city: string;
  country: string;
  repairSector: string;
  published: boolean;
  featured: boolean;
  peopleReached: number | null;
  itemsRepaired: number | null;
};

export default function InitiativesAdminTable({ initiatives }: { initiatives: Row[] }) {
  if (initiatives.length === 0) {
    return <p style={{ color: 'var(--ink-2)' }}>No initiatives published yet — approve a submission to create one.</p>;
  }

  const missingMetrics = initiatives.filter((i) => i.peopleReached == null && i.itemsRepaired == null);

  return (
    <>
      {missingMetrics.length > 0 && (
        <div className="hint" style={{ marginBottom: 16 }}>
          {missingMetrics.length} initiative{missingMetrics.length === 1 ? '' : 's'} have no impact numbers yet —
          open one and fill in what you know.
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Sector</th>
              <th>Status</th>
              <th>Impact data</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {initiatives.map((i) => (
              <tr key={i.id}>
                <td>
                  {i.name} {i.featured && <span className="status-badge approved" style={{ marginLeft: 6 }}>Featured</span>}
                </td>
                <td>{i.city}, {i.country}</td>
                <td style={{ textTransform: 'capitalize' }}>{i.repairSector}</td>
                <td>
                  <span className={`status-badge ${i.published ? 'approved' : 'rejected'}`}>
                    {i.published ? 'Published' : 'Unpublished'}
                  </span>
                </td>
                <td>{i.peopleReached == null && i.itemsRepaired == null ? '—' : 'Filled in'}</td>
                <td>
                  <Link href={`/admin/initiatives/${i.id}`}>Edit →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
