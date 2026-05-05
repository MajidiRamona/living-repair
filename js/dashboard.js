(async () => {
  const metrics = await DataStore.metrics();
  const initiatives = await DataStore.initiatives();

  // KPIs
  const ri = metrics.repair_impact;
  document.getElementById('m-items').textContent = fmtNum(ri.items_repaired_total);
  document.getElementById('m-co2').textContent = ri.co2_avoided_t_total.toFixed(1);
  document.getElementById('m-mat').textContent = fmtNum(ri.materials_diverted_kg_total);
  document.getElementById('m-people').textContent = fmtNum(ri.people_engaged_total);

  // Chart.js global tweaks
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.color = '#444';
  Chart.defaults.borderColor = '#1a1a1a22';

  const ink = '#1a1a1a';
  const accent = '#c5572f';
  const accent2 = '#2f6b5e';
  const accent3 = '#d4a017';


  // 3. SDG coverage (bar)
  const sdg = metrics.sdg_coverage;
  const cSdg = new Chart(document.getElementById('chart-sdg'), {
    type: 'bar',
    data: {
      labels: sdg.map(s => `SDG ${s.sdg} · ${s.label}`),
      datasets: [{
        label: 'Elements addressing this SDG',
        data: sdg.map(s => s.elements),
        backgroundColor: sdg.map(s => s.sdg === 13 ? accent : (s.sdg === 11 || s.sdg === 12 ? accent3 : accent2)),
        borderColor: ink,
        borderWidth: 1,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, grid: { color: '#1a1a1a11' } },
        y: { grid: { display: false }, ticks: { font: { size: 11 } } }
      }
    }
  });

  // 4. Bubble: CO2 vs people reached
  function buildBubble(filtered) {
    return {
      datasets: filtered.map(i => ({
        label: i.name,
        data: [{
          x: i.people_reached || 0,
          y: i.co2_saved_t || 0,
          r: Math.max(6, Math.sqrt((i.items_repaired || i.weavers_active || i.households_practicing || 100)) * 1.5)
        }],
        backgroundColor: (DOMAIN_COLORS[i.domain] || ink) + 'cc',
        borderColor: ink,
        borderWidth: 1,
      }))
    };
  }

  const bubbleCtx = document.getElementById('chart-bubble');
  const cBubble = new Chart(bubbleCtx, {
    type: 'bubble',
    data: buildBubble(initiatives),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: c => {
              const i = initiatives.find(x => x.name === c.dataset.label);
              return `${i.name} · ${fmtNum(i.people_reached)} reached · ${i.co2_saved_t}t CO₂`;
            }
          }
        }
      },
      scales: {
        x: {
          type: 'logarithmic',
          title: { display: true, text: 'People reached (log scale)' },
          grid: { color: '#1a1a1a11' }
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: 'CO₂ avoided (tonnes)' },
          grid: { color: '#1a1a1a11' }
        }
      }
    }
  });

  // Filter behavior
  document.querySelectorAll('.chip[data-domain]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip[data-domain]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const d = chip.dataset.domain;
      const filtered = d === 'all' ? initiatives : initiatives.filter(i => i.domain === d);
      cBubble.data = buildBubble(filtered);
      cBubble.update();
    });
  });
})();
