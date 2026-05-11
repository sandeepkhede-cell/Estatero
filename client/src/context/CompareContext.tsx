import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Property } from '../types/property';

const MAX = 3;

interface CompareContextValue {
  selected:   Property[];
  isSelected: (id: Property['id']) => boolean;
  toggle:     (property: Property) => void;
  clear:      () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [selected, setSelected] = useState<Property[]>([]);

  const isSelected = useCallback(
    (id: Property['id']) => selected.some((p) => String(p.id) === String(id)),
    [selected],
  );

  const toggle = useCallback((property: Property) => {
    setSelected((prev) => {
      if (prev.some((p) => String(p.id) === String(property.id)))
        return prev.filter((p) => String(p.id) !== String(property.id));
      if (prev.length >= MAX) return prev;
      return [...prev, property];
    });
  }, []);

  const clear = useCallback(() => setSelected([]), []);

  return (
    <CompareContext.Provider value={{ selected, isSelected, toggle, clear }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used inside CompareProvider');
  return ctx;
};
