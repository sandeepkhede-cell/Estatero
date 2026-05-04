import { useState, useEffect } from 'react';
import { Property } from '../types/property';
import { propertyService } from '../services/propertyService';

interface UsePropertyDetailResult {
  property: Property | null;
  loading: boolean;
  error: string | null;
}

export const usePropertyDetail = (id?: string | number): UsePropertyDetailResult => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    propertyService.getById(id)
      .then((res) => { if (!cancelled) setProperty(res); })
      .catch((err: unknown) => {
        if (!cancelled) setError((err as Error).message ?? 'Property not found');
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [id]);

  return { property, loading, error };
};
