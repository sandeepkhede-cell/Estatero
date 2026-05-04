import { useNavigate } from 'react-router-dom';
import PropertyCard from '../../components/ui/PropertyCard';
import { useSavedProperties } from '../../hooks/useSavedProperties';

const SavedPage = () => {
  const navigate                               = useNavigate();
  const { properties, loading, error, toggle } = useSavedProperties();

  return (
    <main className="flex-grow max-w-[1200px] mx-auto px-6 py-8 w-full">

      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-h2 text-h2 text-on-surface">Saved Properties</h1>
        {!loading && !error && (
          <p className="text-body-sm text-on-surface-variant mt-1">
            {properties.length === 0
              ? 'No saved properties yet'
              : `${properties.length} saved ${properties.length === 1 ? 'property' : 'properties'}`}
          </p>
        )}
      </div>

      {/* States */}
      {loading && (
        <div className="flex justify-center items-center py-24">
          <span className="material-symbols-outlined animate-spin text-primary text-5xl">
            progress_activity
          </span>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center py-24 gap-4">
          <span className="material-symbols-outlined text-red-400 text-5xl">error</span>
          <p className="text-on-surface-variant">{error}</p>
        </div>
      )}

      {!loading && !error && properties.length === 0 && (
        <div className="flex flex-col items-center py-24 gap-4 text-center">
          <span className="material-symbols-outlined text-outline text-7xl">favorite_border</span>
          <h3 className="font-h3 text-h3 text-on-surface">Nothing saved yet</h3>
          <p className="text-body-md text-on-surface-variant max-w-sm">
            Tap the heart on any property to save it here for later.
          </p>
          <button
            onClick={() => navigate('/listings')}
            className="mt-2 bg-primary text-on-primary px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-sm"
          >
            Browse Properties
          </button>
        </div>
      )}

      {/* Property grid */}
      {!loading && !error && properties.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onCardClick={(id) => navigate(`/property/${id}`)}
              onFavourite={toggle}
            />
          ))}
        </div>
      )}

    </main>
  );
};

export default SavedPage;
