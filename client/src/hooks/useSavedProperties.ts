import { useFavouritesContext } from '../context/FavouritesContext';

export const useSavedProperties = () => {
  const { savedProperties, loading, toggle, isFavourited } = useFavouritesContext();
  return {
    properties: savedProperties.map((p) => ({ ...p, isFavourited: isFavourited(p.id) })),
    loading,
    error:      null as string | null,
    toggle,
    count:      savedProperties.length,
  };
};
