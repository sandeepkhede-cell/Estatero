import { useNavigate } from 'react-router-dom';
import HeroSection from '../../components/home/HeroSection';
import CuratedCollectionsSection from '../../components/home/CuratedCollectionsSection';
import RecommendedSection from '../../components/home/RecommendedSection';
import { SearchParams } from '../../components/home/SearchBanner';
import { useFavourites } from '../../hooks/useFavourites';
import { useFeaturedProperties } from '../../hooks/useFeaturedProperties';

const HomePage = () => {
  const navigate                    = useNavigate();
  const { toggle }                  = useFavourites();
  const { properties, loading }     = useFeaturedProperties();

  return (
    <main className="flex-grow">
      <HeroSection
        onSearch={(params: SearchParams) =>
          navigate('/listings', { state: params })
        }
        onTagClick={(tag) =>
          navigate('/listings', { state: { city: tag } })
        }
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
