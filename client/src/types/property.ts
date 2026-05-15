// ── Domain literals ────────────────────────────────────────────────────────────

export type ListingType     = 'sale' | 'rent' | 'pg';
export type PropertyType    = 'apartment' | 'villa' | 'builder-floor' | 'plot' | 'commercial' | 'penthouse';
export type FurnishingType  = 'unfurnished' | 'semi-furnished' | 'fully-furnished';
export type AvailabilityType = 'ready-to-move' | 'under-construction';

// ── Sub-shapes ─────────────────────────────────────────────────────────────────

export interface PropertyMetaItem {
  icon:  string;
  value: string;
}

export interface PropertySpec {
  label: string;
  value: string;
}

export interface Amenity {
  icon:  string;
  label: string;
}

export interface NearbyPlace {
  icon:     string;
  name:     string;
  distance: string;
}

export interface Agent {
  id:               string | number;
  name:             string;
  role:             'owner' | 'agent' | 'builder' | string;
  tagline?:         string;
  avatar:           string;
  phone?:           string;
  email?:           string;
  totalListings?:   number;
  bio?:             string;
  rating?:          number;
  listingsCount?:   number;
  isVerified?:      boolean;
  responseRate?:    number;
  avgResponseHours?: number;
}

// ── Core entity ────────────────────────────────────────────────────────────────

export interface Property {
  id:              string | number;

  // Pricing — always a raw number; use formatINR() to display
  price:           number;
  pricePerSqft?:   string;   // pre-formatted display string from backend
  emi?:            string;   // pre-formatted display string from backend

  // Listing classification
  listingType?:    ListingType;
  propertyType?:   PropertyType;

  // Core details
  title:           string;
  description:     string;
  location:        string;
  city?:           string;
  locality?:       string;

  // Media
  image:           string;
  images?:         string[];

  // Specs
  bedrooms?:       number;
  bathrooms?:      number;
  areaSqft?:       number;
  area?:           string;   // legacy formatted string ("1,850 sqft")
  floor?:          string;
  facing?:         string;
  ageOfProperty?:  string;

  // Status / flags
  status?:         string;
  listingStatus?:  'active' | 'sold' | 'rented' | 'paused';
  furnishing?:     FurnishingType;
  availability?:   AvailabilityType;
  isVerified?:     boolean;
  isFavourited?:   boolean;
  isFeatured?:     boolean;
  isOwnerDirect?:  boolean;
  isReraRegistered?: boolean;
  reraNumber?:     string;

  // Engagement
  viewCount?:      number;

  // Project (builder)
  projectId?:      number;
  projectName?:    string;

  // Price-drop alert (set when saved)
  priceAtSave?:    number;

  // Display extras
  badge?:          string;
  badgeVariant?:   'primary' | 'secondary';
  meta:            PropertyMetaItem[];

  // Relations
  amenities?:      Amenity[];
  nearbyPlaces?:   NearbyPlace[];
  agent?:          Agent;
}

// ── List / pagination ──────────────────────────────────────────────────────────

export interface PaginatedProperties {
  properties:  Property[];
  total:       number;
  page:        number;
  totalPages:  number;
  limit:       number;
}
