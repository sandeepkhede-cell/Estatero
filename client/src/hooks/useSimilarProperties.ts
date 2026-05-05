import { useState, useEffect } from 'react';
import { Property } from '../types/property';
import { propertyService } from '../services/propertyService';

export const useSimilarProperties = (
  city: string | undefined,
  excludeId: string | number | undefined,
): { properties: Property[]; loading: boolean } => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading]       = useState(false);

  useEffect(() => {
    if (!city) return;
    let cancelled = false;
    setLoading(true);

    propertyService
      .getAll({ city, page: 1, limit: 8 })
      .then(({ properties: list }) => {
        if (!cancelled) {
          setProperties(list.filter((p) => p.id !== excludeId).slice(0, 4));
        }
      })
      .catch(() => { /* silently skip */ })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [city, excludeId]);

  return { properties, loading };
};
