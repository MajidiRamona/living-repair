export const DOMAIN_LABELS: Record<string, string> = {
  'oral-traditions': 'Oral Traditions',
  'performing-arts': 'Performing Arts',
  'social-practices': 'Social Practices',
  'knowledge-of-nature': 'Nature & Universe',
  craftsmanship: 'Craftsmanship',
  food: 'Foodways',
};

export const DOMAIN_COLORS: Record<string, string> = {
  'oral-traditions': '#c5572f',
  'performing-arts': '#d4a017',
  'social-practices': '#2f6b5e',
  'knowledge-of-nature': '#4a6fa5',
  craftsmanship: '#8a3a3a',
  food: '#6b8a3a',
};

export const SECTOR_LABELS: Record<string, string> = {
  textile: 'Textile',
  furniture: 'Furniture',
  electronics: 'Electronics',
  other: 'Other',
};

export function fmtNum(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(n);
}
