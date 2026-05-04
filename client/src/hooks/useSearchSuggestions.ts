import { useState, useEffect } from 'react';
import { searchService, LocationSuggestion } from '../services/searchService';

export const useSearchSuggestions = (query: string) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading]         = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const timer = setTimeout(() => {
      searchService.getSuggestions(query)
        .then((s)  => { if (!cancelled) setSuggestions(s); })
        .catch(()  => { if (!cancelled) setSuggestions([]); })
        .finally(() => { if (!cancelled) setLoading(false); });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      setLoading(false);
    };
  }, [query]);

  return { suggestions, loading };
};
