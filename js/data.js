// Shared data loader. Caches once per page load.
const DataStore = {
  _cache: {},
  async load(name) {
    if (this._cache[name]) return this._cache[name];
    const res = await fetch(`/data/${name}.json`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Failed to load ${name}.json`);
    const json = await res.json();
    this._cache[name] = json;
    return json;
  },
  initiatives() { return this.load('initiatives').then(d => d.initiatives); },
  metrics() { return this.load('metrics'); },
};

const DOMAIN_LABELS = {
  'oral-traditions': 'Oral Traditions',
  'performing-arts': 'Performing Arts',
  'social-practices': 'Social Practices',
  'knowledge-of-nature': 'Nature & Universe',
  'craftsmanship': 'Craftsmanship',
  'food': 'Foodways',
};

const DOMAIN_COLORS = {
  'oral-traditions': '#c5572f',
  'performing-arts': '#d4a017',
  'social-practices': '#2f6b5e',
  'knowledge-of-nature': '#4a6fa5',
  'craftsmanship': '#8a3a3a',
  'food': '#6b8a3a',
};

function fmtNum(n) {
  if (n === null || n === undefined) return '—';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(n);
}

function highlightActiveNav() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('nav.site-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (href !== '/' && path.endsWith(href))) {
      a.classList.add('active');
    }
  });
}
document.addEventListener('DOMContentLoaded', highlightActiveNav);
