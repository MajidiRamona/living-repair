import { listAllInitiatives } from '@/lib/adminInitiatives';
import AdminSubNav from '@/components/admin/AdminSubNav';
import InitiativesAdminTable from '@/components/admin/InitiativesAdminTable';

export const revalidate = 0;

export default async function AdminInitiativesPage() {
  const initiatives = await listAllInitiatives();

  return (
    <section className="section" style={{ padding: '56px 0' }}>
      <div className="container">
        <div className="label">Admin</div>
        <h1 style={{ marginBottom: 32 }}>Initiatives</h1>
        <AdminSubNav />
        <InitiativesAdminTable
          initiatives={initiatives.map((i) => ({
            id: i.id,
            name: i.name,
            city: i.city,
            country: i.country,
            repairSector: i.repairSector,
            published: i.published,
            featured: i.featured,
            peopleReached: i.peopleReached,
            itemsRepaired: i.itemsRepaired,
          }))}
        />
      </div>
    </section>
  );
}
