import SearchBanner, { SearchParams } from './SearchBanner';
import PopularSearchTags from './PopularSearchTags';

interface HeroSectionProps {
  backgroundImage?: string;
  headline?: string;
  propertyTypes?: string[];
  budgetOptions?: string[];
  popularTags?: string[];
  onSearch?: (params: SearchParams) => void;
  onTagClick?: (tag: string) => void;
}

const HeroSection = ({
  backgroundImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8FHBa8n1ylSHhIN5gv58ewmiHzf8vstPs3C-isLYMHwYTclJtLK5c-lSgf2JJUmZ8ZOF9zv5mwGHX7US9RT1w5MRDK64zOeKa1U5tc0mxx34WndXzN3APqgYhs1YbHGdIWskaLlPcPj4zmIJFEnmJj6YRBDJBwi5IoRclpr-KT2753z1veN2HZ1DdVAFqYOKJMFMWESCiNJU4VlRRppQ-R1cmfe7lRvovIMbD9q-VneyIGbMLUEwG1Rk6K201b3N0LMFoWjrFcH4',
  headline = "Find a home you'll love to live in.",
  propertyTypes,
  budgetOptions,
  popularTags,
  onSearch,
  onTagClick,
}: HeroSectionProps) => (
  <section className="relative min-h-[560px] flex items-center justify-center overflow-hidden">

    <div className="absolute inset-0 z-0">
      <img
        src={backgroundImage}
        alt="Hero Background"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-surface-bright" />
    </div>

    <div className="relative z-10 max-w-[1200px] w-full px-6 py-xl text-center">
      <h1 className="font-h1 text-h1 text-white drop-shadow-lg mb-lg max-w-3xl mx-auto">
        {headline}
      </h1>

      <SearchBanner
        propertyTypes={propertyTypes}
        budgetOptions={budgetOptions}
        onSearch={onSearch}
      />

      <PopularSearchTags
        tags={popularTags}
        onTagClick={onTagClick}
      />
    </div>

  </section>
);

export default HeroSection;
