interface FilterBarProps {
  filters?: string[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

const defaultFilters = ['Buy', 'Rent', 'Commercial', 'Price Range', 'BHK'];

const FilterBar = ({
  filters = defaultFilters,
  activeFilter,
  onFilterChange,
}: FilterBarProps) => (
  <div className="sticky top-[61px] z-40 bg-white dark:bg-gray-950 border-b border-gray-50 dark:border-gray-900 overflow-x-auto px-6 py-3 hide-scrollbar flex items-center gap-3">
    <button className="flex items-center gap-2 whitespace-nowrap bg-primary-container text-white px-4 py-2 rounded-xl font-label-bold text-body-sm shadow-md">
      <span className="material-symbols-outlined text-[18px]">tune</span>
      Filters
    </button>
    {filters.map((filter) => (
      <button
        key={filter}
        onClick={() => onFilterChange?.(filter)}
        className={`flex items-center gap-2 whitespace-nowrap border px-4 py-2 rounded-xl font-label-bold text-body-sm transition-all ${
          activeFilter === filter
            ? 'bg-primary-container text-white border-primary-container'
            : 'bg-white border-outline-variant text-on-surface hover:bg-gray-50'
        }`}
      >
        {filter}
      </button>
    ))}
  </div>
);

export default FilterBar;
