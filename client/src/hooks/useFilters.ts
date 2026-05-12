import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterState, SortOption } from '../types/search';
import { filtersToParams, paramsToFilters, DEFAULT_FILTERS } from '../utils/filterParams';

export const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: FilterState = {
    ...DEFAULT_FILTERS,
    ...paramsToFilters(searchParams),
  };

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      const updated: FilterState = { ...filters, [key]: value };
      if (key !== 'page') updated.page = 1;
      setSearchParams(filtersToParams(updated), { replace: true });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, setSearchParams],
  );

  const updateFilters = useCallback(
    (patch: Partial<FilterState>) => {
      const updated: FilterState = { ...filters, ...patch, page: 1 };
      setSearchParams(filtersToParams(updated), { replace: true });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, setSearchParams],
  );

  const clearAll = useCallback(() => {
    setSearchParams(filtersToParams(DEFAULT_FILTERS), { replace: true });
  }, [setSearchParams]);

  const setSortBy = useCallback(
    (sort: SortOption) => updateFilter('sortBy', sort),
    [updateFilter],
  );

  return { filters, updateFilter, updateFilters, clearAll, setSortBy };
};
