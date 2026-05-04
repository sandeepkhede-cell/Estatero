import { Property } from '../../types/property';
import PropertyCardLarge from '../ui/PropertyCardLarge';

interface PropertyCardListProps {
  properties: Property[];
  onCardClick?: (id: Property['id']) => void;
  onFavourite?: (id: Property['id']) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const PropertyCardList = ({
  properties,
  onCardClick,
  onFavourite,
  onLoadMore,
  hasMore = true,
}: PropertyCardListProps) => (
  <>
    <div className="px-gutter flex flex-col gap-lg mt-6">
      {properties.map((property) => (
        <PropertyCardLarge
          key={property.id}
          property={property}
          onCardClick={onCardClick}
          onFavourite={onFavourite}
        />
      ))}
    </div>

    {hasMore && (
      <div className="p-6 flex justify-center">
        <button
          onClick={onLoadMore}
          className="bg-primary text-white px-xl py-3 rounded-xl font-label-bold text-body-md hover:bg-primary-container transition-all shadow-md active:scale-95"
        >
          View More Properties
        </button>
      </div>
    )}
  </>
);

export default PropertyCardList;
