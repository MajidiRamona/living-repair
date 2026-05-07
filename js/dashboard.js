(async () => {
  const { repair_impact: ri } = await DataStore.metrics();
  const initiatives = await DataStore.initiatives();

  // KPIs
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


  // Bubble: CO2 vs people reached
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

})();
