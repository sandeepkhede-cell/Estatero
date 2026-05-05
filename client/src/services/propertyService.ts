import { api } from './api';
import { Property } from '../types/property';
import { FilterState } from '../types/search';

export interface PropertyListResponse {
  properties: Property[];
  total: number;
  page: number;
  totalPages: number;
}

// Display labels AND DB values → DB values
const PROPERTY_TYPE_MAP: Record<string, string> = {
  'Apartment':         'apartment',
  'Independent House': 'apartment',
  'Villa':             'villa',
  'Plot':              'plot',
  'Commercial':        'commercial',
  'Builder Floor':     'builder_floor',
  'Penthouse':         'penthouse',
  // pass-through for DB values coming from URL (?pt=commercial)
  'apartment':         'apartment',
  'villa':             'villa',
  'plot':              'plot',
  'commercial':        'commercial',
  'builder_floor':     'builder_floor',
  'penthouse':         'penthouse',
  'pg':                'pg',
};

// '2 BHK' → '2',  '5+ BHK' → '5'
function parseBhk(label: string): string {
  return label.replace(/\D/g, '').slice(0, 1);
}

function buildQuery(filters: Partial<FilterState>): string {
  const params = new URLSearchParams();
  params.set('page', String(filters.page ?? 1));

  // maxPrice takes priority over the 0-100 slider value
  if (filters.maxPrice) {
    params.set('priceRange', String(filters.maxPrice));
  } else if (filters.priceRange !== undefined && filters.priceRange < 100) {
    params.set('priceRange', String(filters.priceRange * 1_000_000));
  }

  // Property types — support multi-select, map display names → DB values
  if (filters.propertyTypes?.length) {
    filters.propertyTypes
      .map((t) => PROPERTY_TYPE_MAP[t])
      .filter(Boolean)
      .forEach((v) => params.append('propertyType', v));
  }

  // BHK — append one param per value so backend receives an array
  filters.bhk?.forEach((b) => params.append('bhk', parseBhk(b)));

  if (filters.city)         params.set('city', filters.city);
  if (filters.status)       params.set('status', filters.status);
  if (filters.sortBy)       params.set('sortBy', filters.sortBy);
  if (filters.limit)        params.set('limit', String(filters.limit));
  if (filters.availability) params.set('availability', filters.availability);
  if (filters.ageOfProperty) params.set('ageOfProperty', filters.ageOfProperty);

  // Furnishing — multi-value array
  filters.furnishing?.forEach((f) => params.append('furnishing', f));

  return params.toString();
}

export const propertyService = {
  getAll: (filters?: Partial<FilterState>) =>
    api.get<PropertyListResponse>(`/properties?${buildQuery(filters ?? {})}`),

  getById: (id: string | number) =>
    api.get<Property>(`/properties/${id}`),

  search: (query: string) =>
    api.get<Property[]>(`/properties/search?q=${encodeURIComponent(query)}`),

  getFeatured: () =>
    api.get<Property[]>('/properties/featured'),

  create: (body: Record<string, unknown>) =>
    api.post<Property>('/properties', body),
};
