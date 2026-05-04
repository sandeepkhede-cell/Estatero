export interface PropertyMetaItem {
  icon: string;
  value: string;
}

export interface PropertySpec {
  label: string;
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

export interface Agent {
  id: string | number;
  name: string;
  role: string;
  avatar: string;
  phone?: string;
}

export interface Property {
  id: string | number;
  price: string;
  title: string;
  description: string;
  location: string;
  image: string;
  images?: string[];
  badge?: string;
  badgeVariant?: 'primary' | 'secondary';
  isVerified?: boolean;
  isFavourited?: boolean;
  meta: PropertyMetaItem[];
  // enriched fields (prototype 1)
  emi?: string;
  area?: string;
  status?: string;
  floor?: string;
  pricePerSqft?: string;
  facing?: string;
  amenities?: Amenity[];
  nearbyPlaces?: NearbyPlace[];
  agent?: Agent;
}
