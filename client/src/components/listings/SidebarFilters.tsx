import { FilterState } from '../../types/search';
import type { FurnishingType, AvailabilityType } from '../../types/property';
import PriceRangeFilter from './PriceRangeFilter';
import PropertyTypeFilter from './PropertyTypeFilter';
import BHKFilter from './BHKFilter';
import FurnishingFilter from './FurnishingFilter';
import AvailabilityFilter from './AvailabilityFilter';
import PostedByFilter from './PostedByFilter';
import AgeFilter from './AgeFilter';
import FilterSection from './FilterSection';
import AmenitiesFilter from './AmenitiesFilter';

interface SidebarFiltersProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onClearAll?: () => void;
}

const SidebarFilters = ({ filters, onFilterChange, onClearAll }: SidebarFiltersProps) => {
  const activeCount = [
    filters.city,
    filters.status,
    (filters.propertyTypes?.length ?? 0) > 0,
    (filters.bhk?.length ?? 0) > 0,
    filters.minPrice,
    filters.maxPrice,
    (filters.furnishing?.length ?? 0) > 0,
    filters.availability,
    filters.ageOfProperty,
    filters.postedBy,
    (filters.amenities?.length ?? 0) > 0,
  ].filter(Boolean).length;

  return (
    <aside className="w-72 flex-shrink-0 hidden lg:block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-[88px] max-h-[calc(100vh-108px)] overflow-y-auto">
        <div className="flex items-center justify-between px-md pt-md pb-sm">
          <h3 className="font-semibold text-on-surface text-sm">
            Filters{activeCount > 0 && (
              <span className="ml-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
          </h3>
          <button onClick={onClearAll} className="text-primary text-body-sm font-semibold hover:underline">
            Clear All
          </button>
        </div>

        <div className="px-md pb-md space-y-0">
          <FilterSection label="Budget">
            <PriceRangeFilter
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              onChange={(patch) => {
                if ('minPrice' in patch) onFilterChange('minPrice', patch.minPrice);
                if ('maxPrice' in patch) onFilterChange('maxPrice', patch.maxPrice);
                if ('priceRange' in patch) onFilterChange('priceRange', patch.priceRange);
              }}
            />
          </FilterSection>

          <FilterSection label="Property Type">
            <PropertyTypeFilter
              selected={filters.propertyTypes}
              onChange={(v) => onFilterChange('propertyTypes', v)}
            />
          </FilterSection>

          <FilterSection label="BHK">
            <BHKFilter
              selected={filters.bhk}
              onChange={(v) => onFilterChange('bhk', v)}
            />
          </FilterSection>

          <FilterSection label="Furnishing">
            <FurnishingFilter
              selected={filters.furnishing}
              onChange={(v) => onFilterChange('furnishing', v as FurnishingType[])}
            />
          </FilterSection>

          <FilterSection label="Availability" defaultOpen={false}>
            <AvailabilityFilter
              selected={filters.availability}
              onChange={(v) => onFilterChange('availability', v as AvailabilityType | undefined)}
            />
          </FilterSection>

          <FilterSection label="Age of Property" defaultOpen={false}>
            <AgeFilter
              selected={filters.ageOfProperty}
              onChange={(v) => onFilterChange('ageOfProperty', v)}
            />
          </FilterSection>

          <FilterSection label="Posted By" defaultOpen={false}>
            <PostedByFilter
              selected={filters.postedBy}
              onChange={(v) => onFilterChange('postedBy', v)}
            />
          </FilterSection>

          <FilterSection label="Amenities" defaultOpen={false}>
            <AmenitiesFilter
              selected={filters.amenities}
              onChange={(v) => onFilterChange('amenities', v)}
            />
          </FilterSection>
        </div>
      </div>
    </aside>
  );
};

export default SidebarFilters;
