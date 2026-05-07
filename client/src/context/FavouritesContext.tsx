import {
  createContext, useContext, useState, useEffect,
  useCallback, useRef, ReactNode,
} from 'react';
import { Property } from '../types/property';
import { favouriteService } from '../services/favouriteService';
import { useAuth } from './AuthContext';

const LS_KEY = 'estatero_favourites';

const loadLS = (): Set<number> => {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_KEY) ?? '[]') as (string | number)[];
    return new Set(raw.map(Number));
  } catch {
    return new Set();
  }
};

interface FavouritesContextValue {
  ids:             Set<number>;
  savedProperties: Property[];
  loading:         boolean;
  toggle:          (id: string | number) => void;
  isFavourited:    (id: string | number) => boolean;
}

const FavouritesContext = createContext<FavouritesContextValue | null>(null);

export const FavouritesProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();

  const [ids,             setIds]             = useState<Set<number>>(loadLS);
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [loading,         setLoading]         = useState(false);

  // Stable ref so toggle/isFavourited don't need ids in their dep arrays
  const idsRef = useRef(ids);
  idsRef.current = ids;

  // Track which user ID we've already synced to avoid re-fetching on re-renders
  const fetchedForRef = useRef<number | null>(null);

  // Sync with DB on login, reset to LS on logout
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      if (fetchedForRef.current !== null) {
        setIds(loadLS());
        setSavedProperties([]);
        fetchedForRef.current = null;
      }
      return;
    }

    if (fetchedForRef.current === user.id) return;
    fetchedForRef.current = user.id;

    let cancelled = false;
    setLoading(true);

    favouriteService.getAll()
      .then((serverProps) => {
        if (cancelled) return;
        const serverIds = new Set(serverProps.map((p) => Number(p.id)));
        // Migrate any local IDs that aren't in the DB yet
        const toMigrate = [...loadLS()].filter((id) => !serverIds.has(id));
        toMigrate.forEach((id) => favouriteService.add(id).catch(() => {}));
        setIds(new Set([...serverIds, ...toMigrate]));
        setSavedProperties(serverProps);
        localStorage.removeItem(LS_KEY);
      })
      .catch(() => { /* keep LS state on network error */ })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [user?.id, authLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist to localStorage when the user is not logged in
  useEffect(() => {
    if (!user && !authLoading) {
      localStorage.setItem(LS_KEY, JSON.stringify([...ids]));
    }
  }, [ids, user, authLoading]);

  const toggle = useCallback(async (id: string | number) => {
    const numId = Number(id);
    const isFav = idsRef.current.has(numId);

    // Optimistic update
    setIds((prev) => {
      const next = new Set(prev);
      isFav ? next.delete(numId) : next.add(numId);
      return next;
    });
    if (isFav) {
      setSavedProperties((prev) => prev.filter((p) => Number(p.id) !== numId));
    }

    if (!user) return; // LS update handled by the effect above

    try {
      if (isFav) {
        await favouriteService.remove(numId);
      } else {
        const added = await favouriteService.add(numId);
        setSavedProperties((prev) => [added, ...prev]);
      }
    } catch {
      // Revert IDs
      setIds((prev) => {
        const next = new Set(prev);
        isFav ? next.add(numId) : next.delete(numId);
        return next;
      });
      // If remove failed, restore the property list from the server
      if (isFav) {
        favouriteService.getAll()
          .then((props) => {
            setSavedProperties(props);
            setIds(new Set(props.map((p) => Number(p.id))));
          })
          .catch(() => {});
      }
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const isFavourited = useCallback(
    (id: string | number) => idsRef.current.has(Number(id)),
    [], // stable — reads from ref, not stale closure
  );

  return (
    <FavouritesContext.Provider value={{ ids, savedProperties, loading, toggle, isFavourited }}>
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavouritesContext = () => {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error('useFavouritesContext must be used within FavouritesProvider');
  return ctx;
};
