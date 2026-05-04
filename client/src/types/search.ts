export interface SearchParams {
  city: string;
  propertyType: string;
  budget: string;
}

export type SortOption = 'newest' | 'price_asc' | 'price_desc';

export interface FilterState {
  priceRange: number;
  propertyTypes: string[];
  bhk: string[];
  sortBy: SortOption;
  city?: string;
  status?: 'for_sale' | 'for_rent';
}
