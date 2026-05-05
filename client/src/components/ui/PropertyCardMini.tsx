import { Property } from '../../types/property';
import { formatINR } from '../../utils/formatINR';
import FavouriteButton from './FavouriteButton';
import PropertyMeta from './PropertyMeta';

interface PropertyCardMiniProps {
  property: Property;
  onCardClick?: (id: Property['id']) => void;
  onFavourite?: (id: Property['id']) => void;
}

const PropertyCardMini = ({ property, onCardClick, onFavourite }: PropertyCardMiniProps) => {
  const { id, price, title, description, image, badge, isFavourited, meta } = property;

  return (
    <div
      onClick={() => onCardClick?.(id)}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-gray-100 cursor-pointer"
    >
      <div className="relative h-48">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <FavouriteButton
            size="sm"
            isFavourited={isFavourited}
            onClick={() => onFavourite?.(id)}
          />
        </div>
        {badge && (
          <span className="absolute bottom-3 left-3 bg-primary-container text-white text-[10px] font-bold px-2 py-1 rounded">
            {badge}
          </span>
        )}
      </div>

      <div className="p-md">
        <div className="font-price-display text-primary-container mb-1">{formatINR(price)}</div>
        <h4 className="font-label-bold text-on-surface truncate">{title}</h4>
        <p className="text-body-sm text-outline-variant truncate mb-3">{description}</p>
        <PropertyMeta items={meta} size="sm" />
      </div>
    </div>
  );
};

export default PropertyCardMini;
