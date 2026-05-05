import { useState, useEffect } from 'react';
import { Property } from '../types/property';
import { FilterState } from '../types/search';
import { propertyService, PropertyListResponse } from '../services/propertyService';
import { useFavourites } from './useFavourites';

interface UsePropertiesResult {
  properties: Property[];
  loading:    boolean;
  error:      string | null;
  total:      number;
  totalPages: number;
}

export const useProperties = (filters: FilterState): UsePropertiesResult => {
  const { isFavourited }      = useFavourites();
  const [data, setData]       = useState<PropertyListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    propertyService.getAll(filters)
      .then((res) => { if (!cancelled) setData(res); })
      .catch((err: unknown) => {
        if (!cancelled)
          setError((err as Error).message ?? 'Failed to load properties');
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [filtersKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const properties = (data?.properties ?? []).map((p) => ({
    ...p,
    isFavourited: isFavourited(p.id),
  }));

  return {
    properties,
    loading,
    error,
    total:      data?.total      ?? 0,
    totalPages: data?.totalPages ?? 1,
  };
};
