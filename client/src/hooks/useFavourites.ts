import { useState, useEffect } from 'react';

const STORAGE_KEY = 'estatero_favourites';

const load = (): (string | number)[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
};

export const useFavourites = () => {
  const [favourites, setFavourites] = useState<(string | number)[]>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
  }, [favourites]);

  const toggle = (id: string | number) => {
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const isFavourited = (id: string | number) => favourites.includes(id);

  return { favourites, toggle, isFavourited };
};
