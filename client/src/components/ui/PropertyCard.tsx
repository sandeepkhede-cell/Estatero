import { Property } from '../../types/property';
import { formatINR } from '../../utils/formatINR';
import FavouriteButton from './FavouriteButton';
import VerifiedBadge from './VerifiedBadge';
import PropertySpecsRow from './PropertySpecsRow';
import { useCompare } from '../../context/CompareContext';

interface PropertyCardProps {
  property: Property;
  onCardClick?: (id: Property['id']) => void;
  onFavourite?: (id: Property['id']) => void;
}

// Render up to 5 stars from a 0–5 rating (supports half-stars)
function StarRating({ rating }: { rating: number }) {
  const filled = Math.floor(rating);
  const half   = rating - filled >= 0.5;
  const empty  = 5 - filled - (half ? 1 : 0);
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: filled }).map((_, i) => (
        <span key={`f${i}`} className="material-symbols-outlined text-amber-400 text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
      ))}
      {half && (
        <span className="material-symbols-outlined text-amber-400 text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e${i}`} className="material-symbols-outlined text-amber-300 text-[13px]">star</span>
      ))}
      <span className="text-[10px] text-on-surface-variant ml-0.5">{rating.toFixed(1)}</span>
    </span>
  );
}

const PropertyCard = ({ property, onCardClick, onFavourite }: PropertyCardProps) => {
  const { id, price, emi, title, location, image, badge, isVerified, isFavourited, area, status, floor, isOwnerDirect, projectName, agent, viewCount } = property;
  const { toggle, isSelected, selected } = useCompare();
  const inCompare    = isSelected(id);
  const limitReached = !inCompare && selected.length >= 3;

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
        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
          {isVerified && <VerifiedBadge variant="card" />}
          {agent?.isVerified && !isVerified && (
            <div className="bg-emerald-600/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-white text-[12px]">verified</span>
              <span className="text-[10px] font-bold text-white">Verified Agent</span>
            </div>
          )}
          {isOwnerDirect && (
            <div className="bg-amber-500/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-white text-[12px]">handshake</span>
              <span className="text-[10px] font-bold text-white">Owner Direct</span>
            </div>
          )}
          {badge && !isVerified && !isOwnerDirect && (
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
        {/* View count overlay — bottom right of image */}
        {viewCount != null && viewCount > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            <span className="material-symbols-outlined text-[11px]">visibility</span>
            {viewCount >= 1000 ? `${(viewCount / 1000).toFixed(1)}k` : viewCount}
          </div>
        )}
      </div>

      <div className="p-md space-y-sm">
        <div className="flex justify-between items-start">
          <span className="font-price-display text-price-display text-primary">{formatINR(price)}</span>
          {emi && <span className="text-body-sm text-outline">EMI starts at {emi}</span>}
        </div>

        <h3 className="font-h3 text-body-lg text-on-surface leading-tight">{title}</h3>

        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">location_on</span>
          <span className="text-body-sm">{location}</span>
        </div>

        {/* Agent rating */}
        {agent?.rating != null && agent.rating > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating rating={Number(agent.rating)} />
          </div>
        )}

        {projectName && (
          <div className="flex items-center gap-1 text-xs text-primary font-semibold">
            <span className="material-symbols-outlined text-[14px]">apartment</span>
            Part of {projectName}
          </div>
        )}

        {specs.length > 0 && <PropertySpecsRow specs={specs} />}

        <div className="flex gap-2 mt-md">
          <button
            onClick={(e) => { e.stopPropagation(); onCardClick?.(id); }}
            className="flex-1 bg-primary-container text-on-primary-container py-3 rounded-lg font-label-bold text-body-md hover:opacity-90 transition-all"
          >
            View Details
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggle(property); }}
            disabled={limitReached}
            title={limitReached ? 'Max 3 properties' : inCompare ? 'Remove from compare' : 'Add to compare'}
            className={[
              'flex items-center justify-center w-10 h-10 rounded-lg border transition-colors flex-shrink-0',
              inCompare
                ? 'bg-primary text-white border-primary'
                : limitReached
                  ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                  : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary',
            ].join(' ')}
          >
            <span className="material-symbols-outlined text-[18px]">
              {inCompare ? 'check_box' : 'compare'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;

