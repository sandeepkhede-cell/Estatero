import { useNavigate } from 'react-router-dom';
import HeroSection from '../../components/home/HeroSection';
import CuratedCollectionsSection from '../../components/home/CuratedCollectionsSection';
import RecommendedSection from '../../components/home/RecommendedSection';
import PopularCitiesSection from '../../components/home/PopularCitiesSection';
import { useFavourites } from '../../hooks/useFavourites';
import { useFeaturedProperties } from '../../hooks/useFeaturedProperties';
import { heroToParams } from '../../utils/filterParams';
import type { SearchParams } from '../../types/search';

const HomePage = () => {
  const navigate                = useNavigate();
  const { toggle }              = useFavourites();
  const { properties, loading } = useFeaturedProperties();

  const goToListings = (qs: URLSearchParams) => {
    const str = qs.toString();
    navigate(str ? `/listings?${str}` : '/listings');
  };

  return (
    <main className="flex-grow">
      <HeroSection
        onSearch={(params: SearchParams) => goToListings(heroToParams(params))}
        onTagClick={(tag) => goToListings(heroToParams({ city: tag, propertyType: '', budget: '' }))}
      />
      <PopularCitiesSection
        onCityClick={(city) => goToListings(heroToParams({ city, propertyType: '', budget: '' }))}
      />
      <CuratedCollectionsSection
        onCardClick={() => navigate('/listings')}
      />
      {!loading && (
        <RecommendedSection
          properties={properties}
          onCardClick={(id) => navigate(`/property/${id}`)}
          onFavourite={toggle}
        />
      )}
    </main>
  );
};

export default HomePage;
