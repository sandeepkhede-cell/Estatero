import type { FilterState, SortOption } from '../types/search';
import type { FurnishingType, AvailabilityType } from '../types/property';

// ── Defaults ──────────────────────────────────────────────────────────────────

export const DEFAULT_FILTERS: FilterState = {
  priceRange:    100,
  propertyTypes: [],
  bhk:           [],
  sortBy:        'newest',
};

// ── FilterState → URLSearchParams ─────────────────────────────────────────────

export function filtersToParams(filters: FilterState): URLSearchParams {
  const p = new URLSearchParams();

  if (filters.city)   p.set('city', filters.city);
  if (filters.status) p.set('type', filters.status);

  filters.locality?.forEach((l) => p.append('locality', l));
  filters.propertyTypes?.forEach((t) => p.append('pt', t));
  filters.bhk?.forEach((b) => p.append('bhk', b));

  if (filters.priceRange !== undefined && filters.priceRange < 100)
    p.set('priceRange', String(filters.priceRange));
  if (filters.minPrice) p.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice) p.set('maxPrice', String(filters.maxPrice));
  if (filters.minArea)  p.set('minArea',  String(filters.minArea));
  if (filters.maxArea)  p.set('maxArea',  String(filters.maxArea));

  if (filters.sortBy && filters.sortBy !== 'newest') p.set('sort', filters.sortBy);

  filters.furnishing?.forEach((f) => p.append('furnishing', f));
  if (filters.availability)  p.set('availability',  filters.availability);
  if (filters.ageOfProperty) p.set('age',           filters.ageOfProperty);
  filters.amenities?.forEach((a) => p.append('amenity', a));
  if (filters.postedBy) p.set('postedBy', filters.postedBy);

  if (filters.page && filters.page > 1) p.set('page', String(filters.page));

  return p;
}

// ── URLSearchParams → Partial<FilterState> ────────────────────────────────────

const SORT_OPTIONS = new Set<SortOption>(['newest', 'price_asc', 'price_desc']);
const STATUS_OPTIONS = new Set(['for_sale', 'for_rent', 'pg'] as const);
const FURNISHING_OPTIONS = new Set<FurnishingType>([
  'unfurnished', 'semi-furnished', 'fully-furnished',
]);

export function paramsToFilters(params: URLSearchParams): Partial<FilterState> {
  const out: Partial<FilterState> = {};

  const city = params.get('city');
  if (city) out.city = city;

  const type = params.get('type');
  if (type && STATUS_OPTIONS.has(type as FilterState['status']!))
    out.status = type as FilterState['status'];

  const locality = params.getAll('locality');
  if (locality.length) out.locality = locality;

  const pt = params.getAll('pt');
  if (pt.length) out.propertyTypes = pt;

  const bhk = params.getAll('bhk');
  if (bhk.length) out.bhk = bhk;

  const priceRange = params.get('priceRange');
  if (priceRange !== null) out.priceRange = Number(priceRange);

  const minPrice = params.get('minPrice');
  if (minPrice !== null) out.minPrice = Number(minPrice);

  const maxPrice = params.get('maxPrice');
  if (maxPrice !== null) out.maxPrice = Number(maxPrice);

  const minArea = params.get('minArea');
  if (minArea !== null) out.minArea = Number(minArea);

  const maxArea = params.get('maxArea');
  if (maxArea !== null) out.maxArea = Number(maxArea);

  const sort = params.get('sort');
  if (sort && SORT_OPTIONS.has(sort as SortOption)) out.sortBy = sort as SortOption;

  const furnishing = params.getAll('furnishing').filter(
    (f): f is FurnishingType => FURNISHING_OPTIONS.has(f as FurnishingType),
  );
  if (furnishing.length) out.furnishing = furnishing;

  const availability = params.get('availability');
  if (availability === 'ready-to-move' || availability === 'under-construction')
    out.availability = availability as AvailabilityType;

  const age = params.get('age');
  if (age) out.ageOfProperty = age;

  const amenities = params.getAll('amenity');
  if (amenities.length) out.amenities = amenities;

  const postedBy = params.get('postedBy');
  if (postedBy === 'owner' || postedBy === 'agent' || postedBy === 'builder')
    out.postedBy = postedBy;

  const page = params.get('page');
  if (page !== null) out.page = Math.max(1, Number(page));

  return out;
}

// ── Hero search → URLSearchParams (used by HomePage) ─────────────────────────

const HERO_PROPERTY_TYPE: Record<string, string> = {
  'Flat/Apartment':    'Apartment',
  'Independent House': 'Independent House',
  'Plot/Land':         'Plot',
  'Villa':             'Villa',
  'Builder Floor':     'Builder Floor',
  'Office Space':      'Commercial',
  'Shop/Showroom':     'Commercial',
  'Warehouse':         'Commercial',
  'Commercial Land':   'Commercial',
  // PG/Co-living is handled by listingType=pg — no pt needed
};

// priceRange slider units (0-100) corresponding to budget labels
const HERO_BUDGET: Record<string, number> = {
  '₹50L - ₹1Cr': 10,
  '₹1Cr - ₹2Cr': 20,
  '₹2Cr+':        50,
};

export function heroToParams(params: {
  city:          string;
  propertyType:  string;
  budget:        string;
  listingType?:  string;
}): URLSearchParams {
  const p = new URLSearchParams();

  if (params.city.trim()) {
    const inMatch = params.city.match(/\bin\s+([A-Za-z\s]+)$/i);
    const city = inMatch ? inMatch[1].trim() : params.city.trim();
    p.set('city', city);

    const bhkMatch = params.city.match(/(\d)\s*bhk/i);
    if (bhkMatch) p.append('bhk', `${bhkMatch[1]} BHK`);

    if (!inMatch) {
      if (/flat|apartment/i.test(params.city)) p.append('pt', 'Apartment');
      else if (/villa/i.test(params.city))      p.append('pt', 'Villa');
      else if (/plot|land/i.test(params.city))  p.append('pt', 'Plot');
    }
  }

  if (params.propertyType) {
    const mapped = HERO_PROPERTY_TYPE[params.propertyType];
    if (mapped) { p.delete('pt'); p.append('pt', mapped); }
  }

  if (params.budget && params.budget !== 'Any Budget') {
    const range = HERO_BUDGET[params.budget];
    if (range !== undefined) p.set('priceRange', String(range));
  }

  if (params.listingType) p.set('type', params.listingType);

  return p;
}
