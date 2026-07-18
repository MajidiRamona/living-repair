import Link from 'next/link';
import type { PublicInitiative } from '@/lib/serialize';
import { DOMAIN_COLORS, DOMAIN_LABELS, SECTOR_LABELS, fmtNum } from '@/lib/domains';

export default function InitiativeCard({
  initiative,
  tagBy = 'domain',
}: {
  initiative: PublicInitiative;
  tagBy?: 'domain' | 'sector';
}) {
  const tagLabel = tagBy === 'domain' ? DOMAIN_LABELS[initiative.domain] : SECTOR_LABELS[initiative.repair_sector] ?? 'Other';
  const tagColor = tagBy === 'domain' ? DOMAIN_COLORS[initiative.domain] : undefined;

  return (
    <Link className="card" href={`/initiatives/${initiative.id}`}>
      <span
        className="tag"
        style={tagColor ? { borderColor: tagColor, color: tagColor } : undefined}
      >
        {tagLabel}
      </span>
      <h3>{initiative.name}</h3>
      <p>{initiative.tagline}</p>
      <div className="meta">
        <span>
          {initiative.city}, {initiative.country}
        </span>
        <span>{fmtNum(initiative.people_reached)} people</span>
      </div>
    </Link>
  );
}
