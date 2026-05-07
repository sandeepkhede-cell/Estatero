import { useFavouritesContext } from '../context/FavouritesContext';

export const useFavourites = () => {
  const { ids, toggle, isFavourited } = useFavouritesContext();
  return {
    favourites:   [...ids] as (string | number)[],
    toggle,
    isFavourited,
  };
};
