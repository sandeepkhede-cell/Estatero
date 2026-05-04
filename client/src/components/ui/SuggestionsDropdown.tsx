import { LocationSuggestion } from '../../services/searchService';

const TYPE_ICON: Record<LocationSuggestion['type'], string> = {
  city:     'location_city',
  locality: 'location_on',
  landmark: 'flag',
};

const TYPE_LABEL: Record<LocationSuggestion['type'], string> = {
  city:     'City',
  locality: 'Locality',
  landmark: 'Landmark',
};

interface SuggestionsDropdownProps {
  suggestions: LocationSuggestion[];
  popular: string[];
  loading: boolean;
  onSelect: (label: string) => void;
}

const SuggestionsDropdown = ({
  suggestions,
  popular,
  loading,
  onSelect,
}: SuggestionsDropdownProps) => {
  const hasResults  = suggestions.length > 0;
  const hasPopular  = popular.length > 0;
  const showNothing = !loading && !hasResults && !hasPopular;

  if (showNothing) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto">

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 px-4 py-3 text-on-surface-variant text-body-sm">
          <span className="material-symbols-outlined animate-spin text-primary text-[18px]">
            progress_activity
          </span>
          Searching…
        </div>
      )}

      {/* Suggestions from API */}
      {!loading && hasResults && (
        <>
          <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-outline">
            Locations
          </p>
          {suggestions.map((s) => (
            <button
              key={s.label}
              onMouseDown={() => onSelect(s.label)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container-low transition-colors text-left"
            >
              <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0">
                {TYPE_ICON[s.type]}
              </span>
              <span className="flex-1 text-body-sm text-on-surface font-medium">{s.label}</span>
              <span className="text-[10px] uppercase font-bold text-outline tracking-wide">
                {TYPE_LABEL[s.type]}
              </span>
            </button>
          ))}
        </>
      )}

      {/* Popular searches shown when input is empty */}
      {!loading && !hasResults && hasPopular && (
        <>
          <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-outline">
            Popular Searches
          </p>
          {popular.map((item) => (
            <button
              key={item}
              onMouseDown={() => onSelect(item)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container-low transition-colors text-left"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-[20px] flex-shrink-0">
                trending_up
              </span>
              <span className="text-body-sm text-on-surface">{item}</span>
            </button>
          ))}
        </>
      )}

    </div>
  );
};

export default SuggestionsDropdown;
