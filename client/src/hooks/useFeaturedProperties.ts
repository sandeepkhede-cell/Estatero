import { useState, useEffect } from 'react';
import { Property } from '../types/property';
import { propertyService } from '../services/propertyService';
import { useFavourites } from './useFavourites';

interface UseFeaturedPropertiesResult {
  properties: Property[];
  loading: boolean;
  error: string | null;
}

export const useFeaturedProperties = (): UseFeaturedPropertiesResult => {
  const { isFavourited }      = useFavourites();
  const [raw, setRaw]         = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    propertyService.getFeatured()
      .then((res) => { if (!cancelled) setRaw(res); })
      .catch((err: unknown) => {
        if (!cancelled) setError((err as Error).message ?? 'Failed to load featured properties');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return {
    properties: raw.map((p) => ({ ...p, isFavourited: isFavourited(p.id) })),
    loading,
    error,
  };
};
