(async () => {
  const { repair_impact: ri } = await DataStore.metrics();
  const initiatives = await DataStore.initiatives();

  document.getElementById('m-items').textContent = fmtNum(ri.items_repaired_total);
  document.getElementById('m-co2').textContent = ri.co2_avoided_t_total.toFixed(1);
  document.getElementById('m-mat').textContent = fmtNum(ri.materials_diverted_kg_total);
  document.getElementById('m-people').textContent = fmtNum(ri.people_engaged_total);

  const SECTORS = ['textile', 'furniture', 'electronics', 'other'];
  const SECTOR_LABELS = { textile: 'Textile', furniture: 'Furniture', electronics: 'Electronics', other: 'Other' };

  const counts = Object.fromEntries(SECTORS.map(s => [s, 0]));
  initiatives.forEach(i => { if (counts[i.repair_sector] !== undefined) counts[i.repair_sector]++; });

  document.getElementById('sector-grid').innerHTML = SECTORS.map(s => `
    <div style="border: 1px solid var(--ink); padding: 24px 20px;">
      <div style="font-family: 'Fraunces', serif; font-size: 2rem; font-weight: 500;">${counts[s]}</div>
      <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--ink-2); margin-top: 6px;">${SECTOR_LABELS[s]}</div>
    </div>
  `).join('');
})();
