'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import type { PublicInitiative } from '@/lib/serialize';
import { DOMAIN_COLORS, DOMAIN_LABELS } from '@/lib/domains';

export default function MapClient({ initiatives }: { initiatives: PublicInitiative[] }) {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<LeafletMap | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !mapEl.current || mapInstance.current) return;

      const map = L.map(mapEl.current, { worldCopyJump: true }).setView([30, 10], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 18,
      }).addTo(map);
      mapInstance.current = map;

      initiatives.forEach((i) => {
        const color = DOMAIN_COLORS[i.domain] || '#1a1a1a';
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="width:18px;height:18px;border-radius:50%;background:${color};border:2px solid #1a1a1a;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });
        const marker = L.marker([i.lat, i.lng], { icon }).addTo(map);
        marker.bindPopup(`
          <strong>${i.name}</strong>
          <div style="color:#666;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">${DOMAIN_LABELS[i.domain]} · ${i.city}</div>
          <div style="margin-bottom:8px;">${i.tagline}</div>
          <a href="/initiatives/${i.id}">Open profile →</a>
        `);
      });
    })();

    return () => {
      cancelled = true;
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, [initiatives]);

  return <div id="map" ref={mapEl} />;
}
