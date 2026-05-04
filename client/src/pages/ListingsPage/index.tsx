import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SidebarFilters from '../../components/listings/SidebarFilters';
import FilterBar from '../../components/listings/FilterBar';
import ListingsHeader from '../../components/listings/ListingsHeader';
import PropertyCardList from '../../components/listings/PropertyCardList';
import Pagination from '../../components/listings/Pagination';
import { useProperties } from '../../hooks/useProperties';
import { useFilters } from '../../hooks/useFilters';
import { useFavourites } from '../../hooks/useFavourites';
import { FilterState } from '../../types/search';
import { Property } from '../../types/property';

// ── Map hero-search state → FilterState ──────────────────────────────────────

type SearchState = Partial<{
  city: string;
  propertyType: string;
  budget: string;
}>;

const PROPERTY_TYPE_MAP: Record<string, string> = {
  'Flat/Apartment':    'Apartment',
  'Independent House': 'Independent House',
  'Plot/Land':         'Plot',
  'Villa':             'Villa',
};

const BUDGET_MAP: Record<string, number> = {
  '₹50L - ₹1Cr': 10,
  '₹1Cr - ₹2Cr': 20,
  '₹2Cr+':        100,
};

function parseSearchState(state: SearchState | null): Partial<FilterState> {
  if (!state) return {};
  const out: Partial<FilterState> = {};

  // city — may be a raw tag like "Flats in Mumbai" or "2BHK in Bangalore"
  const rawCity = state.city ?? '';
  if (rawCity) {
    const inMatch = rawCity.match(/\bin\s+([A-Za-z\s]+)$/i);
    out.city = inMatch ? inMatch[1].trim() : rawCity;

    if (/flat|apartment/i.test(rawCity))  out.propertyTypes = ['Apartment'];
    else if (/villa/i.test(rawCity))      out.propertyTypes = ['Villa'];
    else if (/plot|land/i.test(rawCity))  out.propertyTypes = ['Plot'];

    const bhkMatch = rawCity.match(/(\d)\s*bhk/i);
    if (bhkMatch) out.bhk = [`${bhkMatch[1]} BHK`];
  }

  // property type from SearchBanner dropdown (overrides tag detection)
  if (state.propertyType) {
    const mapped = PROPERTY_TYPE_MAP[state.propertyType];
    if (mapped) out.propertyTypes = [mapped];
  }

  // budget from SearchBanner dropdown
  if (state.budget && state.budget !== 'Any Budget') {
    const range = BUDGET_MAP[state.budget];
    if (range !== undefined) out.priceRange = range;
  }

  return out;
}

// ── Sort cycling ──────────────────────────────────────────────────────────────

const SORT_LABELS: Record<string, string> = {
  newest:     'Newest',
  price_asc:  'Price ↑',
  price_desc: 'Price ↓',
};

const SORT_CYCLE = ['newest', 'price_asc', 'price_desc'] as const;

// ── Component ─────────────────────────────────────────────────────────────────

const ListingsPage = () => {
  const navigate                        = useNavigate();
  const { toggle }                      = useFavourites();
  const routeLocation                   = useLocation();

  // Parse hero-search params once on mount
  const initialFilters = useMemo(
    () => parseSearchState(routeLocation.state as SearchState | null),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const { filters, updateFilter, clearAll } = useFilters(initialFilters);
  const { properties, loading, error, page, totalPages, total, setPage } =
    useProperties(filters);

  const handleCardClick = (id: Property['id']) => navigate(`/property/${id}`);

  // Buy / Rent tab — maps to `status` filter
  const activeTab = filters.status === 'for_rent' ? 'Rent' : 'Buy';
  const handleTabChange = (tab: string) => {
    updateFilter('status', tab === 'Rent' ? 'for_rent' : 'for_sale');
  };

  // Sort cycle on header button click
  const currentSortIdx = SORT_CYCLE.indexOf(
    (filters.sortBy ?? 'newest') as typeof SORT_CYCLE[number]
  );
  const handleSortClick = () => {
    const next = SORT_CYCLE[(currentSortIdx + 1) % SORT_CYCLE.length];
    updateFilter('sortBy', next);
  };

  return (
    <>
      {/* Mobile filter chips */}
      <FilterBar activeFilter={activeTab} onFilterChange={handleTabChange} />

      <main className="max-w-[1200px] mx-auto px-6 py-md lg:py-xl w-full flex-grow flex gap-lg">
        <SidebarFilters
          filters={filters}
          onFilterChange={updateFilter}
          onClearAll={clearAll}
        />

        <section className="flex-1 pb-24">
          <ListingsHeader
            location={filters.city ?? 'All Cities'}
            totalCount={total}
            sortLabel={SORT_LABELS[filters.sortBy ?? 'newest']}
            onSortClick={handleSortClick}
          />

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="material-symbols-outlined animate-spin text-primary text-5xl">
                progress_activity
              </span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <span className="material-symbols-outlined text-red-400 text-5xl">error</span>
              <p className="text-on-surface-variant">{error}</p>
              <button
                onClick={() => setPage(1)}
                className="text-primary text-body-sm font-semibold underline"
              >
                Try again
              </button>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center py-20 gap-3">
              <span className="material-symbols-outlined text-outline text-5xl">search_off</span>
              <p className="text-on-surface-variant">No properties match your filters.</p>
              <button onClick={clearAll} className="text-primary text-body-sm font-semibold underline">
                Clear filters
              </button>
            </div>
          ) : (
            <PropertyCardList
              properties={properties}
              onCardClick={handleCardClick}
              onFavourite={toggle}
              hasMore={false}
            />
          )}

          {!loading && !error && totalPages > 1 && (
            <div className="mt-xl flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default ListingsPage;
