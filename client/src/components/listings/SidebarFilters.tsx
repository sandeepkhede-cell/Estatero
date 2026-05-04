import { FilterState } from '../../types/search';
import PriceRangeFilter from './PriceRangeFilter';
import PropertyTypeFilter from './PropertyTypeFilter';
import BHKFilter from './BHKFilter';

interface SidebarFiltersProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onClearAll?: () => void;
}

const SidebarFilters = ({ filters, onFilterChange, onClearAll }: SidebarFiltersProps) => (
  <aside className="w-72 flex-shrink-0 hidden lg:block">
    <div className="bg-white dark:bg-gray-900 rounded-xl p-md shadow-sm border border-gray-100 dark:border-gray-800 sticky top-[88px]">
      <div className="flex items-center justify-between mb-lg">
        <h3 className="font-h3 text-body-md text-on-surface">Filters</h3>
        <button
          onClick={onClearAll}
          className="text-primary text-body-sm font-semibold"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-lg">
        <PriceRangeFilter
          value={filters.priceRange}
          onChange={(v) => onFilterChange('priceRange', v)}
        />
        <PropertyTypeFilter
          selected={filters.propertyTypes}
          onChange={(v) => onFilterChange('propertyTypes', v)}
        />
        <BHKFilter
          selected={filters.bhk}
          onChange={(v) => onFilterChange('bhk', v)}
        />
      </div>
    </div>
  </aside>
);

export default SidebarFilters;
