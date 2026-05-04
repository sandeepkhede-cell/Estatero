import { api } from './api';
import { Property } from '../types/property';
import { FilterState } from '../types/search';

export interface PropertyListResponse {
  properties: Property[];
  total: number;
  page: number;
  totalPages: number;
}

// Frontend type labels → backend DB values
const PROPERTY_TYPE_MAP: Record<string, string> = {
  Apartment: 'apartment',
  Villa: 'villa',
  Plot: 'plot',
  'Independent House': 'apartment',
};

// '2 BHK' → '2',  '5+ BHK' → '5'
function parseBhk(label: string): string {
  return label.replace(/\D/g, '').slice(0, 1);
}

function buildQuery(filters: Partial<FilterState>, page: number): string {
  const params = new URLSearchParams();
  params.set('page', String(page));

  // Slider 0-100 → rupees. 100 means "no limit" — omit param.
  if (filters.priceRange !== undefined && filters.priceRange < 100) {
    params.set('priceRange', String(filters.priceRange * 1_000_000));
  }

  // Only filter by type when exactly one type is selected
  if (filters.propertyTypes?.length === 1) {
    const mapped = PROPERTY_TYPE_MAP[filters.propertyTypes[0]];
    if (mapped) params.set('propertyType', mapped);
  }

  // BHK — append one param per value so backend receives an array
  filters.bhk?.forEach((b) => params.append('bhk', parseBhk(b)));

  if (filters.city)   params.set('city', filters.city);
  if (filters.status) params.set('status', filters.status);
  if (filters.sortBy) params.set('sortBy', filters.sortBy);

  return params.toString();
}

export const propertyService = {
  getAll: (filters?: Partial<FilterState>, page = 1) =>
    api.get<PropertyListResponse>(`/properties?${buildQuery(filters ?? {}, page)}`),

  getById: (id: string | number) =>
    api.get<Property>(`/properties/${id}`),

  search: (query: string) =>
    api.get<Property[]>(`/properties/search?q=${encodeURIComponent(query)}`),

  getFeatured: () =>
    api.get<Property[]>('/properties/featured'),
};
