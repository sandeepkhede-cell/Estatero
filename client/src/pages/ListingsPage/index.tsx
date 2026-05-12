import { useNavigate } from 'react-router-dom';
import SidebarFilters from '../../components/listings/SidebarFilters';
import FilterBar from '../../components/listings/FilterBar';
import ListingsHeader from '../../components/listings/ListingsHeader';
import PropertyCardList from '../../components/listings/PropertyCardList';
import Pagination from '../../components/listings/Pagination';
import { useProperties } from '../../hooks/useProperties';
import { useFilters } from '../../hooks/useFilters';
import { useFavourites } from '../../hooks/useFavourites';
import { Property } from '../../types/property';

const SORT_LABELS: Record<string, string> = {
  newest:     'Newest',
  price_asc:  'Price ↑',
  price_desc: 'Price ↓',
};

const SORT_CYCLE = ['newest', 'price_asc', 'price_desc'] as const;

const ListingsPage = () => {
  const navigate  = useNavigate();
  const { toggle } = useFavourites();

  const { filters, updateFilter, updateFilters, clearAll } = useFilters();
  const { properties, loading, error, total, totalPages } = useProperties(filters);

  const handleCardClick = (id: Property['id']) => navigate(`/property/${id}`);

  const currentSortIdx = SORT_CYCLE.indexOf(
    (filters.sortBy ?? 'newest') as typeof SORT_CYCLE[number],
  );
  const handleSortClick = () => {
    const next = SORT_CYCLE[(currentSortIdx + 1) % SORT_CYCLE.length];
    updateFilter('sortBy', next);
  };

  const currentPage = filters.page ?? 1;

  return (
    <>
      <FilterBar filters={filters} onFilterChange={updateFilter} />

      <main className="max-w-[1200px] mx-auto px-6 py-md lg:py-xl w-full flex-grow flex gap-lg">
        <SidebarFilters
          filters={filters}
          onFilterChange={updateFilter}
          onFiltersChange={updateFilters}
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
                onClick={() => updateFilter('page', 1)}
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
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(n) => updateFilter('page', n)}
              />
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default ListingsPage;
