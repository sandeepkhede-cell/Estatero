import { useState, useEffect } from 'react';
import SearchField from '../ui/SearchField';
import SearchSelect from '../ui/SearchSelect';
import SuggestionsDropdown from '../ui/SuggestionsDropdown';
import { useSearchSuggestions } from '../../hooks/useSearchSuggestions';
import { usePopularSearches } from '../../hooks/usePopularSearches';
import { searchService } from '../../services/searchService';

export interface SearchParams {
  city: string;
  propertyType: string;
  budget: string;
}

interface SearchBannerProps {
  propertyTypes?: string[];
  budgetOptions?: string[];
  onSearch?: (params: SearchParams) => void;
}

const defaultPropertyTypes = [
  'Flat/Apartment',
  'Independent House',
  'Plot/Land',
  'Villa',
];

const defaultBudgetOptions = [
  'Any Budget',
  '₹50L - ₹1Cr',
  '₹1Cr - ₹2Cr',
  '₹2Cr+',
];

const SearchBanner = ({
  propertyTypes = defaultPropertyTypes,
  budgetOptions = defaultBudgetOptions,
  onSearch,
}: SearchBannerProps) => {
  const [city, setCity]                 = useState('');
  const [propertyType, setPropertyType] = useState(propertyTypes[0]);
  const [budget, setBudget]             = useState(budgetOptions[0]);
  const [focused, setFocused]           = useState(false);

  // Reset property type when the tab changes (propertyTypes prop changes)
  useEffect(() => {
    setPropertyType(propertyTypes[0]);
  }, [propertyTypes]);

  const { suggestions, loading } = useSearchSuggestions(city);
  const { popular }              = usePopularSearches();

  const showDropdown   = focused;
  const showPopular    = showDropdown && city.trim().length < 2;
  const showSuggestions = showDropdown && city.trim().length >= 2;

  const handleSelect = (label: string) => {
    setCity(label);
    setFocused(false);
  };

  const handleSearch = () => {
    if (city.trim()) searchService.trackSearch(city);
    onSearch?.({ city, propertyType, budget });
  };

  return (
    <div className="bg-transparent">
      <div className="flex flex-col md:flex-row items-center gap-2">

        {/* City / Locality — with autocomplete */}
        <div className="relative flex-1 w-full">
          <SearchField icon="location_on" label="City/Locality">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder="Enter City, Locality"
              className="w-full bg-transparent border-none p-0 focus:ring-0 font-label-bold text-on-surface placeholder:text-outline-variant outline-none"
            />
          </SearchField>

          {(showPopular || showSuggestions) && (
            <SuggestionsDropdown
              suggestions={showSuggestions ? suggestions : []}
              popular={showPopular ? popular : []}
              loading={showSuggestions ? loading : false}
              onSelect={handleSelect}
            />
          )}
        </div>

        {/* Property Type */}
        <SearchSelect
          icon="home_work"
          label="Property Type"
          value={propertyType}
          options={propertyTypes}
          onChange={setPropertyType}
        />

        {/* Budget */}
        <SearchSelect
          icon="payments"
          label="Budget"
          value={budget}
          options={budgetOptions}
          onChange={setBudget}
        />

        <button
          onClick={handleSearch}
          className="w-full md:w-auto bg-primary-container hover:bg-primary text-white flex items-center justify-center gap-2 px-xl py-lg rounded-lg transition-all shadow-lg active:scale-95"
        >
          <span className="material-symbols-outlined">search</span>
          <span className="font-label-bold text-lg">Search</span>
        </button>

      </div>
    </div>
  );
};

export default SearchBanner;
