(async () => {
  const { repair_impact: ri } = await DataStore.metrics();

  document.getElementById('m-items').textContent = fmtNum(ri.items_repaired_total);
  document.getElementById('m-co2').textContent = ri.co2_avoided_t_total.toFixed(1);
  document.getElementById('m-mat').textContent = fmtNum(ri.materials_diverted_kg_total);
  document.getElementById('m-people').textContent = fmtNum(ri.people_engaged_total);
})();
