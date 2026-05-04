import { useState } from 'react';
import { FilterState, SortOption } from '../types/search';

const defaultFilters: FilterState = {
  priceRange: 100,
  propertyTypes: [],
  bhk: [],
  sortBy: 'newest',
};

export const useFilters = (initial?: Partial<FilterState>) => {
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    ...initial,
  });

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAll = () => setFilters(defaultFilters);

  const setSortBy = (sort: SortOption) => updateFilter('sortBy', sort);

  return { filters, updateFilter, clearAll, setSortBy };
};
