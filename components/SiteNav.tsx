'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/map', label: 'Map' },
  { href: '/initiatives', label: 'Initiatives' },
  { href: '/about', label: 'About' },
  { href: '/submit', label: 'Submit' },
];

export default function SiteNav() {
  const pathname = usePathname();
  return (
    <nav className="site-nav">
      <div className="container">
        <Link href="/" className="brand">
          <span className="dot" />
          Living Repair
        </Link>
        <ul>
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={pathname === l.href ? 'active' : ''}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
