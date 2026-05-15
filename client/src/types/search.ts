import type { FurnishingType, AvailabilityType } from './property';

export interface SearchParams {
  city:         string;
  propertyType: string;
  budget:       string;
  listingType?: string;   // 'for_sale' | 'for_rent' | 'pg'
}

export type SortOption = 'newest' | 'price_asc' | 'price_desc';

export interface FilterState {
  // Location
  city?:          string;
  locality?:      string[];

  // Listing kind
  status?:        'for_sale' | 'for_rent' | 'pg';
  propertyTypes?: string[];
  bhk?:           string[];

  // Price
  priceRange?:    number;   // max price (legacy scalar — kept for backend compat)
  minPrice?:      number;
  maxPrice?:      number;

  // Size
  minArea?:       number;
  maxArea?:       number;

  // Property attributes
  furnishing?:    FurnishingType[];
  availability?:  AvailabilityType;
  ageOfProperty?: string;
  amenities?:     string[];

  // Posted by
  postedBy?:      'owner' | 'agent' | 'builder';
  ownerDirect?:   boolean;
  reraOnly?:      boolean;

  // Sorting & pagination
  sortBy?:        SortOption;
  page?:          number;
  limit?:         number;
}
