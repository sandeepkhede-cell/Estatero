import { Property } from '../../types/property';
import SectionHeader from '../ui/SectionHeader';
import PropertyCardMini from '../ui/PropertyCardMini';

interface RecommendedSectionProps {
  title?: string;
  properties: Property[];
  onCardClick?: (id: Property['id']) => void;
  onFavourite?: (id: Property['id']) => void;
  onPrev?: () => void;
  onNext?: () => void;
}

const CarouselControls = ({ onPrev, onNext }: { onPrev?: () => void; onNext?: () => void }) => (
  <div className="flex gap-2">
    <button
      onClick={onPrev}
      className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container transition-all"
    >
      <span className="material-symbols-outlined">chevron_left</span>
    </button>
    <button
      onClick={onNext}
      className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container transition-all"
    >
      <span className="material-symbols-outlined">chevron_right</span>
    </button>
  </div>
);

const RecommendedSection = ({
  title = 'Recommended for You',
  properties,
  onCardClick,
  onFavourite,
  onPrev,
  onNext,
}: RecommendedSectionProps) => (
  <section className="bg-surface-container-lowest py-xl">
    <div className="max-w-[1200px] mx-auto px-6">
      <SectionHeader
        title={title}
        action={<CarouselControls onPrev={onPrev} onNext={onNext} />}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {properties.map((property) => (
          <PropertyCardMini
            key={property.id}
            property={property}
            onCardClick={onCardClick}
            onFavourite={onFavourite}
          />
        ))}
      </div>
    </div>
  </section>
);

export default RecommendedSection;
