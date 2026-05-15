export interface PostPropertyForm {
  // Step 1 — Type
  propertyType: string;
  listingType:  'for_sale' | 'for_rent' | 'pg';

  // Step 2 — Location
  city:     string;
  state:    string;
  location: string;

  // Step 3 — Details
  bedrooms:        string;
  bathrooms:       string;
  area_sqft:       string;
  floor:           string;
  total_floors:    string;
  furnishing:      string;
  availability:    string;
  age_of_property: string;
  facing:          string;

  // Step 4 — Pricing
  price:           string;
  price_per_sqft:  string;
  emi:             string;
  rera_registered: boolean;
  rera_number:     string;
  is_owner_direct: boolean;

  // Step 5 — Amenities
  amenities: string[];

  // Step 6 — Photos
  imageUrls: string[];

  // Step 7 — Review
  title:       string;
  description: string;

  // Builder — Project link (optional)
  projectId?:   number;
  projectName?: string;
}

export const EMPTY_FORM: PostPropertyForm = {
  propertyType: '',
  listingType:  'for_sale',
  city:         '',
  state:        '',
  location:     '',
  bedrooms:     '',
  bathrooms:    '',
  area_sqft:    '',
  floor:        '',
  total_floors: '',
  furnishing:   '',
  availability: '',
  age_of_property: '',
  facing:       '',
  price:        '',
  price_per_sqft: '',
  emi:          '',
  rera_registered: false,
  rera_number:  '',
  is_owner_direct: false,
  amenities:    [],
  imageUrls:    [],
  title:        '',
  description:  '',
  projectId:    undefined,
  projectName:  undefined,
};

export const STEPS = [
  'Property Type',
  'Location',
  'Details',
  'Pricing',
  'Amenities',
  'Photos',
  'Review',
] as const;

export type StepKey = typeof STEPS[number];

export function generateTitle(form: PostPropertyForm): string {
  const parts: string[] = [];
  if (form.bedrooms) parts.push(`${form.bedrooms} BHK`);
  if (form.propertyType) parts.push(
    form.propertyType.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
  );
  if (form.location) parts.push(`in ${form.location}`);
  else if (form.city) parts.push(`in ${form.city}`);
  return parts.join(' ');
}
