import { Property } from '../../types/property';
import FavouriteButton from './FavouriteButton';
import VerifiedBadge from './VerifiedBadge';
import PropertySpecsRow from './PropertySpecsRow';

interface PropertyCardProps {
  property: Property;
  onCardClick?: (id: Property['id']) => void;
  onFavourite?: (id: Property['id']) => void;
}

const PropertyCard = ({ property, onCardClick, onFavourite }: PropertyCardProps) => {
  const { id, price, emi, title, location, image, badge, isVerified, isFavourited, area, status, floor } = property;

  const specs = [
    ...(area   ? [{ label: 'Area',   value: area   }] : []),
    ...(status ? [{ label: 'Status', value: status }] : []),
    ...(floor  ? [{ label: 'Floor',  value: floor  }] : []),
  ];

  return (
    <div
      onClick={() => onCardClick?.(id)}
      className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group border border-gray-100 dark:border-gray-800 cursor-pointer"
    >
      <div className="relative h-56">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          {isVerified && <VerifiedBadge variant="card" />}
          {badge && !isVerified && (
            <div className="bg-on-secondary-container/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-tight text-white">{badge}</span>
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4">
          <FavouriteButton
            isFavourited={isFavourited}
            onClick={() => onFavourite?.(id)}
          />
        </div>
      </div>

      <div className="p-md space-y-sm">
        <div className="flex justify-between items-start">
          <span className="font-price-display text-price-display text-primary">{price}</span>
          {emi && <span className="text-body-sm text-outline">EMI starts at {emi}</span>}
        </div>

        <h3 className="font-h3 text-body-lg text-on-surface leading-tight">{title}</h3>

        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">location_on</span>
          <span className="text-body-sm">{location}</span>
        </div>

        {specs.length > 0 && <PropertySpecsRow specs={specs} />}

        <button
          onClick={(e) => { e.stopPropagation(); onCardClick?.(id); }}
          className="w-full bg-primary-container text-on-primary-container py-3 rounded-lg font-label-bold text-body-md hover:opacity-90 transition-all mt-md"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
