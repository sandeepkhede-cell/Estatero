import { useState, useEffect } from 'react';
import { searchService } from '../services/searchService';

const FALLBACK = ['Flats in Mumbai', '2BHK in Bangalore', 'Villas in Goa'];

export const usePopularSearches = () => {
  const [popular, setPopular] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    searchService.getPopularSearches()
      .then((s) => { if (!cancelled) setPopular(s.length ? s : FALLBACK); })
      .catch(()  => { if (!cancelled) setPopular(FALLBACK); });
    return () => { cancelled = true; };
  }, []);

  return { popular };
};
