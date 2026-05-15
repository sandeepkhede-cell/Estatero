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
  property_type:   string;
  status:          string;
  bedrooms:        number | null;
  bathrooms:       number | null;
  area_sqft:       number | null;
  floor:           number | null;
  total_floors:    number | null;
  facing:          string | null;
  furnishing:      string | null;
  availability:    string | null;
  age_of_property: string | null;
  rera_registered: boolean;
  rera_number:     string | null;
  badge:           string | null;
  badge_variant:   string | null;
  is_verified:     boolean;
  is_featured:     boolean;
  is_owner_direct: boolean;
  listing_status:  string;
  view_count:      number;
  agent_id:        number | null;
  project_id:      number | null;
  created_at: Date;
  updated_at: Date;
  // joined
  images: string[] | null;
  agent_name:        string | null;
  agent_role:        string | null;
  agent_bio:         string | null;
  agent_avatar:      string | null;
  agent_phone:       string | null;
  agent_is_verified: boolean | null;
  project_name:      string | null;
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
  is_verified: boolean;
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
  id:              number;
  name:            string;
  role:            string;
  tagline?:        string;
  avatar:          string;
  phone?:          string;
  bio?:            string;
  rating?:         number;
  listingsCount?:  number;
  isVerified?:     boolean;
  responseRate?:   number;
  avgResponseHours?: number;
}

export interface PropertyDTO {
  id:              number;
  title:           string;
  description:     string;
  price:           number;
  pricePerSqft?:   string;
  emi?:            string;
  location:        string;
  image:           string;
  images?:         string[];
  badge?:          string;
  badgeVariant?:   'primary' | 'secondary';
  isVerified:      boolean;
  isFavourited?:   boolean;
  isOwnerDirect?:  boolean;
  // listing kind + lifecycle
  listingType:     string;
  listingStatus:   string;
  // property detail
  area?:           string;
  floor?:          string;
  facing?:         string;
  furnishing?:     string;
  availability?:   string;
  ageOfProperty?:  string;
  isReraRegistered: boolean;
  reraNumber?:     string;
  viewCount:       number;
  // project (builder)
  projectId?:      number;
  projectName?:    string;
  meta:            PropertyMeta[];
  amenities?:      Amenity[];
  nearbyPlaces?:   NearbyPlace[];
  agent?:          AgentDTO;
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
  city?:          string;
  propertyType?:  string | string[];
  status?:        string;
  bhk?:           string | string[];
  priceMin?:      number;
  priceRange?:    number;
  amenities?:     string[];
  furnishing?:    string | string[];
  availability?:  string;
  ageOfProperty?: string;
  postedBy?:      string;
  ownerDirect?:   boolean;
  reraOnly?:      boolean;
  sortBy?:        'newest' | 'price_asc' | 'price_desc';
  q?:             string;
  page?:          number;
  limit?:         number;
}
