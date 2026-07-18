export type Option = { value: string; label: string };

export const REPAIR_CATEGORIES: Option[] = [
  { value: 'textiles', label: 'Textiles' },
  { value: 'wood_furniture', label: 'Wood and furniture' },
  { value: 'leather', label: 'Leather' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'household_appliances', label: 'Household appliances' },
  { value: 'bicycles', label: 'Bicycles' },
  { value: 'sports_equipment', label: 'Sports equipment' },
  { value: 'toys', label: 'Toys' },
  { value: 'jewellery', label: 'Jewellery' },
  { value: 'watches', label: 'Watches' },
  { value: 'ceramics', label: 'Ceramics' },
  { value: 'mixed_general', label: 'Mixed / General repair' },
  { value: 'other', label: 'Other (please specify)' },
];

export const ORG_TYPES: Option[] = [
  { value: 'community_group', label: 'Community group / informal collective' },
  { value: 'ngo', label: 'Civil society organization / NGO' },
  { value: 'repair_cafe', label: 'Repair café' },
  { value: 'cooperative', label: 'Cooperative' },
  { value: 'small_enterprise', label: 'Small enterprise' },
  { value: 'social_enterprise', label: 'Social enterprise' },
  { value: 'business', label: 'Business' },
  { value: 'educational_institution', label: 'Educational institution' },
  { value: 'public_institution', label: 'Public institution' },
  { value: 'government_programme', label: 'Government programme' },
  { value: 'other', label: 'Other (please specify)' },
];

export const ACTIVITIES: Option[] = [
  { value: 'repair_services', label: 'Repair services' },
  { value: 'repair_workshops', label: 'Repair workshops' },
  { value: 'training_courses', label: 'Training courses' },
  { value: 'apprenticeships', label: 'Apprenticeships' },
  { value: 'community_events', label: 'Community events' },
  { value: 'repair_cafes', label: 'Repair cafés' },
  { value: 'upcycling', label: 'Upcycling' },
  { value: 'advocacy', label: 'Advocacy' },
  { value: 'research', label: 'Research' },
  { value: 'documentation', label: 'Documentation' },
  { value: 'other', label: 'Other' },
];

export const NEEDS: Option[] = [
  { value: 'workspace', label: 'Workspace' },
  { value: 'funding', label: 'Funding' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'volunteers', label: 'Volunteers' },
  { value: 'training', label: 'Training' },
  { value: 'communication', label: 'Communication' },
  { value: 'networking', label: 'Networking' },
  { value: 'policy_support', label: 'Policy support' },
  { value: 'other', label: 'Other (specify)' },
];

export const AUDIENCE: Option[] = [
  { value: 'general_public', label: 'General public' },
  { value: 'children', label: 'Children' },
  { value: 'young_people', label: 'Young people' },
  { value: 'older_adults', label: 'Older adults' },
  { value: 'professionals', label: 'Professionals' },
  { value: 'students', label: 'Students' },
  { value: 'migrants', label: 'Migrants' },
  { value: 'vulnerable_situations', label: 'People in vulnerable situations' },
  { value: 'everyone', label: 'Everyone' },
];

export const REPAIR_SECTORS: Option[] = [
  { value: 'textile', label: 'Textile' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'other', label: 'Other' },
];

export const DOMAINS: Option[] = [
  { value: 'oral-traditions', label: 'Oral Traditions' },
  { value: 'performing-arts', label: 'Performing Arts' },
  { value: 'social-practices', label: 'Social Practices' },
  { value: 'knowledge-of-nature', label: 'Nature & Universe' },
  { value: 'craftsmanship', label: 'Craftsmanship' },
  { value: 'food', label: 'Foodways' },
];

// Suggests a repair_sector (the 4-value taxonomy that drives filter chips)
// from the richer repairCategories a submitter picked, for the admin to confirm/override.
export function suggestRepairSector(repairCategories: string[]): string {
  if (repairCategories.includes('textiles') || repairCategories.includes('leather')) return 'textile';
  if (repairCategories.includes('wood_furniture')) return 'furniture';
  if (repairCategories.includes('electronics') || repairCategories.includes('household_appliances')) return 'electronics';
  return 'other';
}

function labelFor(options: Option[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

export function labelsFor(options: Option[], values: string[]): string[] {
  return values.map((v) => labelFor(options, v));
}
