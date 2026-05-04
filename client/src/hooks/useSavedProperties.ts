import { useState, useEffect } from 'react';
import { Property } from '../types/property';
import { propertyService } from '../services/propertyService';
import { useFavourites } from './useFavourites';

export const useSavedProperties = () => {
  const { favourites, toggle, isFavourited } = useFavourites();
  const [properties, setProperties]          = useState<Property[]>([]);
  const [loading, setLoading]                = useState(false);
  const [error, setError]                    = useState<string | null>(null);

  useEffect(() => {
    if (favourites.length === 0) {
      setProperties([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all(favourites.map((id) => propertyService.getById(id)))
      .then((results) => {
        if (!cancelled)
          setProperties(results.filter((p): p is Property => p !== null));
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load saved properties.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [JSON.stringify(favourites)]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    properties: properties.map((p) => ({ ...p, isFavourited: isFavourited(p.id) })),
    loading,
    error,
    toggle,
    count: favourites.length,
  };
};
