// ── DB row shapes (snake_case from PostgreSQL) ──────────────────────────────

export interface PropertyRow {
  id: number;
  title: string;
  description: string | null;
  price: number;
  price_per_sqft: number | null;
  emi: number | null;
  location: string;
  city: string;
  state: string | null;
  latitude: string | null;
  longitude: string | null;
  property_type: string;
  status: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqft: number | null;
  floor: number | null;
  total_floors: number | null;
  facing: string | null;
  badge: string | null;
  badge_variant: string | null;
  is_verified: boolean;
  is_featured: boolean;
  agent_id: number | null;
  created_at: Date;
  updated_at: Date;
  // joined
  images: string[] | null;
  agent_name: string | null;
  agent_role: string | null;
  agent_avatar: string | null;
  agent_phone: string | null;
  amenities: Array<{ icon: string; label: string }> | null;
  nearby_places: Array<{ icon: string; name: string; distance: string }> | null;
}

export interface AgentRow {
  id: number;
  user_id: number;
  agency_name: string | null;
  license_number: string | null;
  bio: string | null;
  profile_image: string | null;
  rating: string;
  listings_count: number;
  name: string;
  phone: string | null;
}

// ── API response shapes (camelCase for frontend) ─────────────────────────────

export interface PropertyMeta {
  icon: string;
  value: string;
}

export interface Amenity {
  icon: string;
  label: string;
}

export interface NearbyPlace {
  icon: string;
  name: string;
  distance: string;
}

export interface AgentDTO {
  id: number;
  name: string;
  role: string;
  avatar: string;
  phone?: string;
}

export interface PropertyDTO {
  id: number;
  title: string;
  description: string;
  price: string;
  pricePerSqft?: string;
  emi?: string;
  location: string;
  image: string;
  images?: string[];
  badge?: string;
  badgeVariant?: 'primary' | 'secondary';
  isVerified: boolean;
  isFavourited?: boolean;
  status: string;
  area?: string;
  floor?: string;
  facing?: string;
  meta: PropertyMeta[];
  amenities?: Amenity[];
  nearbyPlaces?: NearbyPlace[];
  agent?: AgentDTO;
}

export interface PropertyListResponse {
  properties: PropertyDTO[];
  total: number;
  page: number;
  totalPages: number;
}

export interface LocationSuggestion {
  label: string;
  type: 'city' | 'locality' | 'landmark';
}

// ── Query filter shape ───────────────────────────────────────────────────────

export interface PropertyFilters {
  city?: string;
  propertyType?: string;
  status?: string;
  bhk?: string | string[];
  priceRange?: number;        // max price
  sortBy?: 'newest' | 'price_asc' | 'price_desc';
  q?: string;
  page?: number;
  limit?: number;
}
