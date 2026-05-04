import { Property } from '../../types/property';
import FavouriteButton from './FavouriteButton';
import BadgeLabel from './BadgeLabel';
import PropertyMeta from './PropertyMeta';

interface PropertyCardLargeProps {
  property: Property;
  onCardClick?: (id: Property['id']) => void;
  onFavourite?: (id: Property['id']) => void;
}

const PropertyCardLarge = ({ property, onCardClick, onFavourite }: PropertyCardLargeProps) => {
  const { id, price, title, location, image, badge, badgeVariant, isVerified, isFavourited, meta } = property;

  return (
    <article
      onClick={() => onCardClick?.(id)}
      className="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-50 group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all cursor-pointer"
    >
      <div className="relative h-[240px] md:h-[300px] w-full">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        {badge && (
          <div className="absolute top-4 left-4">
            <BadgeLabel label={badge} variant={badgeVariant} />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <FavouriteButton
            isFavourited={isFavourited}
            onClick={() => onFavourite?.(id)}
          />
        </div>
      </div>

      <div className="p-md">
        <div className="flex justify-between items-start mb-2">
          <span className="font-price-display text-primary text-price-display">{price}</span>
          {isVerified && (
            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-lg">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
            </div>
          )}
        </div>

        <h3 className="font-h3 text-body-lg text-on-surface line-clamp-1 mb-1">{title}</h3>

        <p className="font-body-sm text-tertiary mb-4 flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">location_on</span>
          {location}
        </p>

        <div className="border-t border-gray-50 pt-4">
          <PropertyMeta items={meta} size="md" />
        </div>
      </div>
    </article>
  );
};

export default PropertyCardLarge;
