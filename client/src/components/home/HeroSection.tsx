import { useState } from 'react';
import SearchBanner, { SearchParams } from './SearchBanner';
import PopularSearchTags from './PopularSearchTags';

type Tab = 'buy' | 'rent' | 'pg' | 'plot' | 'commercial';

const TABS: { key: Tab; label: string }[] = [
  { key: 'buy',        label: 'Buy' },
  { key: 'rent',       label: 'Rent' },
  { key: 'pg',         label: 'PG / Co-living' },
  { key: 'plot',       label: 'Plot' },
  { key: 'commercial', label: 'Commercial' },
];

const TAB_LISTING_TYPE: Record<Tab, string> = {
  buy:        'for_sale',
  rent:       'for_rent',
  pg:         'pg',
  plot:       'for_sale',
  commercial: 'for_sale',
};

const TAB_PROPERTY_TYPES: Record<Tab, string[]> = {
  buy:        ['Flat/Apartment', 'Independent House', 'Villa', 'Builder Floor'],
  rent:       ['Flat/Apartment', 'Independent House', 'Villa', 'PG/Co-living'],
  pg:         ['PG/Co-living'],
  plot:       ['Plot/Land'],
  commercial: ['Office Space', 'Shop/Showroom', 'Warehouse', 'Commercial Land'],
};

interface HeroSectionProps {
  backgroundImage?: string;
  headline?: string;
  budgetOptions?: string[];
  popularTags?: string[];
  onSearch?: (params: SearchParams & { listingType?: string }) => void;
  onTagClick?: (tag: string) => void;
}

const HeroSection = ({
  backgroundImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8FHBa8n1ylSHhIN5gv58ewmiHzf8vstPs3C-isLYMHwYTclJtLK5c-lSgf2JJUmZ8ZOF9zv5mwGHX7US9RT1w5MRDK64zOeKa1U5tc0mxx34WndXzN3APqgYhs1YbHGdIWskaLlPcPj4zmIJFEnmJj6YRBDJBwi5IoRclpr-KT2753z1veN2HZ1DdVAFqYOKJMFMWESCiNJU4VlRRppQ-R1cmfe7lRvovIMbD9q-VneyIGbMLUEwG1Rk6K201b3N0LMFoWjrFcH4',
  headline = "Find a home you'll love to live in.",
  budgetOptions,
  popularTags,
  onSearch,
  onTagClick,
}: HeroSectionProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('buy');

  const handleSearch = (params: SearchParams) =>
    onSearch?.({ ...params, listingType: TAB_LISTING_TYPE[activeTab] });

  return (
    <section className="relative min-h-[560px] flex items-center justify-center overflow-hidden">

      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-surface-bright" />
      </div>

      <div className="relative z-10 max-w-[1200px] w-full px-6 py-xl text-center">
        <h1 className="font-h1 text-h1 text-white drop-shadow-lg mb-lg max-w-3xl mx-auto">
          {headline}
        </h1>

        {/* Search card with tabs */}
        <div className="bg-white rounded-xl shadow-2xl max-w-5xl mx-auto">
          {/* Tab row — overflow-hidden here only, so the suggestions dropdown below is not clipped */}
          <div className="flex border-b border-outline-variant rounded-t-xl overflow-hidden">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={[
                  'flex-1 py-3 text-sm font-semibold transition-colors whitespace-nowrap px-2',
                  activeTab === key
                    ? 'text-primary border-b-2 border-primary -mb-px'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search fields — no overflow-hidden here so suggestions dropdown renders outside the card */}
          <div className="p-sm md:p-md rounded-b-xl overflow-visible">
            <SearchBanner
              propertyTypes={TAB_PROPERTY_TYPES[activeTab]}
              budgetOptions={budgetOptions}
              onSearch={handleSearch}
            />
          </div>
        </div>

        <PopularSearchTags
          tags={popularTags}
          onTagClick={onTagClick}
        />
      </div>

    </section>
  );
};

export default HeroSection;
