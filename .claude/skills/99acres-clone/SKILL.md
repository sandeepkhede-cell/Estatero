# Skill: 99acres-clone

## Purpose
Replicate the full 99acres.com product — pages, components, layouts, interactions, and data — pixel-faithfully using React + Vite + TypeScript + Tailwind CSS.

## When to Use
- Building any page or section that mirrors 99acres.com's UI
- Deciding what a component should look like before designing it
- Understanding what features/flows to implement next
- Keeping color palette, spacing, and typography consistent with 99acres

---

## Brand & Design System

### Color Palette
```ts
// tailwind.config.ts — extend colors
colors: {
  brand: {
    red:       '#d9232d',   // primary CTA, active tabs, highlights
    'red-dark':'#b71c24',   // hover state
    orange:    '#f47920',   // badges, "Hot", "New" tags
    yellow:    '#f5a623',   // star ratings
  },
  surface: {
    white:     '#ffffff',
    offwhite:  '#f7f7f7',   // page background
    card:      '#ffffff',
    border:    '#e0e0e0',
  },
  text: {
    primary:   '#212121',
    secondary: '#666666',
    muted:     '#999999',
    link:      '#d9232d',
  },
}
```

### Typography
| Role | Classes |
|---|---|
| Page heading | `text-2xl font-bold text-gray-900` |
| Section heading | `text-xl font-semibold text-gray-800` |
| Card title | `text-base font-semibold text-gray-900` |
| Price | `text-lg font-bold text-gray-900` |
| Label / meta | `text-sm text-gray-500` |
| CTA button | `text-sm font-semibold` |

### Spacing & Radius
- Page max-width: `max-w-7xl mx-auto px-4`
- Card radius: `rounded-lg`
- Input radius: `rounded-md`
- Button radius: `rounded-md`
- Section gap: `py-10` or `py-14`

---

## Site Map — Pages to Build

| Route | Page | Priority |
|---|---|---|
| `/` | HomePage | P0 |
| `/search` | SearchListingPage | P0 |
| `/property/:id` | PropertyDetailPage | P0 |
| `/post-property` | PostPropertyPage | P1 |
| `/login` | LoginPage (modal) | P1 |
| `/profile` | ProfilePage | P2 |
| `/profile/saved` | SavedPropertiesPage | P2 |
| `/agent/:id` | AgentProfilePage | P2 |

---

## Page Blueprints

### 1. HomePage (`/`)

#### Layout (top to bottom)
```
<Navbar />                        ← sticky, height 60px
<HeroSection />                   ← search bar + tab switcher
<FeaturedProperties />            ← horizontal scroll cards
<PopularCities />                 ← city grid with images
<PropertyInsights />              ← editorial cards / articles
<Footer />
```

#### HeroSection
- Background: dark overlay on a cityscape image
- Tabs: `Buy | Rent | PG / Co-living | Plot | Commercial`
- Active tab underline: `border-b-2 border-brand-red`
- Search bar: city dropdown + keyword input + Search button (brand red)
- Trending searches: chips below input

```tsx
const TABS = ['Buy', 'Rent', 'PG / Co-living', 'Plot', 'Commercial'] as const;
type Tab = typeof TABS[number];
```

#### FeaturedProperties
- Heading: "Featured Properties"
- Horizontal scrollable row of `PropertyCard` components
- Arrow navigation buttons (left/right) overlaid on edges

#### PopularCities
- Grid: 3 cols mobile → 6 cols desktop
- Each cell: city image + city name overlay
- Cities: Mumbai, Delhi, Bengaluru, Hyderabad, Pune, Chennai, Kolkata, Noida

---

### 2. SearchListingPage (`/search`)

#### Layout
```
<Navbar />
<SearchFilterBar />               ← sticky below navbar
<div className="flex">
  <FilterSidebar />               ← w-72, sticky, left panel
  <main>
    <ResultsHeader />             ← "2,341 properties in Mumbai"
    <SortBar />                   ← Sort by: Relevance | Price | Date
    <PropertyList />              ← list of PropertyCard items
    <Pagination />
  </main>
</div>
```

#### SearchFilterBar (sticky top-[60px])
Quick filters rendered as pill buttons:
- Property Type (Apartment / Villa / Plot / Commercial)
- Budget (range picker)
- BHK (1 / 2 / 3 / 4 / 5+)
- Posted By (Owner / Agent / Builder)
- More Filters (opens sidebar / modal)

#### FilterSidebar
Sections (each collapsible with chevron):
1. **Budget** — dual-handle range slider (min/max price)
2. **Bedrooms & Bathrooms** — checkbox group
3. **Property Type** — checkbox group
4. **Locality** — searchable multi-select tags
5. **Area (sq.ft)** — dual range slider
6. **Amenities** — checkboxes (Gym, Pool, Parking, etc.)
7. **Posted By** — radio (Owner / Agent / Builder)
8. **Age of Property** — radio buttons
9. **Availability** — Under Construction / Ready to Move

#### PropertyCard (list view variant)
```
┌────────────────────────────────────────────────────────────┐
│ [Image 260×180]  │ Title                         [Save ♡]  │
│                  │ ₹1.2 Cr  ·  ₹8,333/sq.ft               │
│  [RERA tag]      │ 3 BHK  ·  1,440 sq.ft  ·  Floor 7/12   │
│                  │ Locality, City                           │
│                  │ [Amenity chips]                          │
│                  │ [Contact Owner]  [View Number]           │
└────────────────────────────────────────────────────────────┘
```

---

### 3. PropertyDetailPage (`/property/:id`)

#### Layout
```
<Navbar />
<Breadcrumb />                    ← Home > Mumbai > Bandra > Property
<div className="flex gap-6 max-w-7xl mx-auto px-4">
  <div className="flex-1">
    <ImageGallery />
    <PropertyOverview />
    <KeyDetails />
    <Description />
    <AmenitiesGrid />
    <LocalityMap />
    <SimilarProperties />
  </div>
  <aside className="w-80 shrink-0">
    <ContactCard />               ← sticky top-[80px]
  </aside>
</div>
<Footer />
```

#### ImageGallery
- Main large image (aspect-ratio 16/9)
- Thumbnail strip below (4 thumbnails + "View all X photos")
- Lightbox on click (full-screen with prev/next navigation)

#### PropertyOverview
```tsx
// price + key stats in one row
<div className="flex items-center justify-between">
  <div>
    <p className="text-3xl font-bold text-gray-900">₹{formatPrice(price)}</p>
    <p className="text-sm text-gray-500">₹{pricePerSqft}/sq.ft</p>
  </div>
  <div className="flex gap-6 text-center">
    <Stat label="Bedrooms" value={bedrooms} />
    <Stat label="Bathrooms" value={bathrooms} />
    <Stat label="Area" value={`${area} sq.ft`} />
  </div>
</div>
```

#### KeyDetails (table grid)
| Field | Field | Field |
|---|---|---|
| Property Type | Apartment | Floor | 7 of 12 |
| Furnishing | Semi-furnished | Facing | East |
| Age | 5-10 years | Overlooking | Garden |
| Total Floors | 12 | Parking | 1 Covered |

```tsx
<dl className="grid grid-cols-2 md:grid-cols-3 gap-4">
  {details.map(({ label, value }) => (
    <div key={label} className="flex flex-col gap-0.5">
      <dt className="text-xs text-gray-500 uppercase tracking-wide">{label}</dt>
      <dd className="text-sm font-medium text-gray-900">{value}</dd>
    </div>
  ))}
</dl>
```

#### ContactCard (sticky aside)
```tsx
// Sticky contact widget
<div className="sticky top-20 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
  <div className="flex items-center gap-3 mb-4">
    <img src={agent.avatar} className="w-12 h-12 rounded-full" />
    <div>
      <p className="font-semibold">{agent.name}</p>
      <p className="text-xs text-gray-500">{agent.role}</p>
    </div>
  </div>
  <button className="w-full bg-brand-red text-white py-2.5 rounded-md font-semibold mb-2">
    Contact Owner
  </button>
  <button className="w-full border border-brand-red text-brand-red py-2.5 rounded-md font-semibold">
    View Phone Number
  </button>
</div>
```

---

### 4. PostPropertyPage (`/post-property`) — Multi-step form

#### Steps
```
Step 1: Property Type
  → [ Residential | Commercial | Plot/Land ]
  → Sub-type: Apartment / Villa / Builder Floor / Penthouse ...
  → Purpose: Sale | Rent | PG

Step 2: Location
  → City (searchable dropdown)
  → Locality (auto-suggest from city)
  → Address / Landmark

Step 3: Property Details
  → Bedrooms (1 / 2 / 3 / 4 / 4+)
  → Bathrooms
  → Total Area (sq.ft / sq.m toggle)
  → Furnishing (Unfurnished / Semi / Fully)
  → Floor / Total Floors
  → Availability

Step 4: Pricing
  → Price (number input with ₹ prefix)
  → Price includes (Maintenance / Brokerage / etc.)

Step 5: Amenities
  → Checkbox grid (Lift, Parking, Gym, Pool, Security, etc.)

Step 6: Photos
  → Drag-and-drop upload zone
  → Up to 15 photos
  → Reorderable thumbnails

Step 7: Review & Publish
```

#### Progress indicator
```tsx
<div className="flex items-center gap-0">
  {STEPS.map((step, i) => (
    <Fragment key={step}>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
        ${i <= currentStep ? 'bg-brand-red text-white' : 'bg-gray-200 text-gray-500'}`}>
        {i < currentStep ? <CheckIcon /> : i + 1}
      </div>
      {i < STEPS.length - 1 && (
        <div className={`h-0.5 flex-1 ${i < currentStep ? 'bg-brand-red' : 'bg-gray-200'}`} />
      )}
    </Fragment>
  ))}
</div>
```

---

## Shared Components Inventory

### Navbar
```
Logo | City Selector | [Buy Rent PG] | Login/Register | Post Free Property (CTA)
```
- Sticky: `sticky top-0 z-40 bg-white shadow-sm`
- Height: `h-[60px]`
- City selector: dropdown with popular cities
- "Post Free Property" button: `bg-brand-red text-white px-4 py-1.5 rounded`

### PropertyCard (grid/card variant)
```tsx
interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  pricePerSqft?: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  locality: string;
  city: string;
  type: 'sale' | 'rent';
  propertyType: 'apartment' | 'villa' | 'plot' | 'commercial' | 'pg';
  images: string[];
  postedAt: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isVerified?: boolean;
  onSave?: (id: string) => void;
}
```

### PriceDisplay
```tsx
// Indian number formatting
export function formatINR(amount: number): string {
  if (amount >= 1_00_00_000) return `₹${(amount / 1_00_00_000).toFixed(2)} Cr`;
  if (amount >= 1_00_000)    return `₹${(amount / 1_00_000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}
```

### Badges
```tsx
// Usage: <Badge variant="new" /> <Badge variant="featured" /> <Badge variant="verified" />
const BADGE_STYLES = {
  new:       'bg-green-100 text-green-700',
  featured:  'bg-yellow-100 text-yellow-700',
  verified:  'bg-blue-100 text-blue-700',
  hot:       'bg-red-100 text-red-700',
  rera:      'bg-purple-100 text-purple-700',
};
```

### SearchBar (hero variant)
```tsx
<div className="flex rounded-lg overflow-hidden shadow-lg">
  <CityDropdown />
  <input
    type="text"
    placeholder="Search locality, landmark, project, or builder"
    className="flex-1 px-4 py-3 text-sm outline-none"
  />
  <button className="bg-brand-red text-white px-6 font-semibold hover:bg-brand-red-dark">
    Search
  </button>
</div>
```

### RangePriceFilter
```tsx
// Dual slider for budget/area range
interface RangeFilterProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (range: [number, number]) => void;
  format?: (n: number) => string;
}
```

### Pagination
```tsx
<div className="flex items-center gap-1">
  <PrevButton />
  {pages.map(page => (
    <button key={page} className={page === current
      ? 'bg-brand-red text-white w-8 h-8 rounded'
      : 'text-gray-600 hover:bg-gray-100 w-8 h-8 rounded'
    }>{page}</button>
  ))}
  <NextButton />
</div>
```

### ImageGallery / Lightbox
- Main image: 16:9 ratio, object-cover
- Thumbnails: horizontal scroll strip
- Lightbox: full-screen overlay, prev/next arrows, close button, image counter

### AmenitiesGrid
```tsx
const AMENITIES = [
  { id: 'lift', label: 'Lift', icon: LiftIcon },
  { id: 'parking', label: 'Parking', icon: ParkingIcon },
  { id: 'gym', label: 'Gym', icon: GymIcon },
  { id: 'pool', label: 'Swimming Pool', icon: PoolIcon },
  { id: 'security', label: '24/7 Security', icon: SecurityIcon },
  { id: 'garden', label: 'Garden', icon: GardenIcon },
  { id: 'clubhouse', label: 'Club House', icon: ClubIcon },
  { id: 'power', label: 'Power Backup', icon: PowerIcon },
];

// Grid: 4 cols desktop, 2 cols mobile
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {AMENITIES.filter(a => amenities.includes(a.id)).map(a => (
    <div key={a.id} className="flex items-center gap-2 text-sm text-gray-700">
      <a.icon className="w-5 h-5 text-brand-red" />
      {a.label}
    </div>
  ))}
</div>
```

---

## Data Types (complete)

```ts
// src/types/property.ts

export type ListingType = 'sale' | 'rent' | 'pg';
export type PropertyType = 'apartment' | 'villa' | 'builder-floor' | 'plot' | 'commercial' | 'penthouse';
export type FurnishingType = 'unfurnished' | 'semi-furnished' | 'fully-furnished';
export type AvailabilityType = 'ready-to-move' | 'under-construction';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  pricePerSqft?: number;
  listingType: ListingType;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  floor?: number;
  totalFloors?: number;
  furnishing: FurnishingType;
  availability: AvailabilityType;
  facing?: string;
  parking?: number;
  ageOfProperty?: string;
  amenities: string[];
  images: string[];
  locality: string;
  city: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  isVerified: boolean;
  isFeatured: boolean;
  isReraRegistered: boolean;
  reraNumber?: string;
  postedBy: Agent;
  postedAt: string;
  updatedAt: string;
  status: 'active' | 'sold' | 'inactive';
}

export interface Agent {
  id: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'agent' | 'builder';
  phone?: string;
  email?: string;
  totalListings?: number;
}

export interface PropertyFilters {
  city?: string;
  locality?: string[];
  listingType?: ListingType;
  propertyType?: PropertyType[];
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number[];
  minArea?: number;
  maxArea?: number;
  furnishing?: FurnishingType[];
  availability?: AvailabilityType;
  amenities?: string[];
  postedBy?: 'owner' | 'agent' | 'builder';
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'area';
  page?: number;
  limit?: number;
}

export interface PaginatedProperties {
  data: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

---

## URL & Query String Conventions

```
/search?city=Mumbai&type=rent&propertyType=apartment&bedrooms=2,3&minPrice=20000&maxPrice=60000&page=1
```

```ts
// src/utils/parseFilters.ts
export function filtersToParams(filters: PropertyFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.city) params.set('city', filters.city);
  if (filters.bedrooms?.length) params.set('bedrooms', filters.bedrooms.join(','));
  if (filters.minPrice) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
  if (filters.page) params.set('page', String(filters.page));
  return params;
}

export function paramsToFilters(params: URLSearchParams): PropertyFilters {
  return {
    city: params.get('city') ?? undefined,
    bedrooms: params.get('bedrooms')?.split(',').map(Number),
    minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
    maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
    page: params.get('page') ? Number(params.get('page')) : 1,
  };
}
```

---

## Build Order (recommended)

| Phase | What to build |
|---|---|
| 1 | Types, `formatINR`, `paramsToFilters`, Navbar, Footer |
| 2 | HomePage — HeroSection + SearchBar + PopularCities |
| 3 | PropertyCard (grid + list variants) |
| 4 | SearchListingPage — FilterSidebar + results grid |
| 5 | PropertyDetailPage — gallery, overview, contact card |
| 6 | Auth — Login modal (OTP flow) |
| 7 | PostPropertyPage — multi-step form |
| 8 | ProfilePage — my listings + saved |

---

## 99acres-specific UX Rules
- Search always stays accessible — sticky navbar search on listing/detail pages
- Price always shown in Indian format (Cr / L), never raw numbers above 1L
- "Contact Owner" never reveals phone until clicked (privacy gate)
- Property images lazy-loaded; skeleton placeholder shown while loading
- Filter changes update URL query params immediately (shareable URLs)
- "Save" (wishlist) requires login — show login modal if unauthenticated
- Mobile: filter sidebar becomes a bottom sheet drawer
- Empty search results show: "No properties found. Try adjusting filters."
- RERA badge shown only when `isReraRegistered === true`

## Output Format
- Provide file path as heading
- Full file content (no truncation for new files)
- If building a page: list all sub-components needed before writing code
- End with: "Next component to build: [name]"
