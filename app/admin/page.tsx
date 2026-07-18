import { listSubmissions } from '@/lib/submissions';
import SubmissionsTable from '@/components/admin/SubmissionsTable';
import AdminSubNav from '@/components/admin/AdminSubNav';

export const revalidate = 0;

export default async function AdminPage() {
  const submissions = await listSubmissions();

  return (
    <section className="section" style={{ padding: '56px 0' }}>
      <div className="container">
        <div className="label">Admin</div>
        <h1 style={{ marginBottom: 32 }}>Submissions</h1>
        <AdminSubNav />
        <SubmissionsTable
          submissions={submissions.map((s) => ({
            id: s.id,
            name: s.name,
            city: s.city,
            country: s.country,
            status: s.status,
            createdAt: s.createdAt.toISOString(),
          }))}
        />
      </div>
    </section>
  );
}
