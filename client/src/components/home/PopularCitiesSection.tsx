import SectionHeader from '../ui/SectionHeader';

interface City {
  name: string;
  listings: string;
  gradient: string;
  emoji: string;
}

const CITIES: City[] = [
  { name: 'Mumbai',    listings: '12,400+ properties', gradient: 'from-blue-600 to-blue-800',    emoji: '🏙️' },
  { name: 'Delhi',     listings: '9,800+ properties',  gradient: 'from-red-600 to-red-800',      emoji: '🕌' },
  { name: 'Bengaluru', listings: '11,200+ properties', gradient: 'from-green-600 to-green-800',  emoji: '🌿' },
  { name: 'Hyderabad', listings: '7,600+ properties',  gradient: 'from-orange-500 to-orange-700',emoji: '💎' },
  { name: 'Pune',      listings: '5,200+ properties',  gradient: 'from-purple-600 to-purple-800',emoji: '🏛️' },
  { name: 'Chennai',   listings: '4,800+ properties',  gradient: 'from-teal-600 to-teal-800',    emoji: '🌊' },
  { name: 'Kolkata',   listings: '3,900+ properties',  gradient: 'from-amber-500 to-amber-700',  emoji: '🌉' },
  { name: 'Noida',     listings: '4,100+ properties',  gradient: 'from-indigo-600 to-indigo-800',emoji: '🏗️' },
];

interface PopularCitiesSectionProps {
  onCityClick?: (city: string) => void;
}

const PopularCitiesSection = ({ onCityClick }: PopularCitiesSectionProps) => (
  <section className="max-w-[1200px] mx-auto px-6 py-xl">
    <SectionHeader title="Explore Popular Cities" />

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-gutter">
      {CITIES.map(({ name, listings, gradient, emoji }) => (
        <button
          key={name}
          onClick={() => onCityClick?.(name)}
          className="group relative rounded-xl overflow-hidden aspect-[4/3] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {/* gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-300 group-hover:scale-105`} />

          {/* subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}
          />

          {/* content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-4">
            <span className="text-3xl">{emoji}</span>
            <div>
              <p className="text-white font-bold text-base leading-tight">{name}</p>
              <p className="text-white/70 text-xs mt-0.5">{listings}</p>
            </div>
          </div>

          {/* hover arrow */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-white text-lg">arrow_forward</span>
          </div>
        </button>
      ))}
    </div>
  </section>
);

export default PopularCitiesSection;
